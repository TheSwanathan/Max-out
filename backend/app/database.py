import os
from pathlib import Path
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./maxout.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def run_migrations():
    """Apply lightweight schema fixes for local SQLite development."""
    inspector = inspect(engine)

    if "workouts" not in inspector.get_table_names():
        return

    workout_columns = {column["name"] for column in inspector.get_columns("workouts")}
    if "points_earned" in workout_columns:
        return

    with engine.begin() as connection:
        connection.execute(
            text("ALTER TABLE workouts ADD COLUMN points_earned INTEGER NOT NULL DEFAULT 0")
        )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
