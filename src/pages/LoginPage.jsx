import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'
import {
  FolderKanban, Users, BarChart3, Shield, Clock, Zap
} from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

const features = [
  { icon: FolderKanban, label: 'Kanban boards' },
  { icon: Users, label: 'Squad management' },
  { icon: BarChart3, label: 'Project analytics' },
  { icon: Shield, label: 'Role-based access' },
  { icon: Clock, label: 'Time tracking' },
  { icon: Zap, label: 'Real-time updates' },
]

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <div className="min-h-screen flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12">

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-10 w-72 h-72 rounded-full border-[40px] border-white" />
          <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full border-[40px] border-white" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border-[30px] border-white" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">PN</span>
            </div>
            <span className="text-white text-lg font-semibold">ProjectNest</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Manage your<br />projects like<br />a pro.
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            The all-in-one project management platform for modern teams.
            Plan, track, and deliver with confidence.
          </p>
        </div>

        {/* Feature badges */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex items-center gap-2 px-3 py-2.5 bg-white/10 backdrop-blur-sm
                  rounded-xl border border-white/10">
                <Icon size={16} className="text-blue-200 flex-shrink-0" />
                <span className="text-white text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-blue-200 text-sm mt-6">
            Trusted by developers and teams worldwide
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">PN</span>
            </div>
            <span className="text-gray-900 text-lg font-semibold">ProjectNest</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit((d) => login(d))} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-gray-400 transition bg-gray-50 hover:bg-white"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder:text-gray-400 transition bg-gray-50 hover:bg-white"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                text-white text-sm font-semibold py-3 rounded-xl transition cursor-pointer
                flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or try demo</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo credentials */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 text-center font-medium mb-1">
              Demo credentials
            </p>
            <p className="text-xs text-blue-600 text-center font-mono">
              demo@pms.com / password123
            </p>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Get started for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}