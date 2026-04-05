import { EXERCISE_LIBRARY } from './exerciseLibrary'

const MUSCLE_GROUPS = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
const BODYWEIGHT_EXERCISES = new Set(['Pull-ups', 'Chin-ups', 'Push-ups', 'Dips', 'Plank'])

const BASE_THRESHOLDS = {
  squat:           [0.45, 0.75, 1.0, 1.35, 1.7, 2.1],
  hinge:           [0.55, 0.9, 1.2, 1.6, 2.0, 2.45],
  horizontalPress: [0.35, 0.55, 0.8, 1.0, 1.25, 1.5],
  verticalPress:   [0.2, 0.35, 0.5, 0.68, 0.82, 1.0],
  horizontalPull:  [0.3, 0.5, 0.7, 0.92, 1.15, 1.38],
  verticalPull:    [0.4, 0.65, 0.9, 1.05, 1.2, 1.35],
  chestAccessory:  [0.18, 0.3, 0.45, 0.62, 0.78, 0.95],
  legAccessory:    [0.25, 0.45, 0.7, 0.95, 1.2, 1.45],
  shoulderIso:     [0.08, 0.14, 0.22, 0.32, 0.42, 0.54],
  armIso:          [0.1, 0.18, 0.28, 0.4, 0.52, 0.68],
  core:            [0.15, 0.28, 0.42, 0.58, 0.78, 1.0],
}

const EXERCISE_STANDARD_GROUPS = {
  'Barbell Bench Press': 'horizontalPress',
  'Dumbbell Bench Press': 'horizontalPress',
  'Incline Chest Press': 'horizontalPress',
  'Chest Fly': 'chestAccessory',
  'Cable Fly': 'chestAccessory',
  'Push-ups': 'horizontalPress',
  'Dips': 'horizontalPress',
  'Pull-ups': 'verticalPull',
  'Chin-ups': 'verticalPull',
  'Lat Pulldown': 'verticalPull',
  'Barbell Row': 'horizontalPull',
  'Dumbbell Row': 'horizontalPull',
  'Seated Cable Row': 'horizontalPull',
  'T-Bar Row': 'horizontalPull',
  'Deadlift': 'hinge',
  'Squat': 'squat',
  'Front Squat': 'squat',
  'Leg Press': 'legAccessory',
  'Lunges': 'legAccessory',
  'Bulgarian Split Squat': 'legAccessory',
  'Step-ups': 'legAccessory',
  'Leg Extension': 'legAccessory',
  'Leg Curl': 'legAccessory',
  'Romanian Deadlift': 'hinge',
  'Calf Raises': 'legAccessory',
  'Overhead Press': 'verticalPress',
  'Arnold Press': 'verticalPress',
  'Lateral Raise': 'shoulderIso',
  'Front Raise': 'shoulderIso',
  'Rear Delt Fly': 'shoulderIso',
  'Upright Row': 'horizontalPull',
  'Barbell Curl': 'armIso',
  'Dumbbell Curl': 'armIso',
  'Hammer Curl': 'armIso',
  'Preacher Curl': 'armIso',
  'Tricep Pushdown': 'armIso',
  'Skullcrusher': 'armIso',
  'Overhead Tricep Extension': 'armIso',
  'Plank': 'core',
  'Crunches': 'core',
  'Sit-ups': 'core',
  'Hanging Leg Raise': 'core',
  'Russian Twists': 'core',
  'Cable Crunch': 'core',
  'Ab Wheel Rollout': 'core',
}

const PERCENTILE_STOPS = [10, 25, 40, 55, 70, 85, 97]

export const calculate1RM = (weight, reps) => weight * (1 + reps / 30)

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const interpolate = (input, inMin, inMax, outMin, outMax) => {
  if (inMax === inMin) return outMax
  const ratio = (input - inMin) / (inMax - inMin)
  return outMin + ratio * (outMax - outMin)
}

const getStandardThresholds = (exerciseName) => {
  const group = EXERCISE_STANDARD_GROUPS[exerciseName]
  return group ? BASE_THRESHOLDS[group] : BASE_THRESHOLDS.armIso
}

const getEstimatedLoad = (exerciseName, weight, reps, bodyweight) => {
  if (BODYWEIGHT_EXERCISES.has(exerciseName)) {
    if (exerciseName === 'Plank') {
      return bodyweight * (1 + Math.min(reps, 120) / 60)
    }
    return Math.max(weight, bodyweight)
  }

  return calculate1RM(weight, reps)
}

const getStrengthPercentile = (exerciseName, weight, reps, bodyweight) => {
  const normalized = getEstimatedLoad(exerciseName, weight, reps, bodyweight) / bodyweight
  const thresholds = getStandardThresholds(exerciseName)

  if (normalized <= thresholds[0]) {
    return clamp(interpolate(normalized, 0, thresholds[0], 1, PERCENTILE_STOPS[0]), 1, 99)
  }

  for (let i = 1; i < thresholds.length; i += 1) {
    if (normalized <= thresholds[i]) {
      return interpolate(
        normalized,
        thresholds[i - 1],
        thresholds[i],
        PERCENTILE_STOPS[i - 1],
        PERCENTILE_STOPS[i]
      )
    }
  }

  return clamp(
    interpolate(normalized, thresholds[thresholds.length - 1], thresholds[thresholds.length - 1] * 1.25, 97, 99.5),
    97,
    99.5
  )
}

