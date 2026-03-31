const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000]

function getLevelInfo(totalPoints) {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalPoints >= LEVEL_THRESHOLDS[i]) level = i + 1
  }
  level = Math.min(level, LEVEL_THRESHOLDS.length)
  const current = LEVEL_THRESHOLDS[level - 1]
  const next = LEVEL_THRESHOLDS[level] ?? current
  const span = next - current
  const progress = span ? Math.min(((totalPoints - current) / span) * 100, 100) : 100
  return { level, current, next, progress: Math.round(progress) }
}

export default function PointsBar({ totalPoints = 0 }) {
  const { level, current, next, progress } = getLevelInfo(totalPoints)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Level + points header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.95rem', color: '#fff',
            boxShadow: '0 0 14px rgba(139,92,246,0.5)',
          }}>
            {level}
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.95rem' }}>
              Level {level}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {totalPoints.toLocaleString()} pts total
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Next level</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>
            {next === current ? 'MAX' : `${next.toLocaleString()} pts`}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div style={{ fontSize: '0.72rem', color: '#475569', textAlign: 'right' }}>
        {progress}% to Level {Math.min(level + 1, LEVEL_THRESHOLDS.length)}
      </div>
    </div>
  )
}
