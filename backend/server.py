from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, uuid, logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Watches by M.S API")
api_router = APIRouter(prefix="/api")


# ---------- MODELS ----------
class Variant(BaseModel):
    id: str
    title: str
    price: float
    compare_at_price: Optional[float] = None
    available: bool = True


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    handle: str
    title: str
    subtitle: Optional[str] = None
    description: str
    price: float
    compare_at_price: Optional[float] = None
    images: List[str] = []
    collections: List[str] = []
    tags: List[str] = []
    rating: float = 4.8
    reviews_count: int = 0
    badges: List[str] = []
    variants: List[Variant] = []
    movement: Optional[str] = None
    strap: Optional[str] = None
    water_resistance: Optional[str] = None
    warranty: str = "Fast Delivery"
    in_stock: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Collection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    handle: str
    title: str
    description: str
    image: str
    hero_image: Optional[str] = None
    featured: bool = False


class CartLine(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int = 1


class CheckoutRequest(BaseModel):
    lines: List[CartLine]
    email: Optional[str] = None


# ---------- SEED DATA ----------
COLLECTIONS_SEED = [
    {"handle": "mens", "title": "Men's Watches", "description": "Bold timepieces engineered for the modern gentleman.", "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", "hero_image": "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=85", "featured": True},
    {"handle": "womens", "title": "Women's Watches", "description": "Elegant silhouettes crafted with refined detail.", "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", "hero_image": "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=1600&q=85", "featured": True},
    {"handle": "smart", "title": "Smart Watches", "description": "Heritage craftsmanship meets modern technology.", "image": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80", "hero_image": "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1600&q=85", "featured": True},
    {"handle": "luxury", "title": "Luxury Edition", "description": "Our finest creations, reserved for the discerning few.", "image": "https://images.unsplash.com/photo-1639037687665-37cf61fd0a96?w=600&q=80", "hero_image": "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&q=85", "featured": True},
    {"handle": "couple", "title": "Couple Watches", "description": "Pairs designed to celebrate a shared moment in time.", "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80", "featured": False},
    {"handle": "automatic", "title": "Automatic", "description": "Self-winding mechanical movements, perpetual elegance.", "image": "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&q=80", "featured": False},
    {"handle": "limited-edition", "title": "Limited Edition", "description": "Rare, numbered pieces. Once they're gone, they're gone.", "image": "https://images.unsplash.com/photo-1606293459209-77df5c8eea66?w=600&q=80", "featured": False},
    {"handle": "leather", "title": "Premium Leather", "description": "Italian leather straps, hand-stitched in Ajmer.", "image": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80", "featured": False},
]

WATCH_IMAGES = [
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=900&q=85",
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&q=85",
    "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=900&q=85",
    "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=900&q=85",
    "https://images.unsplash.com/photo-1548171915-c80f4c6d3c7e?w=900&q=85",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=900&q=85",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=85",
    "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=900&q=85",
    "https://images.unsplash.com/photo-1639037687665-37cf61fd0a96?w=900&q=85",
    "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=900&q=85",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=900&q=85",
    "https://images.unsplash.com/photo-1606293459209-77df5c8eea66?w=900&q=85",
    "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=900&q=85",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&q=85",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=85",
    "https://images.unsplash.com/photo-1620625517537-b1cb6b18c3d2?w=900&q=85",
]

PRODUCTS_SEED = [
    {"handle": "ms-meridian-gold-automatic", "title": "Meridian Gold Automatic", "subtitle": "44mm · Sapphire Crystal", "price": 24999, "compare_at_price": 34999, "collections": ["mens", "luxury", "automatic"], "tags": ["new", "bestseller"], "badges": ["New"], "movement": "Swiss Automatic", "strap": "18K Gold Plated Stainless Steel", "water_resistance": "100m"},
    {"handle": "ms-aurora-rose-gold", "title": "Aurora Rose Gold", "subtitle": "36mm · Diamond Index", "price": 18999, "compare_at_price": 26999, "collections": ["womens", "luxury"], "tags": ["bestseller"], "badges": ["Limited"], "movement": "Quartz Premium", "strap": "Rose Gold Mesh", "water_resistance": "50m"},
    {"handle": "ms-velocity-chronograph", "title": "Velocity Chronograph", "subtitle": "42mm · Tachymeter", "price": 12999, "compare_at_price": 19999, "collections": ["mens", "automatic"], "tags": ["new"], "badges": ["New"], "movement": "Japanese Automatic", "strap": "Italian Leather", "water_resistance": "200m"},
    {"handle": "ms-aristocrat-skeleton", "title": "Aristocrat Skeleton", "subtitle": "41mm · Open Heart", "price": 32999, "compare_at_price": 44999, "collections": ["mens", "luxury", "automatic", "limited-edition"], "tags": ["limited"], "badges": ["Limited"], "movement": "Swiss Skeleton Automatic", "strap": "Crocodile Leather", "water_resistance": "50m"},
    {"handle": "ms-diva-pearl", "title": "Diva Pearl", "subtitle": "32mm · Mother of Pearl", "price": 9999, "compare_at_price": 14999, "collections": ["womens", "leather"], "tags": ["bestseller"], "badges": [], "movement": "Quartz", "strap": "Pearl White Leather", "water_resistance": "30m"},
    {"handle": "ms-elite-noir", "title": "Elite Noir", "subtitle": "40mm · Onyx Dial", "price": 15999, "compare_at_price": 22999, "collections": ["mens", "leather"], "tags": ["new"], "badges": ["New"], "movement": "Swiss Quartz", "strap": "Black Italian Leather", "water_resistance": "100m"},
    {"handle": "ms-scarlet-snake", "title": "Scarlet Snake Band", "subtitle": "30mm · Oval Designer", "price": 7999, "compare_at_price": 11999, "collections": ["womens"], "tags": [], "badges": [], "movement": "Quartz", "strap": "Stainless Steel Snake Mesh", "water_resistance": "30m"},
    {"handle": "ms-iconic-titanium", "title": "Iconic Titanium", "subtitle": "43mm · Aerospace Grade", "price": 21999, "compare_at_price": 29999, "collections": ["mens", "luxury"], "tags": ["bestseller"], "badges": [], "movement": "Swiss Automatic", "strap": "Titanium Bracelet", "water_resistance": "300m"},
    {"handle": "ms-smart-classic", "title": "M.S Smart Classic", "subtitle": "44mm · AMOLED Display", "price": 13999, "compare_at_price": 18999, "collections": ["smart"], "tags": ["new"], "badges": ["New"], "movement": "Smart Hybrid", "strap": "Silicone & Steel", "water_resistance": "50m"},
    {"handle": "ms-imperial-blue", "title": "Imperial Blue", "subtitle": "42mm · Sunburst Dial", "price": 17999, "compare_at_price": 23999, "collections": ["mens", "automatic"], "tags": [], "badges": [], "movement": "Japanese Automatic", "strap": "Blue Alligator Leather", "water_resistance": "100m"},
    {"handle": "ms-eternal-couple", "title": "Eternal Couple Set", "subtitle": "His & Hers · Matched", "price": 22999, "compare_at_price": 32999, "collections": ["couple", "luxury"], "tags": ["bestseller"], "badges": ["Set of 2"], "movement": "Quartz Premium", "strap": "Rose Gold & Silver", "water_resistance": "50m"},
    {"handle": "ms-heritage-1947", "title": "Heritage 1947", "subtitle": "39mm · Vintage Edition", "price": 28999, "compare_at_price": 38999, "collections": ["luxury", "limited-edition", "leather"], "tags": ["limited"], "badges": ["1947 of 2026"], "movement": "Swiss Manual Wind", "strap": "Vintage Tan Leather", "water_resistance": "30m"},
]


async def seed_db():
    if await db.collections.count_documents({}) == 0:
        await db.collections.insert_many([{**c, "id": str(uuid.uuid4())} for c in COLLECTIONS_SEED])
    if await db.products.count_documents({}) == 0:
        docs = []
        for i, p in enumerate(PRODUCTS_SEED):
            img1 = WATCH_IMAGES[i % len(WATCH_IMAGES)]
            img2 = WATCH_IMAGES[(i + 3) % len(WATCH_IMAGES)]
            img3 = WATCH_IMAGES[(i + 7) % len(WATCH_IMAGES)]
            docs.append({
                "id": str(uuid.uuid4()), "handle": p["handle"], "title": p["title"],
                "subtitle": p.get("subtitle"), "description": f"The {p['title']} represents the pinnacle of horological craftsmanship from Ajmer. Featuring a {p.get('movement','precision')} movement, premium {p.get('strap','strap')}, and {p.get('water_resistance','30m')} water resistance. Hand-finished by master watchmakers. Includes luxury presentation box and warranty certificate.",
                "price": p["price"], "compare_at_price": p.get("compare_at_price"),
                "images": [img1, img2, img3], "collections": p["collections"], "tags": p["tags"],
                "rating": round(4.5 + (i % 5) * 0.1, 1), "reviews_count": 120 + i * 17,
                "badges": p["badges"], "movement": p.get("movement"), "strap": p.get("strap"),
                "water_resistance": p.get("water_resistance"), "warranty": "Fast Delivery",
                "in_stock": True, "variants": [{"id": str(uuid.uuid4()), "title": "Default", "price": p["price"], "compare_at_price": p.get("compare_at_price"), "available": True}],
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        await db.products.insert_many(docs)


# ---------- ROUTES ----------
@api_router.get("/")
async def root():
    return {"brand": "Watches by M.S", "tagline": "Time Crafted For Excellence", "status": "ok"}


@api_router.get("/collections", response_model=List[Collection])
async def list_collections():
    docs = await db.collections.find({}, {"_id": 0}).to_list(100)
    return docs


@api_router.get("/collections/{handle}")
async def get_collection(handle: str):
    coll = await db.collections.find_one({"handle": handle}, {"_id": 0})
    if not coll:
        raise HTTPException(404, "Collection not found")
    products = await db.products.find({"collections": handle}, {"_id": 0}).to_list(100)
    return {"collection": coll, "products": products}


@api_router.get("/products", response_model=List[Product])
async def list_products(collection: Optional[str] = None, tag: Optional[str] = None, limit: int = 100):
    query = {}
    if collection:
        query["collections"] = collection
    if tag:
        query["tags"] = tag
    docs = await db.products.find(query, {"_id": 0}).to_list(limit)
    return docs


@api_router.get("/products/{handle}", response_model=Product)
async def get_product(handle: str):
    doc = await db.products.find_one({"handle": handle}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


@api_router.get("/search")
async def search(q: str = ""):
    if not q or len(q) < 1:
        return {"products": [], "collections": []}
    regex = {"$regex": q, "$options": "i"}
    products = await db.products.find(
        {"$or": [{"title": regex}, {"description": regex}, {"tags": regex}]},
        {"_id": 0}
    ).limit(8).to_list(8)
    colls = await db.collections.find({"title": regex}, {"_id": 0}).limit(4).to_list(4)
    return {"products": products, "collections": colls}


@api_router.post("/checkout")
async def create_checkout(req: CheckoutRequest):
    # Shopify-ready stub. When credentials are added, this will create a Shopify cart
    # via Storefront API and return checkoutUrl from cart.checkoutUrl.
    # For now: compute total and return a placeholder checkout URL.
    total = 0.0
    items = []
    for line in req.lines:
        p = await db.products.find_one({"id": line.product_id}, {"_id": 0})
        if not p:
            continue
        total += p["price"] * line.quantity
        items.append({"title": p["title"], "price": p["price"], "quantity": line.quantity})
    order_id = str(uuid.uuid4())
    await db.orders.insert_one({
        "id": order_id, "items": items, "total": total, "email": req.email,
        "status": "pending_shopify_checkout",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {
        "order_id": order_id,
        "total": total,
        "items": items,
        "checkout_url": f"/checkout/confirm?order={order_id}",
        "provider": "shopify_pending",
        "message": "Shopify checkout will be wired once Storefront API credentials are provided."
    }


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware, allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"], allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)


@app.on_event("startup")
async def on_startup():
    await seed_db()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
