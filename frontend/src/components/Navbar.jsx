import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/log', label: 'Log' },
  { to: '/progress', label: 'Progress' },
  { to: '/upgrades', label: 'Upgrades' },
]

export default function Navbar({ onLogout }) {
  return (
    <aside style={{
      width: 280,
      height: '100vh',
      background: 'rgba(8,8,15,1)',
      borderRight: '1px solid rgba(139,92,246,0.12)',
      position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      padding: '32px 20px',
      flexShrink: 0,
    }}>
      {/* Sidebar Header: Logo */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div>
          <img
            src={logo}
            alt="Logo"
            style={{ width: '100%', height: 'auto', maxWidth: 250 }}
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {links.map(({ to, label }) => {
          const icon = to === '/' ? '' : to === '/log' ? '' : to === '/progress' ? '' : ''
          return (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12,
                fontSize: '0.925rem', fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isActive ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
              })}>
              <span style={{ fontSize: '1.2rem', opacity: 0.9 }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          )
        })}
      </div>

      {/* Sidebar Footer: Logout */}
      {onLogout && (
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={onLogout} style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '12px 16px', borderRadius: 12,
            color: '#ef4444', fontSize: '0.925rem', fontWeight: 600,
            transition: 'background 0.2s',
          }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  )
}
