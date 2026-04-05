import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('maxout_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signupUser    = (data) => api.post(`/auth/signup`, data)
export const loginUser     = (data) => api.post(`/auth/login`, data)

// Application Data
export const getUser       = ()       => api.get(`/users/me`)
export const getWorkouts   = (limit=20) => api.get(`/workouts/`, { params: { limit } })
export const logWorkout    = (data)   => api.post('/workouts/', data)
export const deleteWorkout = (id)     => api.delete(`/workouts/${id}`)
export const getPerformance = ()      => api.get(`/performance/`)
export const getUpgrades   = ()       => api.get('/upgrades/')
export const unlockUpgrade = (data)   => api.post('/upgrades/unlock', data)
export const resetUser     = ()       => api.delete(`/users/me/reset`)
export const updateBodyweight = (bodyweight) => api.put(`/users/me/bodyweight`, { bodyweight })

export default api
