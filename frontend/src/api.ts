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

export async function getOffers(): Promise<Offer[]> {
  const response = await api.get<Offer[]>("/offers");
  return response.data;
}
