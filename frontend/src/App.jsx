import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import LogWorkout from './pages/LogWorkout'
import Progress from './pages/Progress'
import Upgrades from './pages/Upgrades'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './index.css'

export default function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('maxout_token')
    if (token) setIsAuth(true)
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('maxout_token')
    setIsAuth(false)
  }

  if (loading) return null;

  return (
    <BrowserRouter>
      {!isAuth ? (
        <Routes>
          <Route path="/login" element={<Login setAuth={setIsAuth} />} />
          <Route path="/signup" element={<Signup setAuth={setIsAuth} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Navbar onLogout={logout} />
          <main className="main-content">
            <Routes>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/log"      element={<LogWorkout />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/upgrades" element={<Upgrades />} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  )
}
