import React, { useMemo } from 'react';
import Model from 'react-body-highlighter';

// ─── 1. MATH LOGIC & HELPERS ──────────────────────────────────────────────────

// Epley 1RM Formula
export const calculate1RM = (weight, reps) => weight * (1 + reps / 30);

// Normalize 1RM by user's bodyweight
export const normalizeLift = (rm, bodyweight) => rm / bodyweight;

// Assign importance weight multipliers based on typical lift classifications
const getExerciseWeight = (name) => {
  const lowerName = name.toLowerCase();
  if (/bench|squat|deadlift|pull-up|chin-up|overhead press/.test(lowerName)) return 1.0;
  if (/row|leg press|lunges|dip/.test(lowerName)) return 0.75;
  if (/curl|extension|raise|calves|crunch/.test(lowerName)) return 0.5;
  return 0.75; // Default secondary modifier
};

// Calculate normalized weighted score for a specific muscle group
export const calculateMuscleScore = (exercises, bodyweight, targetGroup) => {
  const groupExercises = exercises.filter(e => e.muscleGroup === targetGroup);
  if (groupExercises.length === 0) return 0; // No data for this muscle

  let totalWeightedScore = 0;
  let totalWeights = 0;

  groupExercises.forEach((ex) => {
    const raw1RM = calculate1RM(ex.weight, ex.reps);
    const norm = normalizeLift(raw1RM, bodyweight);
    const importance = getExerciseWeight(ex.name);

    totalWeightedScore += (norm * importance);
    totalWeights += importance;
  });

  return totalWeights > 0 ? totalWeightedScore / totalWeights : 0;
};

// Map the raw float score to a distinct integer index (1 to 6) for coloring
export const getLevelIndex = (score) => {
  if (score === 0) return 0; // Uncolored
  if (score < 0.75) return 1; // Beginner
  if (score < 1.0)  return 2; // Novice
  if (score < 1.5)  return 3; // Intermediate
  if (score < 2.0)  return 4; // Advanced
  if (score < 2.5)  return 5; // Elite
  return 6;                   // World Class
};

// ─── 2. VISUAL MAPS ─────────────────────────────────────────────────────────

// Map our 6 broad muscle groups to exact react-body-highlighter svg path names
const MUSCLE_MAP = {
  chest:     ['chest'],
  back:      ['upper-back', 'trapezius', 'lower-back'],
  legs:      ['quadriceps', 'hamstring', 'calves', 'gluteal'],
  shoulders: ['front-deltoids', 'back-deltoids'],
  arms:      ['biceps', 'triceps', 'forearm'],
  core:      ['abs', 'obliques']
};

const LEVEL_COLORS = [
  "#1a1a24", // Empty/Unscored (Default body)
  "#ef4444", // Beginner     (Red)
  "#f97316", // Novice       (Orange)
  "#10b981", // Intermediate (Green)
  "#3b82f6", // Advanced     (Blue)
  "#a855f7", // Elite        (Purple)
  "#ec4899"  // World Class  (Pink)
];

const LEGEND = [
  { label: 'Beginner',     color: LEVEL_COLORS[1] },
  { label: 'Novice',       color: LEVEL_COLORS[2] },
  { label: 'Intermediate', color: LEVEL_COLORS[3] },
  { label: 'Advanced',     color: LEVEL_COLORS[4] },
  { label: 'Elite',        color: LEVEL_COLORS[5] },
  { label: 'World Class',  color: LEVEL_COLORS[6] },
];

/**
 * Parses user input into the data format expected by react-body-highlighter.
 * Because the highlighter arbitrarily maps intensities (1 to N) over an array of custom hex colors,
 * we enforce the maximum intensity across the board to be 6 (World Class), ensuring our color
 * array maps strictly to our hard-coded thresholds rather than shifting dynamically to the user's current highest.
 */
