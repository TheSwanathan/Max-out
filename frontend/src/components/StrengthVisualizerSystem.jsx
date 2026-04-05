import React, { useMemo } from 'react'
import Model from 'react-body-highlighter'
import { classifyLevel, LEVEL_COLORS, LEGEND } from '../utils/strengthVisualizerLogic'

const MUSCLE_MAP = {
  chest: ['chest'],
  back: ['upper-back', 'trapezius', 'lower-back'],
  legs: ['quadriceps', 'hamstring', 'calves', 'gluteal'],
  shoulders: ['front-deltoids', 'back-deltoids'],
  arms: ['biceps', 'triceps', 'forearm'],
  core: ['abs', 'obliques'],
}

const MUSCLE_ORDER = ['chest', 'shoulders', 'arms', 'core', 'legs', 'back']

const buildHighlighterData = (scores) => {
  const data = []

  Object.entries(MUSCLE_MAP).forEach(([muscle, mappedParts]) => {
    const score = scores[muscle] || 0
    const levelIndex = classifyLevel(score)

    if (levelIndex > 0) {
      data.push({
        name: muscle,
        muscles: mappedParts,
        frequency: levelIndex,
      })
    }
  })

  data.push({
    name: 'ScaleLock',
    muscles: ['head'],
    frequency: 6,
  })

  return data
}

const getConfidenceLabel = (value) => {
  if (value >= 0.8) return 'High confidence'
  if (value >= 0.5) return 'Medium confidence'
  if (value > 0) return 'Low confidence'
  return 'No data'
}

const formatExerciseList = (exercises) => {
  if (!exercises?.length) return 'No logged lifts yet'
  return exercises.map(exercise => exercise.name).join(' • ')
}

export default function StrengthVisualizerSystem({ scores = {}, confidence = {}, topExercises = {} }) {
  const modelData = useMemo(() => buildHighlighterData(scores), [scores])

  return (
    <div className="card fade-up" style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.4rem' }}>
            Current Muscle Map
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4, maxWidth: 560 }}>
            Bodyweight-relative strength percentiles estimated from your current logged lifts and rolled into muscle groups using exercise contribution weights.
          </p>
        </div>
        <div className="badge badge-gold" style={{ fontSize: '0.8rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
          Current capability
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, marginBottom: 28, flexWrap: 'wrap' }}>
        <Model
          data={modelData}
          type="anterior"
          style={{ width: '180px', padding: '10px' }}
          bodyColor="#1a1a24"
          highlightedColors={LEVEL_COLORS.slice(1)}
        />
        <Model
          data={modelData}
          type="posterior"
          style={{ width: '180px', padding: '10px' }}
          bodyColor="#1a1a24"
          highlightedColors={LEVEL_COLORS.slice(1)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        {MUSCLE_ORDER.map(muscle => (
          <div key={muscle} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(139,92,246,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 8 }}>
              <div style={{ textTransform: 'uppercase', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                {muscle}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: LEVEL_COLORS[classifyLevel(scores[muscle])] || '#fff' }}>
                {(scores[muscle] || 0).toFixed(1)}%
              </div>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: 8 }}>
              {getConfidenceLabel(confidence[muscle] || 0)}
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'rgba(148,163,184,0.16)', overflow: 'hidden', marginBottom: 8 }}>
              <div
                style={{
                  width: `${Math.max(4, Math.min(scores[muscle] || 0, 100))}%`,
                  height: '100%',
                  background: LEVEL_COLORS[classifyLevel(scores[muscle])] || LEVEL_COLORS[0],
                }}
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
              {formatExerciseList(topExercises[muscle])}
            </div>
          </div>
        ))}
      </div>

      <div style={{ color: '#64748b', fontSize: '0.82rem', textAlign: 'center', marginBottom: 24 }}>
        Percentiles are estimated from bodyweight-relative exercise standards using your logged lifts. Accuracy is highest when you log consistent compound movements.
      </div>

      <div style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)',
        padding: '14px',
        borderRadius: 12,
      }}>
        {LEGEND.map((item) => (
          <div
            key={item.label}
            style={{
              background: item.color,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
