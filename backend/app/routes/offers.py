from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select

from app.database import get_session
from app.models import Offer, Influencer, OfferInfluencerPayoutOverride
from app.schemas import OfferOverrideInput

router = APIRouter(prefix="/offers", tags=["offers"])


def get_cpa_amount(
    override: OfferInfluencerPayoutOverride, offer: Offer
) -> Optional[int]:
    if override.payout_cpa_amount is not None:
        return override.payout_cpa_amount
    return offer.payout_cpa_amount


def get_fixed_amount(
    override: OfferInfluencerPayoutOverride, offer: Offer
) -> Optional[int]:
    if override.payout_fixed_amount is not None:
        return override.payout_fixed_amount
    return offer.payout_fixed_amount


def apply_overrides(
    offers: list[Offer], overrides: list[OfferInfluencerPayoutOverride]
) -> list[Offer]:
    override_map = {o.offer_id: o for o in overrides}

    result = []
    for offer in offers:
        override = override_map.get(offer.id)

        #  Overrides takes precedence over offer defaults
        if override:
            cpa_amount = get_cpa_amount(override, offer)
            fixed_amount = get_fixed_amount(override, offer)

            offer_data = offer.model_dump()
            offer_data["payout_cpa_amount"] = cpa_amount
            offer_data["payout_fixed_amount"] = fixed_amount
            updated_offer = Offer(**offer_data)
            result.append(updated_offer)
        else:
            result.append(offer)

    return result


@router.get("", response_model=List[Offer])
def get_offers(
    influencer_id: Optional[UUID] = None, session: Session = Depends(get_session)
):
    # Fetch all offers and overrides for the influencer
    offers = session.exec(select(Offer)).all()

    if not influencer_id:
        return offers

    overrides = session.exec(
        select(OfferInfluencerPayoutOverride).where(
            OfferInfluencerPayoutOverride.influencer_id == influencer_id
        )
    ).all()

    return apply_overrides(offers, overrides)


@router.post("", response_model=Offer, status_code=201)
def create_offer(offer: Offer, session: Session = Depends(get_session)):
    new_offer = Offer.model_validate(offer)
    
    session.add(new_offer)
    session.commit()
    session.refresh(new_offer)
    return new_offer


@router.put("/{offer_id}", response_model=Offer)
def update_offer(offer_id: UUID, offer: Offer, session: Session = Depends(get_session)):
    existing_offer = session.get(Offer, offer_id)
    if not existing_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    offer_data = offer.model_dump(exclude={"id"})
    for field, value in offer_data.items():
        setattr(existing_offer, field, value)
    
    session.add(existing_offer)
    session.commit()
    session.refresh(existing_offer)

    return existing_offer


@router.post("/{offer_id}/overrides/{influencer_id}", status_code=201)
def create_offer_override(
    offer_id: UUID,
    influencer_id: UUID,
    override: OfferOverrideInput,
    session: Session = Depends(get_session),
):
    # Check that both exist
    offer = session.get(Offer, offer_id)
    influencer = session.get(Influencer, influencer_id)
    if not offer or not influencer:
        raise HTTPException(status_code=404, detail="Offer or Influencer not found")

    new_override = OfferInfluencerPayoutOverride(
        offer_id=offer_id, influencer_id=influencer_id, **override.model_dump()
    )
    session.add(new_override)
    session.commit()
    return {"message": "Override created"}
