import api from './axios'

export const loginApi = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export const registerApi = async ({ name, email, password }) => {
  const res = await api.post('/auth/register', { name, email, password })
  return res.data
}

export const getMeApi = async () => {
  const res = await api.get('/auth/me')
  return res.data
}

export const updateProfileApi = async (data) => {
  const res = await api.put('/auth/profile', data)
  return res.data
}

export const changePasswordApi = async (data) => {
  const res = await api.put('/auth/password', data)
  return res.data
}

export const deleteAccountApi = async () => {
  const res = await api.delete('/auth/account')
  return res.data
}