const buildHighlighterData = (exercises, bodyweight) => {
  const data = [];
  
  Object.keys(MUSCLE_MAP).forEach((group) => {
    const score = calculateMuscleScore(exercises, bodyweight, group);
    const level = getLevelIndex(score);
    
    if (level > 0) {
      data.push({
        name: group,
        muscles: MUSCLE_MAP[group],
        frequency: level 
      });
    }
  });

  // Inject a synthetic invisible max-level pin to lock the scale safely at index 6
  // (Prevents the highlighter from linearly shrinking colors to e.g. a max of 3 if the user is only Intermediate)
  data.push({
    name: "ScaleLock",
    muscles: ["head"], // usually not visible/used prominently
    frequency: 6
  });

  return data;
};

// ─── 3. REACT COMPONENT ─────────────────────────────────────────────────────

export default function StrengthLevelVisualizer({ userBodyweight = 180, startExercises = [], nowExercises = [] }) {
  const startData = useMemo(() => buildHighlighterData(startExercises, userBodyweight), [startExercises, userBodyweight]);
  const nowData = useMemo(() => buildHighlighterData(nowExercises, userBodyweight), [nowExercises, userBodyweight]);

  return (
    <div className="card fade-up" style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.4rem' }}>
            Your Strength Progress
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4 }}>
            Aggregated muscular strength mapped to global lifting standards.
          </p>
        </div>
        <div className="gold-text" style={{ fontWeight: 700, fontSize: '1rem' }}>
          Start vs Now
        </div>
      </div>

      {/* Anterior (Front) View */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: 8 }}>START</h3>
          <Model
            data={startData}
            type="anterior"
            style={{ width: "180px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)} // Strip out 0-index background
          />
        </div>
        
        <div style={{ fontSize: '2rem', color: '#475569', fontWeight: 200, paddingBottom: 60 }}>
          ❯
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>NOW</h3>
          <Model
            data={nowData}
            type="anterior"
            style={{ width: "180px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)} 
          />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', margin: '32px 0',
        background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 12 }}>
        {LEGEND.map((l, i) => (
          <div key={i} style={{ 
            background: l.color, color: i === 0 || i === 1 ? '#fff' : '#111', 
            padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 
          }}>
            {l.label}
          </div>
        ))}
      </div>

      {/* Posterior (Back) View */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <Model
            data={startData}
            type="posterior"
            style={{ width: "180px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)}
          />
        </div>
        
        <div style={{ fontSize: '2rem', color: '#475569', fontWeight: 200, paddingTop: 60 }}>
          ❯
        </div>

        <div style={{ textAlign: 'center' }}>
          <Model
            data={nowData}
            type="posterior"
            style={{ width: "180px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── MOCK DATA FOR DEMONSTRATION ────────────────────────────────────────────

export const START_MOCK = [
  { name: 'Bench Press', muscleGroup: 'chest', weight: 135, reps: 5 },
  { name: 'Pull-up',     muscleGroup: 'back',  weight: 150, reps: 3 }, // using assisted or partial BW
  { name: 'Squat',       muscleGroup: 'legs',  weight: 185, reps: 5 },
  { name: 'OHP',         muscleGroup: 'shoulders', weight: 85, reps: 5 },
  { name: 'Bicep Curl',  muscleGroup: 'arms',  weight: 25, reps: 8 },
  { name: 'Crunches',    muscleGroup: 'core',  weight: 180, reps: 15 }
];

export const NOW_MOCK = [
  { name: 'Bench Press', muscleGroup: 'chest', weight: 225, reps: 5 }, // 1.45 Score -> Intermediate (Green)
  { name: 'Pull-up',     muscleGroup: 'back',  weight: 210, reps: 8 }, // 1.47 -> Intermediate
  { name: 'Squat',       muscleGroup: 'legs',  weight: 315, reps: 3 }, // 1.92 -> Advanced (Blue)
  { name: 'OHP',         muscleGroup: 'shoulders', weight: 155, reps: 5 }, // Elite-tier mapping
  { name: 'Barbell Curl',muscleGroup: 'arms',  weight: 105, reps: 8 }, // 0.73 -> Novice
  { name: 'Ab Rollout',  muscleGroup: 'core',  weight: 230, reps: 20 } // Elite range
];
