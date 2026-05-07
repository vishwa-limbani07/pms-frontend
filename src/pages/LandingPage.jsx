import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Users, Clock, BarChart3,
  CheckCircle2, ArrowRight, Menu, X,
  Bell, Shield, Zap, Layers,
  TrendingUp, ChevronRight, Star, Kanban
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function useScrollAnimation() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, isVisible]
}

const features = [
  {
    icon: Kanban,
    title: 'Kanban Boards',
    description: 'Visualize your workflow with drag-and-drop Kanban boards. Move tasks across stages effortlessly.',
    bg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Squad Management',
    description: 'Organize your team into focused squads. Assign members, track capacity, and collaborate better.',
    bg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Log time against tasks and projects. Get insights into where your team spends their hours.',
    bg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Data-driven insights to improve team performance. Charts, burndowns, and velocity metrics.',
    bg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    description: 'Stay on top of updates with smart notifications. Never miss a deadline or assignment.',
    bg: 'bg-red-500/10',
    iconColor: 'text-red-500',
  },
  {
    icon: Shield,
    title: 'Role-based Access',
    description: 'Fine-grained permissions ensure the right people see the right information, every time.',
    bg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-500',
  },
]

const steps = [
  {
    step: '01',
    title: 'Create your workspace',
    description: 'Set up your account in seconds. Create a project, define milestones, and invite your team.',
    icon: Layers,
  },
  {
    step: '02',
    title: 'Build your squads',
    description: 'Organize team members into squads. Assign roles, set permissions, and define responsibilities.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Ship with confidence',
    description: 'Track progress in real-time. Use analytics to remove blockers and keep delivery on schedule.',
    icon: TrendingUp,
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Engineering Manager at Techflow',
    initials: 'SC',
    avatarBg: 'bg-blue-600',
    text: 'Nexus transformed how our engineering team ships features. The kanban boards and squad management are exactly what we needed.',
    stars: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Lead at Buildify',
    initials: 'MJ',
    avatarBg: 'bg-purple-600',
    text: 'The time tracking and analytics features give us real data to improve our velocity. We cut delivery time by 30% in the first quarter.',
    stars: 5,
  },
  {
    name: 'Priya Patel',
    role: 'CTO at Launchpad',
    initials: 'PP',
    avatarBg: 'bg-green-600',
    text: "Clean UI, powerful features, and the team collaboration tools are top-notch. It's the project management tool our startup always needed.",
    stars: 5,
  },
]

