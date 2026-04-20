import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12
            bg-blue-600 rounded-xl mb-3 sm:mb-4">
            <span className="text-white text-lg sm:text-xl font-bold">P</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Sign in to your ProjectNest account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit((d) => login(d))} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input {...register('email')} type="email" placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-gray-400 transition" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <input {...register('password')} type="password" placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-gray-400 transition" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                text-white text-sm font-medium py-2.5 rounded-lg transition cursor-pointer">
              {isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 sm:mt-5 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Demo: <span className="font-mono font-medium text-gray-700">demo@pms.com</span>
              {' / '}
              <span className="font-mono font-medium text-gray-700">password123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}