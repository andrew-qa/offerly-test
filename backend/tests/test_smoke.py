import pytest
from fastapi.testclient import TestClient

from backend.app.database import init_db
from backend.app.main import app

init_db()


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_influencer(client):
    influencer_data = {"name": "Test Influencer"}
    response = client.post("/influencers", json=influencer_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == influencer_data["name"]
    assert "id" in data

def test_create_offer(client):
    offer_data = {
        "title": "Test Offer",
        "description": "This is a test offer",
        "payout_type": "CPA",
        "payout_cpa_amount": 100,
        "payout_fixed_amount": None,
    }
    response = client.post("/offers", json=offer_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == offer_data["title"]
    assert data["description"] == offer_data["description"]
    assert data["payout_type"] == offer_data["payout_type"]
    assert data["payout_cpa_amount"] == offer_data["payout_cpa_amount"]
    assert data["payout_fixed_amount"] == offer_data["payout_fixed_amount"]
    assert "id" in data


def test_get_offers_with_override(client):
    influencer_response = client.post("/influencers", json={"name": "Override Influencer"})
    assert influencer_response.status_code == 201
    influencer_id = influencer_response.json()["id"]

    offer_payload = {
        "title": "Offer to Override",
        "description": "Offer with override",
        "payout_type": "CPA+FIXED",
        "payout_cpa_amount": 50,
        "payout_fixed_amount": 200,
    }
    offer_response = client.post("/offers", json=offer_payload)
    assert offer_response.status_code == 201
    offer_id = offer_response.json()["id"]

    override_payload = {
        "payout_cpa_amount": 75,
        "payout_fixed_amount": 250,
    }
    override_response = client.post(
        f"/offers/{offer_id}/overrides/{influencer_id}",
        json=override_payload,
    )
    assert override_response.status_code == 201

    offers_response = client.get(f"/offers?influencer_id={influencer_id}")
    assert offers_response.status_code == 200
    offers = offers_response.json()
    assert isinstance(offers, list)

    matching_offer = next((offer for offer in offers if offer["id"] == offer_id), None)
    assert matching_offer is not None
    assert matching_offer["payout_cpa_amount"] == override_payload["payout_cpa_amount"]
    assert matching_offer["payout_fixed_amount"] == override_payload["payout_fixed_amount"]
