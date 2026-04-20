import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginApi, registerApi } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'

export const useLogin = () => {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate('/dashboard')
    },
    onError: (err) => toast.error(err.message || 'Login failed'),
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.user, data.token)
      toast.success('Account created!')
      navigate('/dashboard')
    },
    onError: (err) => toast.error(err.message || 'Registration failed'),
  })
}