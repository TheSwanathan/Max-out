import { useEffect, useState } from 'react'
import { getUpgrades, getUser, unlockUpgrade } from '../api'

const EFFECT_ICONS = {
  pr_multiplier:       '🏆',
  streak_shield:       '🛡️',
  volume_bonus:        '📦',
  weekend_multiplier:  '🗓️',
}

const EFFECT_LABELS = {
  pr_multiplier:       'PR Multiplier',
  streak_shield:       'Streak Shield',
  volume_bonus:        'Volume Bonus',
  weekend_multiplier:  'Weekend Bonus',
}

function UpgradeCard({ upgrade, userPoints, onUnlock }) {
  const canAfford = userPoints >= upgrade.cost
  const icon = EFFECT_ICONS[upgrade.effect_type] ?? '⚡'
  const effectLabel = EFFECT_LABELS[upgrade.effect_type] ?? upgrade.effect_type

  return (
    <div className={`card fade-up ${upgrade.owned ? 'glow-green' : ''}`} style={{
      padding: '24px', display: 'flex', flexDirection: 'column', gap: 14,
      border: upgrade.owned
        ? '1px solid rgba(16,185,129,0.4)'
        : canAfford
          ? '1px solid rgba(139,92,246,0.25)'
          : '1px solid rgba(139,92,246,0.1)',
      opacity: upgrade.owned ? 0.95 : 1,
      position: 'relative', overflow: 'hidden',
    }}>
      {upgrade.owned && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(16,185,129,0.15)', color: '#10b981',
          fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
          border: '1px solid rgba(16,185,129,0.3)',
        }}>✓ OWNED</div>
      )}

      {/* Icon + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, fontSize: '1.5rem',
          background: upgrade.owned
            ? 'rgba(16,185,129,0.1)'
            : 'rgba(139,92,246,0.1)',
          border: upgrade.owned
            ? '1px solid rgba(16,185,129,0.25)'
            : '1px solid rgba(139,92,246,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem' }}>
            {upgrade.name}
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.68rem', marginTop: 4 }}>
            {effectLabel}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.55 }}>
        {upgrade.description}
      </p>

      {/* Footer: cost + button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '1rem' }}>⚡</span>
          <span className="gold-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {upgrade.cost}
          </span>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>pts</span>
        </div>

        {upgrade.owned ? (
          <button className="btn-ghost" style={{ cursor: 'default', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }} disabled>
            Active
          </button>
        ) : (
          <button
            id={`unlock-btn-${upgrade.id}`}
            className={canAfford ? 'btn-gold' : 'btn-ghost'}
            onClick={() => onUnlock(upgrade)}
            disabled={!canAfford}
          >
            {canAfford ? '🔓 Unlock' : `Need ${upgrade.cost - userPoints} more pts`}
          </button>
        )}
      </div>
    </div>
  )
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export default function Upgrades() {
  const [upgrades, setUpgrades] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const refresh = () =>
    Promise.all([getUpgrades(), getUser()])
      .then(([u, usr]) => { setUpgrades(u.data); setUser(usr.data) })
      .catch(console.error)
      .finally(() => setLoading(false))

  useEffect(() => { refresh() }, [])

  const handleUnlock = async (upgrade) => {
    try {
      const res = await unlockUpgrade({ upgrade_id: upgrade.id })
      if (res.data.success) {
        setToast({ msg: res.data.message, type: 'success' })
        refresh()
      } else {
        setToast({ msg: res.data.message, type: 'error' })
      }
    } catch {
      setToast({ msg: 'Something went wrong.', type: 'error' })
    }
  }

  const owned = upgrades.filter(u => u.owned)
  const available = upgrades.filter(u => !u.owned)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
      <div className="pulse-glow" style={{ width: 12, height: 12, borderRadius: '50%', background: '#8b5cf6' }} />
      <span style={{ color: '#94a3b8' }}>Loading upgrades…</span>
    </div>
  )

  return (
    <div className="page">
      <h1 className="page-title gradient-text fade-up">Upgrade Shop</h1>
      <p className="page-subtitle fade-up">Spend your points on upgrades that amplify future rewards.</p>

      {/* Points balance */}
      <div className="card fade-up" style={{
        padding: '20px 28px', marginBottom: 32, display: 'flex',
        alignItems: 'center', gap: 16,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))',
        border: '1px solid rgba(139,92,246,0.2)',
      }}>
        <div style={{ fontSize: '2rem' }}>⚡</div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 2 }}>AVAILABLE POINTS</div>
          <div className="gold-text" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '2rem' }}>
            {(user?.total_points ?? 0).toLocaleString()}
          </div>
        </div>
        {owned.length > 0 && (
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>OWNED</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#10b981' }}>{owned.length}/{upgrades.length}</div>
          </div>
        )}
      </div>

      {/* Available upgrades */}
      {available.length > 0 && (
        <>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem',
            color: '#94a3b8', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Available
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 32 }}>
            {available.map(u => (
              <UpgradeCard key={u.id} upgrade={u} userPoints={user?.total_points ?? 0} onUnlock={handleUnlock} />
            ))}
          </div>
        </>
      )}

      {/* Owned upgrades */}
      {owned.length > 0 && (
        <>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem',
            color: '#94a3b8', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Active Upgrades
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {owned.map(u => (
              <UpgradeCard key={u.id} upgrade={u} userPoints={user?.total_points ?? 0} onUnlock={handleUnlock} />
            ))}
          </div>
        </>
      )}

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  )
}
