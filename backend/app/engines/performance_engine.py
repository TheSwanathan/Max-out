from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .. import models


def detect_pr(db: Session, user_id: int, exercise_name: str, weight: float, exclude_workout_id: int) -> bool:
    """Return True if this weight is a new personal record for the exercise."""
    past = (
        db.query(models.Exercise)
        .join(models.Workout)
        .filter(
            models.Workout.user_id == user_id,
            models.Workout.id != exclude_workout_id,
            models.Exercise.name == exercise_name,
        )
        .all()
    )
    if not past:
        return False  # No history → can't be a PR yet
    return weight > max(e.weight for e in past)


def calculate_volume(exercises) -> float:
    """Total volume = Σ (weight × reps × sets) across all exercises."""
    return sum(e.weight * e.reps * e.sets for e in exercises)


def get_streak(db: Session, user_id: int) -> int:
    """Count how many consecutive calendar days the user has had at least one workout."""
    workouts = (
        db.query(models.Workout)
        .filter(models.Workout.user_id == user_id)
        .order_by(models.Workout.date.desc())
        .all()
    )
    if not workouts:
        return 0

    workout_dates = {w.date.date() for w in workouts}
    today = datetime.utcnow().date()
    streak = 0

    for offset in range(365):
        check = today - timedelta(days=offset)
        if check in workout_dates:
            streak += 1
        else:
            break

    return streak


def get_previous_avg_volume(db: Session, user_id: int, exclude_workout_id: int, limit: int = 5) -> float:
    """Average volume of the user's last N workouts (excluding the current one)."""
    past_workouts = (
        db.query(models.Workout)
        .filter(
            models.Workout.user_id == user_id,
            models.Workout.id != exclude_workout_id,
        )
        .order_by(models.Workout.date.desc())
        .limit(limit)
        .all()
    )
    if not past_workouts:
        return 0.0

    volumes = [calculate_volume(w.exercises) for w in past_workouts]
    return sum(volumes) / len(volumes) if volumes else 0.0


def get_prs(db: Session, user_id: int) -> dict:
    """Return the best (heaviest) weight ever lifted per exercise for the user."""
    exercises = (
        db.query(models.Exercise)
        .join(models.Workout)
        .filter(models.Workout.user_id == user_id)
        .all()
    )
    prs: dict = {}
    for ex in exercises:
        if ex.name not in prs or ex.weight > prs[ex.name]:
            prs[ex.name] = ex.weight
    return prs
