import React, { useMemo } from 'react';
import Model from 'react-body-highlighter';
import { calculateMuscleScores, classifyLevel, LEVEL_COLORS, LEGEND } from '../utils/strengthVisualizerLogic';

// Exact SVG mappings for react-body-highlighter
const MUSCLE_MAP = {
  chest:     ['chest'],
  back:      ['upper-back', 'trapezius', 'lower-back'],
  legs:      ['quadriceps', 'hamstring', 'calves', 'gluteal'],
  shoulders: ['front-deltoids', 'back-deltoids'],
  arms:      ['biceps', 'triceps', 'forearm'],
  core:      ['abs', 'obliques']
};

/**
 * Builds data array for react-body-highlighter and returns exact numeric scores
 */
const processVisualizerData = (logs, bodyweight) => {
  const muscleScores = calculateMuscleScores(logs, bodyweight);
  
  const highlighterData = [];
  
  Object.keys(MUSCLE_MAP).forEach((group) => {
    const score = muscleScores[group] || 0;
    const levelIndex = classifyLevel(score);
    
    if (levelIndex > 0) {
      highlighterData.push({
        name: group,
        muscles: MUSCLE_MAP[group],
        frequency: levelIndex 
      });
    }
  });

  // Lock the scale safely at index 6 to force the static custom hex colors mapping
  highlighterData.push({
    name: "ScaleLock",
    muscles: ["head"], 
    frequency: 6
  });

  return { highlighterData, muscleScores };
};

export default function StrengthVisualizerSystem({ userBodyweight = 180, startLogs = [], nowLogs = [] }) {
  const { highlighterData: startData, muscleScores: startScores } = useMemo(() => processVisualizerData(startLogs, userBodyweight), [startLogs, userBodyweight]);
  const { highlighterData: nowData, muscleScores: nowScores }     = useMemo(() => processVisualizerData(nowLogs, userBodyweight), [nowLogs, userBodyweight]);

  return (
    <div className="card fade-up" style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.4rem' }}>
            System Analytics
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4 }}>
            Aggregated strength output factored by 70/30 muscle contribution weighting.
          </p>
        </div>
        <div className="badge badge-gold" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
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
            style={{ width: "160px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)} 
          />
        </div>
        
        <div style={{ fontSize: '2rem', color: '#334155', fontWeight: 200, paddingBottom: 60 }}>
          ❯
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>NOW</h3>
          <Model
            data={nowData}
            type="anterior"
            style={{ width: "160px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)} 
          />
        </div>
      </div>

      {/* Muscle Group Scores Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '32px' }}>
        {['chest', 'shoulders', 'arms', 'core', 'legs', 'back'].map(muscle => (
          <div key={muscle} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.1)' }}>
            <div style={{ textTransform: 'uppercase', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>
              {muscle}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{startScores[muscle]?.toFixed(2) || '0.00'}</span>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>→</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: LEVEL_COLORS[classifyLevel(nowScores[muscle])] || '#fff' }}>
                {nowScores[muscle]?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px',
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
            style={{ width: "160px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)}
          />
        </div>
        
        <div style={{ fontSize: '2rem', color: '#334155', fontWeight: 200, paddingTop: 60 }}>
          ❯
        </div>

        <div style={{ textAlign: 'center' }}>
          <Model
            data={nowData}
            type="posterior"
            style={{ width: "160px", margin: "0 auto", padding: '10px' }}
            bodyColor="#1a1a24"
            highlightedColors={LEVEL_COLORS.slice(1)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── OPTIONAL MOCK DATA DEFAULTS ────────────────────────────────────────────
export const MOCK_START_LOGS = [
  { exerciseName: 'Barbell Bench Press', weight: 135, reps: 5 },
  { exerciseName: 'Squat', weight: 185, reps: 5 },
  { exerciseName: 'Deadlift', weight: 225, reps: 3 }
];
export const MOCK_NOW_LOGS = [
  { exerciseName: 'Barbell Bench Press', weight: 225, reps: 5 },
  { exerciseName: 'Squat', weight: 315, reps: 3 },
  { exerciseName: 'Deadlift', weight: 405, reps: 1 },
  { exerciseName: 'Pull-ups', weight: 200, reps: 8 },
  { exerciseName: 'Overhead Press', weight: 135, reps: 5 },
  { exerciseName: 'Barbell Curl', weight: 95, reps: 8 }
];
