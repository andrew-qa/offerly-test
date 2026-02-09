from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, UniqueConstraint
from typing import Optional

from .enums import PayoutType


class Offer(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=256)
    description: str = Field(max_length=2048)
    payout_type: PayoutType
    payout_cpa_amount: Optional[int] = None
    payout_fixed_amount: Optional[int] = None


class Influencer(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str


class OfferInfluencerPayoutOverride(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("offer_id", "influencer_id", name="uq_payout_override"),
    )

    offer_id: UUID = Field(foreign_key="offer.id", primary_key=True)
    influencer_id: UUID = Field(foreign_key="influencer.id", primary_key=True)
    payout_cpa_amount: Optional[int] = None
    payout_fixed_amount: Optional[int] = None