const getExerciseReliability = (exerciseName, exerciseType) => {
  const standardsGroup = EXERCISE_STANDARD_GROUPS[exerciseName]

  if (standardsGroup === 'squat' || standardsGroup === 'hinge') return 1
  if (
    standardsGroup === 'horizontalPress' ||
    standardsGroup === 'verticalPress' ||
    standardsGroup === 'horizontalPull' ||
    standardsGroup === 'verticalPull'
  ) return 0.92
  if (exerciseType === 'secondary') return 0.8
  if (exerciseType === 'isolation') return 0.65
  return 0.75
}

const getRecencyWeight = (daysSinceLog) => {
  if (daysSinceLog <= 7) return 1
  if (daysSinceLog <= 30) return 0.92
  if (daysSinceLog <= 60) return 0.84
  if (daysSinceLog <= 90) return 0.74
  if (daysSinceLog <= 180) return 0.6
  return 0.45
}

const getContributionWeights = (definition) => {
  const contributions = [{ muscle: definition.primary, share: 0.7 }]
  const secondaries = definition.secondary || []

  if (secondaries.length > 0) {
    const secondaryShare = 0.3 / secondaries.length
    secondaries.forEach(muscle => {
      contributions.push({ muscle, share: secondaryShare })
    })
  }

  return contributions
}

export const buildCurrentMuscleProfile = (workouts, bodyweight) => {
  const safeBodyweight = Math.max(Number(bodyweight) || 180, 1)
  const latestWorkoutDate = workouts.reduce((latest, workout) => {
    const workoutDate = new Date(workout.date)
    return workoutDate > latest ? workoutDate : latest
  }, new Date(0))

  const exerciseBestEntries = new Map()

  workouts.forEach(workout => {
    const workoutDate = new Date(workout.date)
    const daysSinceLog = Math.max(
      0,
      Math.round((latestWorkoutDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))
    )

    workout.exercises.forEach(exercise => {
      const definition = EXERCISE_LIBRARY[exercise.name]
      if (!definition) return

      const percentile = getStrengthPercentile(
        exercise.name,
        exercise.weight,
        exercise.reps,
        safeBodyweight
      )
      const reliability = getExerciseReliability(exercise.name, definition.type)
      const recencyWeight = getRecencyWeight(daysSinceLog)
      const effectiveScore = percentile * reliability * recencyWeight

      const existing = exerciseBestEntries.get(exercise.name)
      if (!existing || effectiveScore > existing.effectiveScore) {
        exerciseBestEntries.set(exercise.name, {
          exerciseName: exercise.name,
          muscleDefinition: definition,
          percentile,
          effectiveScore,
          reliability,
          recencyWeight,
          performedAt: workout.date,
        })
      }
    })
  })

  const muscleTotals = Object.fromEntries(
    MUSCLE_GROUPS.map(muscle => [muscle, { score: 0, weight: 0, confidence: 0, exercises: [] }])
  )

  exerciseBestEntries.forEach(entry => {
    const contributions = getContributionWeights(entry.muscleDefinition)
    const qualityWeight = entry.reliability * entry.recencyWeight

    contributions.forEach(({ muscle, share }) => {
      const total = muscleTotals[muscle]
      if (!total) return

      const appliedWeight = qualityWeight * share
      total.score += entry.percentile * appliedWeight
      total.weight += appliedWeight
      total.confidence += appliedWeight
      total.exercises.push({
        name: entry.exerciseName,
        percentile: entry.percentile,
        performedAt: entry.performedAt,
        contribution: share,
      })
    })
  })

  const scores = {}
  const confidence = {}
  const topExercises = {}

  MUSCLE_GROUPS.forEach(muscle => {
    const total = muscleTotals[muscle]
    scores[muscle] = total.weight > 0 ? total.score / total.weight : 0
    confidence[muscle] = clamp(total.confidence / 1.6, 0, 1)
    topExercises[muscle] = total.exercises
      .sort((a, b) => (b.percentile * b.contribution) - (a.percentile * a.contribution))
      .slice(0, 3)
  })

  return { scores, confidence, topExercises }
}

export const classifyLevel = (score) => {
  if (score <= 0) return 0
  if (score < 20) return 1
  if (score < 35) return 2
  if (score < 50) return 3
  if (score < 65) return 4
  if (score < 80) return 5
  return 6
}

export const LEVEL_COLORS = [
  '#1a1a24',
  '#7f1d1d',
  '#c2410c',
  '#ca8a04',
  '#16a34a',
  '#2563eb',
  '#7c3aed',
]

export const LEGEND = [
  { label: 'Developing', color: LEVEL_COLORS[1] },
  { label: 'Emerging', color: LEVEL_COLORS[2] },
  { label: 'Competent', color: LEVEL_COLORS[3] },
  { label: 'Strong', color: LEVEL_COLORS[4] },
  { label: 'Advanced', color: LEVEL_COLORS[5] },
  { label: 'Elite', color: LEVEL_COLORS[6] },
]
