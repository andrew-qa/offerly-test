import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export type Offer = {
  id: string;
  title: string;
  description: string;
  payout_type: "CPA" | "FIXED" | "CPA+FIXED";
  payout_cpa_amount?: number;
  payout_fixed_amount?: number;
};

export type Influencer = {
  id: string;
  name: string;
};

export async function getInfluencers(): Promise<Influencer[]> {
  const response = await api.get<Influencer[]>("/influencers");
  return response.data;
}

export async function getOffers(): Promise<Offer[]> {
  const response = await api.get<Offer[]>("/offers");
  return response.data;
}

export async function getOffersWithOverrides(
  influencerId: string
): Promise<Offer[]> {
  const response = await api.get<Offer[]>("/offers", {
    params: { influencer_id: influencerId },
  })
  return response.data
}

export async function addInfluencer(name: string): Promise<void> {
  await api.post("/influencers", { name });
}

export type OfferOverrideInput = {
  payout_cpa_amount?: number | null;
  payout_fixed_amount?: number | null;
};

export async function addOffer(offer: Omit<Offer, "id">): Promise<Offer> {
  const response = await api.post<Offer>("/offers", offer);
  return response.data;
}

export async function addOfferOverride(
  offerId: string,
  influencerId: string,
  override: OfferOverrideInput
): Promise<void> {
  await api.post(`/offers/${offerId}/overrides/${influencerId}`, override);
}


