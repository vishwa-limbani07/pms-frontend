// import api from './axios'
import { mockUser } from './mockData'

export const loginApi = async ({ email, password }) => {
  await new Promise(r => setTimeout(r, 800))
  if (email === 'demo@pms.com' && password === 'password123') {
    return { user: mockUser, token: 'mock-jwt-token-12345' }
  }
  throw new Error('Invalid email or password')
  // REAL: const res = await api.post('/auth/login', { email, password }); return res.data
}

export const registerApi = async ({ name, email, password }) => {
  await new Promise(r => setTimeout(r, 800))
  return {
    user: { id: Date.now().toString(), name, email, avatar: null },
    token: 'mock-jwt-token-' + Date.now()
  }
  // REAL: const res = await api.post('/auth/register', { name, email, password }); return res.data
}

export const getMeApi = async () => {
  // REAL: const res = await api.get('/auth/me'); return res.data
  return mockUser
}