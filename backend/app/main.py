from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, SessionLocal, Base
from . import models
from .routers import workouts, performance, upgrades, users, auth

# ── Create all tables ──────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Max-out API",
    description="Gamified lifting tracker — performance-based rewards engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount routers ─────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(workouts.router)
app.include_router(performance.router)
app.include_router(upgrades.router)
app.include_router(users.router)


@app.on_event("startup")
def seed_data():
    """Seed a default user and the initial upgrade catalog on first start."""
    db = SessionLocal()
    try:
        # Upgrade catalog
        if db.query(models.Upgrade).count() == 0:
            catalog = [
                models.Upgrade(
                    name="PR Boost",
                    description="+10% bonus points whenever you hit a personal record.",
                    effect_type="pr_multiplier",
                    value=1.1,
                    cost=50,
                ),
                models.Upgrade(
                    name="Streak Shield",
                    description="Preserve your streak if you miss a single day.",
                    effect_type="streak_shield",
                    value=1.0,
                    cost=75,
                ),
                models.Upgrade(
                    name="Volume Amplifier",
                    description="+5 flat bonus points added to every workout you log.",
                    effect_type="volume_bonus",
                    value=5.0,
                    cost=100,
                ),
                models.Upgrade(
                    name="Weekend Warrior",
                    description="2× points on all workouts completed on weekends.",
                    effect_type="weekend_multiplier",
                    value=2.0,
                    cost=150,
                ),
            ]
            db.add_all(catalog)
            db.commit()
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Max-out API running 🏋️", "docs": "/docs"}