const stats = [
  { value: '500+', label: 'Teams Using Nexus' },
  { value: '10k+', label: 'Projects Managed' },
  { value: '50k+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime Guaranteed' },
]

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const [featuresRef, featuresVisible] = useScrollAnimation()
  const [stepsRef, stepsVisible] = useScrollAnimation()
  const [statsRef, statsVisible] = useScrollAnimation()
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation()

  useEffect(() => {
    const check = () => setScrolled((window.scrollY || document.documentElement.scrollTop) > 50)
    check() // initialize immediately so mobile renders correctly on mount
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                Nexus
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Testimonials', href: '#testimonials' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={`text-sm font-medium transition-colors hover:text-blue-500 ${scrolled ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-medium transition-colors hover:text-blue-500 ${scrolled ? 'text-gray-700' : 'text-gray-200'}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Testimonials', href: '#testimonials' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 font-medium py-2"
                >
                  {label}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-center py-2.5 text-gray-700 font-medium border border-gray-200 rounded-xl">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-center py-2.5 bg-blue-600 text-white font-semibold rounded-xl">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* Ambient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-900/20 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Modern Project Management for Modern Teams</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Manage Projects.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Build Teams.
            </span>
            <br />
            Ship Faster.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Nexus brings your projects, squads, and timelines together in one beautifully crafted workspace.
            Stop juggling tools — start delivering results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Sign In <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Mock Dashboard UI */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/60 ring-1 ring-white/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 mx-4 bg-slate-700/60 rounded-md h-6 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-slate-400 text-xs truncate">app.projectnest.io/dashboard</span>
                </div>
              </div>

              {/* App shell */}
              <div className="flex" style={{ height: '300px' }}>
                {/* Sidebar skeleton */}
                <div className="w-48 bg-slate-900/80 border-r border-slate-700/50 p-4 hidden lg:flex flex-col flex-shrink-0">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex-shrink-0" />
                    <div className="h-3 bg-slate-600 rounded w-20" />
                  </div>
                  {[true, false, false, false, false].map((active, i) => (
                    <div key={i} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1 ${active ? 'bg-blue-600/20' : ''}`}>
                      <div className="w-3.5 h-3.5 bg-slate-600 rounded flex-shrink-0" />
                      <div className={`h-2 rounded ${active ? 'bg-blue-400 w-20' : 'bg-slate-600 w-16'}`} />
                    </div>
                  ))}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 px-2 py-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600/60 flex-shrink-0" />
                      <div className="h-2 bg-slate-600 rounded w-16" />
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 bg-slate-800/60 min-w-0">
                  <div className="flex justify-between items-center mb-5">
                    <div className="space-y-1.5">
                      <div className="h-4 bg-slate-500 rounded w-36" />
                      <div className="h-2.5 bg-slate-600 rounded w-24" />
                    </div>
                    <div className="h-8 bg-blue-600 rounded-lg w-28" />
                  </div>
                  {/* Kanban columns */}
                  <div className="flex gap-3 overflow-hidden">
                    {[
                      { count: 3, dot: 'bg-slate-400', label: 'bg-slate-500' },
                      { count: 2, dot: 'bg-blue-400', label: 'bg-blue-700' },
                      { count: 4, dot: 'bg-green-400', label: 'bg-green-700' },
                    ].map((col, ci) => (
                      <div key={ci} className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-3">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
                          <div className={`h-2 rounded w-16 ${col.label}`} />
                          <div className="ml-auto w-4 h-4 bg-slate-700 rounded flex items-center justify-center">
                            <span className="text-slate-400 text-[9px] font-bold">{col.count}</span>
                          </div>
                        </div>
                        {[...Array(Math.min(col.count, 2))].map((_, i) => (
                          <div key={i} className="bg-slate-700/80 rounded-lg p-2.5 mb-2">
                            <div className="h-2 bg-slate-500 rounded w-full mb-1.5" />
                            <div className="h-2 bg-slate-600 rounded w-2/3 mb-2.5" />
                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-blue-600 ring-1 ring-slate-700" />
                                <div className="w-4 h-4 rounded-full bg-purple-600 ring-1 ring-slate-700" />
                              </div>
                              <div className="h-2 bg-slate-600 rounded w-10" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right stats panel */}
                <div className="w-44 border-l border-slate-700/50 p-4 bg-slate-900/40 hidden xl:flex flex-col gap-3 flex-shrink-0">
                  {[
                    { val: '24', color: 'text-blue-400' },
                    { val: '18', color: 'text-green-400' },
                    { val: '4', color: 'text-amber-400' },
                    { val: '2', color: 'text-red-400' },
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-800/60 rounded-lg p-2.5">
                      <div className="h-2 bg-slate-600 rounded w-16 mb-1.5" />
                      <span className={`text-xl font-bold ${s.color}`}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow under mock */}
            <div className="absolute -inset-6 bg-blue-600/10 blur-3xl rounded-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section ref={statsRef} className="bg-blue-600 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-sm tracking-widest uppercase mb-3">Features</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Everything your team needs
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              One platform for project management, team collaboration, and delivery insights.
            </p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                  featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-11 h-11 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-sm tracking-widest uppercase mb-3">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Up and running in minutes
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              No complex onboarding. No lengthy setup. Just create, collaborate, and ship.
            </p>
          </div>

          <div ref={stepsRef} className="relative">
            {/* Connecting line (desktop only) */}
            <div className="absolute top-[3.25rem] left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {steps.map((step, i) => (
                <div
                  key={step.step}
                  className={`flex flex-col items-center text-center transition-all duration-700 ${
                    stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 z-10 relative">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center ring-2 ring-white z-20">
                      <span className="text-white text-[10px] font-bold">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-sm tracking-widest uppercase mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Loved by engineering teams
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              See what teams are saying about Nexus.
            </p>
          </div>

          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-700 ${
                  testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${t.avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Ready to transform your workflow?
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Join hundreds of teams shipping faster with Nexus. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/50 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            Free forever for small teams · No credit card required
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Nexus</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Modern project management for high-performing teams.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'How It Works', 'Analytics', 'Time Tracking'] },
              { title: 'Account', links: ['Sign In', 'Register', 'Dashboard'] },
              { title: 'Company', links: ['About', 'Privacy Policy', 'Terms of Service'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-slate-300 font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-sm">© {new Date().getFullYear()} Nexus. All rights reserved.</p>
            <p className="text-slate-700 text-sm">Built with React & Tailwind CSS</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
