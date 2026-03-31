import { EXERCISE_LIBRARY } from './exerciseLibrary';

// Step 1a: Epley 1RM Formula
export const calculate1RM = (weight, reps) => weight * (1 + reps / 30);

// Step 1b: Normalize against bodyweight
export const normalizeStrength = (oneRM, bodyweight) => oneRM / bodyweight;

// Step 2: Weight assignment based on exercise type
export const getExerciseWeight = (type) => {
  switch (type) {
    case 'compound': return 1.0;
    case 'secondary': return 0.75;
    case 'isolation': return 0.5;
    default: return 0.75;
  }
};

// Step 3 & 4: Distribute and Aggregate Muscle Scores
export const calculateMuscleScores = (logs, bodyweight) => {
  // We'll accumulate total weighted normalized strength + total weights applied per muscle
  const totals = {
    chest: { score: 0, weight: 0 },
    back: { score: 0, weight: 0 },
    legs: { score: 0, weight: 0 },
    shoulders: { score: 0, weight: 0 },
    arms: { score: 0, weight: 0 },
    core: { score: 0, weight: 0 }
  };

  logs.forEach(log => {
    const exDef = EXERCISE_LIBRARY[log.exerciseName];
    if (!exDef) return; // Skip if untracked exercise

    const raw1RM = calculate1RM(log.weight, log.reps);
    const normalized = normalizeStrength(raw1RM, bodyweight);
    const exerciseWeight = getExerciseWeight(exDef.type);
    
    // Total contribution points for this specific set
    const totalSetPoints = normalized * exerciseWeight;

    // Distribute 70% to primary muscle
    if (totals[exDef.primary]) {
      totals[exDef.primary].score += (totalSetPoints * 0.70);
      totals[exDef.primary].weight += (exerciseWeight * 0.70);
    }

    // Distribute remaining 30% across secondary muscles evenly
    if (exDef.secondary && exDef.secondary.length > 0) {
      const perSecondarySplit = 0.30 / exDef.secondary.length;
      exDef.secondary.forEach(secMuscle => {
        if (totals[secMuscle]) {
          totals[secMuscle].score += (totalSetPoints * perSecondarySplit);
          totals[secMuscle].weight += (exerciseWeight * perSecondarySplit);
        }
      });
    }
  });

  // Calculate final average score per muscle (sum of scores / sum of weights)
  const finalScores = {};
  Object.keys(totals).forEach(muscle => {
    if (totals[muscle].weight > 0) {
      finalScores[muscle] = totals[muscle].score / totals[muscle].weight;
    } else {
      finalScores[muscle] = 0;
    }
  });

  return finalScores;
};

// Step 5: Classify level based on numeric score
export const classifyLevel = (score) => {
  if (score === 0) return 0;
  if (score < 0.75) return 1; // Beginner
  if (score < 1.0)  return 2; // Novice
  if (score < 1.5)  return 3; // Intermediate
  if (score < 2.0)  return 4; // Advanced
  if (score < 2.5)  return 5; // Elite
  return 6;                   // World Class
};

// Colors mapping (Step 6)
export const LEVEL_COLORS = [
  "#1a1a24", // 0: Empty/Unscored 
  "#ef4444", // 1: Beginner     (Red)
  "#f97316", // 2: Novice       (Orange)
  "#10b981", // 3: Intermediate (Green)
  "#3b82f6", // 4: Advanced     (Blue)
  "#a855f7", // 5: Elite        (Purple)
  "#ec4899"  // 6: World Class  (Pink)
];

export const LEGEND = [
  { label: 'Beginner',     color: LEVEL_COLORS[1] },
  { label: 'Novice',       color: LEVEL_COLORS[2] },
  { label: 'Intermediate', color: LEVEL_COLORS[3] },
  { label: 'Advanced',     color: LEVEL_COLORS[4] },
  { label: 'Elite',        color: LEVEL_COLORS[5] },
  { label: 'World Class',  color: LEVEL_COLORS[6] },
];
