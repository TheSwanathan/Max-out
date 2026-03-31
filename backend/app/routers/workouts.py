from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..engines.points_engine import calculate_points, get_level

from ..auth import get_current_user

router = APIRouter(prefix="/workouts", tags=["workouts"])


@router.post("/", response_model=schemas.WorkoutResult)
def log_workout(
    workout: schemas.WorkoutCreate, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Log a new workout with exercises and automatically award points."""
    user = current_user
    user_id = user.id

    # 1. Persist the workout
    db_workout = models.Workout(user_id=user_id, notes=workout.notes)
    db.add(db_workout)
    db.flush()  # populate db_workout.id

    # 2. Persist exercises
    db_exercises = []
    for ex in workout.exercises:
        db_ex = models.Exercise(workout_id=db_workout.id, **ex.dict())
        db.add(db_ex)
        db_exercises.append(db_ex)
    db.flush()

    # 3. Score the workout (engines read from DB, excluding this workout for PR comparisons)
    result = calculate_points(db, user_id, db_workout.id, db_exercises)

    # 4. Update user
    old_level = user.level
    user.total_points += result["points"]
    user.level = get_level(user.total_points)
    level_up = user.level > old_level

    db.commit()
    db.refresh(db_workout)

    return schemas.WorkoutResult(
        workout=db_workout,
        points_earned=result["points"],
        breakdown=result["breakdown"],
        is_pr=result["is_pr"],
        streak=result["streak"],
        level_up=level_up,
        new_level=user.level,
        new_total_points=user.total_points,
    )


@router.get("/", response_model=List[schemas.WorkoutOut])
def get_workouts(
    limit: int = 20, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Fetch the most recent workouts for a user."""
    return (
        db.query(models.Workout)
        .filter(models.Workout.user_id == current_user.id)
        .order_by(models.Workout.date.desc())
        .limit(limit)
        .all()
    )
