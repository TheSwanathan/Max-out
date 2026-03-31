import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',          label: 'Dashboard', icon: '⚡' },
  { to: '/log',       label: 'Log',        icon: '➕' },
  { to: '/progress',  label: 'Progress',   icon: '📈' },
  { to: '/upgrades',  label: 'Upgrades',   icon: '🔧' },
]

export default function Navbar({ onLogout }) {
  return (
    <nav style={{
      background: 'rgba(8,8,15,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(139,92,246,0.12)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>🏋️</div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem',
            background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Max-out
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 8,
                fontSize: '0.875rem', fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: isActive ? '#8b5cf6' : '#94a3b8',
                border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
              })}>
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
          {onLogout && (
            <button onClick={onLogout} style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444',
              padding: '6px 14px', fontSize: '0.875rem', fontWeight: 500 
            }}>
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
