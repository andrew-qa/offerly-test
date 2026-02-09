from typing import Optional
from pydantic import BaseModel

class OfferOverrideInput(BaseModel):
    payout_cpa_amount: Optional[int] = None
    payout_fixed_amount: Optional[int] = None
