"""Backend API tests for 'Watches by M.S' e-commerce app."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8000").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root / Brand ----------
class TestRoot:
    def test_root_brand(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data["brand"] == "Watches by M.S"
        assert "tagline" in data and isinstance(data["tagline"], str)
        assert data["status"] == "ok"


# ---------- Collections ----------
class TestCollections:
    def test_list_collections(self, client):
        r = client.get(f"{API}/collections")
        assert r.status_code == 200
        cols = r.json()
        assert isinstance(cols, list)
        assert len(cols) == 8, f"Expected 8 collections, got {len(cols)}"
        handles = {c["handle"] for c in cols}
        for h in ["mens", "womens", "smart", "luxury", "couple", "automatic", "limited-edition", "leather"]:
            assert h in handles, f"Missing collection handle: {h}"
        for c in cols:
            assert "_id" not in c
            assert c["title"] and c["description"] and c["image"]

    def test_get_collection_valid(self, client):
        r = client.get(f"{API}/collections/luxury")
        assert r.status_code == 200
        body = r.json()
        assert "collection" in body and "products" in body
        assert body["collection"]["handle"] == "luxury"
        assert isinstance(body["products"], list) and len(body["products"]) > 0
        for p in body["products"]:
            assert "luxury" in p["collections"]

    def test_get_collection_404(self, client):
        r = client.get(f"{API}/collections/nope-xyz")
        assert r.status_code == 404


# ---------- Products ----------
class TestProducts:
    def test_list_all(self, client):
        r = client.get(f"{API}/products")
        assert r.status_code == 200
        prods = r.json()
        assert isinstance(prods, list)
        assert len(prods) == 12, f"Expected 12 products, got {len(prods)}"
        for p in prods:
            assert "_id" not in p
            assert p["handle"] and p["title"] and p["price"] > 0
            assert isinstance(p["images"], list) and len(p["images"]) >= 1

    def test_filter_by_collection(self, client):
        r = client.get(f"{API}/products", params={"collection": "mens"})
        assert r.status_code == 200
        prods = r.json()
        assert len(prods) > 0
        for p in prods:
            assert "mens" in p["collections"]

    def test_filter_by_tag_new(self, client):
        r = client.get(f"{API}/products", params={"tag": "new"})
        assert r.status_code == 200
        prods = r.json()
        assert len(prods) > 0
        for p in prods:
            assert "new" in p["tags"]

    def test_filter_by_tag_bestseller(self, client):
        r = client.get(f"{API}/products", params={"tag": "bestseller"})
        assert r.status_code == 200
        prods = r.json()
        assert len(prods) > 0
        for p in prods:
            assert "bestseller" in p["tags"]

    def test_get_product_by_handle(self, client):
        r = client.get(f"{API}/products/ms-meridian-gold-automatic")
        assert r.status_code == 200
        p = r.json()
        assert p["handle"] == "ms-meridian-gold-automatic"
        assert p["title"] == "Meridian Gold Automatic"
        assert p["price"] == 24999
        assert len(p["images"]) >= 1
        assert p["movement"]

    def test_get_product_404(self, client):
        r = client.get(f"{API}/products/no-such-watch")
        assert r.status_code == 404


# ---------- Search ----------
class TestSearch:
    def test_search_gold(self, client):
        r = client.get(f"{API}/search", params={"q": "gold"})
        assert r.status_code == 200
        data = r.json()
        assert "products" in data and "collections" in data
        assert len(data["products"]) > 0
        joined = " ".join(p["title"].lower() for p in data["products"])
        assert "gold" in joined

    def test_search_aurora(self, client):
        r = client.get(f"{API}/search", params={"q": "aurora"})
        assert r.status_code == 200
        data = r.json()
        assert len(data["products"]) >= 1
        assert any("aurora" in p["title"].lower() for p in data["products"])

    def test_search_empty(self, client):
        r = client.get(f"{API}/search", params={"q": ""})
        assert r.status_code == 200
        data = r.json()
        assert data["products"] == [] and data["collections"] == []


# ---------- Checkout ----------
class TestCheckout:
    def test_checkout_returns_stub_url(self, client):
        # Get a valid product first
        p = client.get(f"{API}/products/ms-aurora-rose-gold").json()
        payload = {"lines": [{"product_id": p["id"], "quantity": 2}], "email": "TEST_buyer@example.com"}
        r = client.post(f"{API}/checkout", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["order_id"]
        assert data["total"] == p["price"] * 2
        assert data["checkout_url"].startswith("/checkout/confirm?order=")
        assert data["provider"] == "shopify_pending"
        assert len(data["items"]) == 1
        assert data["items"][0]["title"] == p["title"]

    def test_checkout_empty_lines(self, client):
        r = client.post(f"{API}/checkout", json={"lines": []})
        assert r.status_code == 200
        data = r.json()
        assert data["total"] == 0
        assert data["items"] == []
        assert data["checkout_url"].startswith("/checkout/confirm?order=")

    def test_checkout_invalid_product(self, client):
        r = client.post(f"{API}/checkout", json={"lines": [{"product_id": "nonexistent-uuid", "quantity": 1}]})
        # Invalid items are skipped; should still return 200 with total=0
        assert r.status_code == 200
        assert r.json()["total"] == 0
