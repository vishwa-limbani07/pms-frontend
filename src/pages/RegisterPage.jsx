import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'
import { CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const benefits = [
  'Unlimited projects & tasks',
  'Kanban boards with drag & drop',
  'Squad-based team management',
  'Built-in analytics dashboard',
  'Time tracking & reporting',
  'Free forever for small teams',
]

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = ({ name, email, password }) => registerUser({ name, email, password })

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
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">PN</span>
            </div>
            <span className="text-white text-lg font-semibold">ProjectNest</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Start building<br />something<br />amazing.
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            Join thousands of teams who use ProjectNest to ship products faster.
          </p>
        </div>

        {/* Benefits list */}
        <div className="relative z-10">
          <div className="space-y-3">
            {benefits.map(benefit => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-blue-200 flex-shrink-0" />
                <span className="text-white text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — register form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">PN</span>
            </div>
            <span className="text-gray-900 text-lg font-semibold">ProjectNest</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-gray-500 text-sm mt-2">
              Start managing projects with ProjectNest
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { id: 'name', label: 'Full name', type: 'text', placeholder: 'John Doe'},
              { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { id: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  {...register(id)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder:text-gray-400 transition bg-gray-50 hover:bg-white"
                />
                {errors[id] && (
                  <p className="text-red-500 text-xs mt-1.5">{errors[id].message}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                text-white text-sm font-semibold py-3 rounded-xl transition cursor-pointer
                flex items-center justify-center gap-2 mt-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account →'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}