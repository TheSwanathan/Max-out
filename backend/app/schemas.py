from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


# ─── Exercise ────────────────────────────────────────────────────────────────

class ExerciseCreate(BaseModel):
    name: str
    weight: float
    reps: int
    sets: int


class ExerciseOut(ExerciseCreate):
    id: int
    workout_id: int

    class Config:
        from_attributes = True


# ─── Workout ─────────────────────────────────────────────────────────────────

class WorkoutCreate(BaseModel):
    notes: Optional[str] = None
    exercises: List[ExerciseCreate]


class WorkoutOut(BaseModel):
    id: int
    user_id: int
    date: datetime
    notes: Optional[str]
    exercises: List[ExerciseOut]

    class Config:
        from_attributes = True


class WorkoutResult(BaseModel):
    workout: WorkoutOut
    points_earned: int
    breakdown: Dict[str, Any]
    is_pr: bool
    streak: int
    level_up: bool
    new_level: int
    new_total_points: int


# ─── Performance ─────────────────────────────────────────────────────────────

class PerformanceOut(BaseModel):
    user_id: int
    streak: int
    prs: Dict[str, float]
    total_volume: float
    workouts_count: int


# ─── Upgrade ─────────────────────────────────────────────────────────────────

class UpgradeOut(BaseModel):
    id: int
    name: str
    description: str
    effect_type: str
    value: float
    cost: int
    owned: bool = False

    class Config:
        from_attributes = True


class UnlockRequest(BaseModel):
    user_id: int
    upgrade_id: int


class UnlockResult(BaseModel):
    success: bool
    message: str
    remaining_points: int


# ─── Auth / User ──────────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = None

class UserCreate(BaseModel):
    username: str
    password: str
    bodyweight: float

class UserBodyweightUpdate(BaseModel):
    bodyweight: float

class UserOut(BaseModel):
    id: int
    username: str
    total_points: int
    level: int
    bodyweight: float

    class Config:
        from_attributes = True
