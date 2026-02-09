from enum import Enum

class PayoutType(str, Enum):
    CPA = "CPA"
    FIXED = "FIXED"
    CPA_FIXED = "CPA+FIXED"
