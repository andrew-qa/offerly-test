from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List
from uuid import UUID
from sqlmodel import Session, select

from app.database import get_session
from app.models import Influencer

router = APIRouter(prefix="/influencers", tags=["influencers"])


@router.get("", response_model=List[Influencer])
def get_influencers(session: Session = Depends(get_session)):
    influencers = session.exec(select(Influencer)).all()

    return influencers


@router.post("", response_model=Influencer, status_code=201)
def create_influencer(influencer: Influencer, session: Session = Depends(get_session)):
    new_influencer = Influencer.model_validate(influencer)

    session.add(new_influencer)
    session.commit()
    session.refresh(new_influencer)

    return new_influencer


@router.delete("/{influencer_id}", status_code=204)
def delete_influencer(influencer_id: UUID, session: Session = Depends(get_session)):
    influencer = session.get(Influencer, influencer_id)

    if not influencer:
        raise HTTPException(status_code=404, detail="Influencer not found")

    session.delete(influencer)
    session.commit()
    return Response(status_code=204)
