import { useMemo } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart,
  Legend
} from 'recharts'
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon, Activity, Users } from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'
import { useSquads } from '../../hooks/useSquads'
import { mockProjects } from '../../api/mockData'

const STATUS_COLORS = {
  TODO:        { color: '#9CA3AF', label: 'To Do' },
  IN_PROGRESS: { color: '#3B82F6', label: 'In Progress' },
  REVIEW:      { color: '#F59E0B', label: 'Review' },
  DONE:        { color: '#10B981', label: 'Done' },
}

const PRIORITY_COLORS = {
  LOW:    { color: '#10B981', label: 'Low' },
  MEDIUM: { color: '#F59E0B', label: 'Medium' },
  HIGH:   { color: '#EF4444', label: 'High' },
}

function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
          {Icon && <Icon size={18} className="text-gray-400" />}
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <div className="flex items-center gap-1.5 mt-1">
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium
            ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      {label && <p className="font-medium mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          {p.name}: <span className="font-medium">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function ProjectAnalytics({ projectId }) {
  const { data: tasks = [] } = useTasks(projectId)
  const { data: squads = [] } = useSquads()

  const project = mockProjects.find(p => p.id === projectId)
  const squad = useMemo(() => squads.find(s => s.id === project?.squadId), [squads, project?.squadId])
  const squadMembers = useMemo(() => {
    return squad?.members || []
  }, [squad])

  // ── Computed data ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.status === 'DONE').length
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
    const overdue = tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE'
    ).length
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

    return { total, done, inProgress, overdue, completionRate }
  }, [tasks])

  // Status pie chart data
  const statusData = useMemo(() => {
    return Object.entries(STATUS_COLORS).map(([key, config]) => ({
      name: config.label,
      value: tasks.filter(t => t.status === key).length,
      color: config.color,
    })).filter(d => d.value > 0)
  }, [tasks])

  // Priority bar chart data
  const priorityData = useMemo(() => {
    return Object.entries(PRIORITY_COLORS).map(([key, config]) => ({
      name: config.label,
      count: tasks.filter(t => t.priority === key).length,
      color: config.color,
    }))
  }, [tasks])

  // Tasks over time (last 7 days mock)
  const timelineData = useMemo(() => {
    // Use deterministic values instead of Math.random() for pure rendering
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      // Use deterministic values based on index instead of random
      const created = (i * 13 % 4) + (i < 3 ? 2 : 1)
      const completed = (i * 7 % 3) + (i < 2 ? 1 : 0)
      days.push({ day: dayStr, created, completed })
    }
    return days
  }, [])

  // Team workload data
  const workloadData = useMemo(() => {
    if (squadMembers.length === 0) return []
    return squadMembers.map(member => {
      const memberTasks = tasks.filter(t => t.assignee?.id === member.id)
      const done = memberTasks.filter(t => t.status === 'DONE').length
      const active = memberTasks.filter(t => t.status !== 'DONE').length
      return {
        name: member.name.split(' ')[0],
        fullName: member.name,
        done,
        active,
        total: memberTasks.length,
      }
    }).sort((a, b) => b.total - a.total)
  }, [tasks, squadMembers])

  // Burndown data (mock — ideal vs actual)
  const burndownData = useMemo(() => {
    const total = tasks.length || 10
    const days = 14
    const data = []
    let remaining = total
    for (let i = 0; i <= days; i++) {
      const ideal = Math.round(total - (total / days) * i)
      if (i > 0 && i <= days) {
        // Use deterministic values instead of Math.random() for pure rendering
        const completed = i < days / 2
          ? Math.floor((i * 5) % 2)
          : Math.floor((i * 7) % 3) + 1
        remaining = Math.max(0, remaining - completed)
      }
      const date = new Date()
      date.setDate(date.getDate() - (days - i))
      data.push({
        day: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        ideal,
        actual: remaining,
      })
    }
    return data
  }, [tasks])

  // No tasks fallback
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BarChart3 size={32} className="text-gray-200 mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">No analytics yet</h3>
        <p className="text-sm text-gray-400">Create some tasks to see project analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total tasks"
          value={stats.total}
          icon={BarChart3}
          subtitle="in this project"
        />
        <StatCard
          title="Completion rate"
          value={`${stats.completionRate}%`}
          icon={Activity}
          trend={`${stats.done} done`}
          trendUp={true}
        />
        <StatCard
          title="In progress"
          value={stats.inProgress}
          icon={TrendingUp}
          subtitle="active now"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={TrendingDown}
          subtitle={stats.overdue > 0 ? 'need attention' : 'none overdue'}
          trend={stats.overdue > 0 ? `${stats.overdue} late` : null}
          trendUp={false}
        />
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Status donut */}
        <ChartCard title="Task status breakdown" subtitle="Distribution by current status">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              {statusData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                    <span className="text-xs text-gray-400">
                      ({Math.round((item.value / tasks.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Priority bar chart */}
        <ChartCard title="Priority distribution" subtitle="Tasks grouped by priority level">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} allowDecimals={false}
                axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Tasks over time */}
        <ChartCard title="Tasks over time" subtitle="Created vs completed (last 7 days)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false}
                axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="created" name="Created"
                stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1}
                strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="completed" name="Completed"
                stroke="#10B981" fill="#10B981" fillOpacity={0.1}
                strokeWidth={2} dot={false} />
              <Legend iconType="circle" iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Burndown chart */}
        <ChartCard title="Burndown chart" subtitle="Ideal vs actual remaining tasks">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false} tickLine={false}
                interval={Math.floor(burndownData.length / 5)} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false}
                axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ideal" name="Ideal"
                stroke="#D1D5DB" strokeWidth={2} strokeDasharray="6 3"
                dot={false} />
              <Line type="monotone" dataKey="actual" name="Actual"
                stroke="#EF4444" strokeWidth={2}
                dot={false} activeDot={{ r: 4, fill: '#EF4444' }} />
              <Legend iconType="line" iconSize={12}
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Team workload ── */}
      {workloadData.length > 0 && (
        <ChartCard
          title="Team workload"
          subtitle={`Task distribution across ${squad?.name || 'squad'} members`}
        >
          <ResponsiveContainer width="100%" height={Math.max(200, workloadData.length * 50)}>
            <BarChart data={workloadData} layout="vertical" barSize={18} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="done" name="Done" stackId="tasks"
                fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="active" name="Active" stackId="tasks"
                fill="#3B82F6" radius={[0, 4, 4, 0]} />
              <Legend iconType="circle" iconSize={8}
                wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            </BarChart>
          </ResponsiveContainer>

          {/* Member summary table below chart */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 mb-2 px-1">
              <span className="font-medium">Member</span>
              <span className="font-medium text-center">Total tasks</span>
              <span className="font-medium text-right">Done / Active</span>
            </div>
            {workloadData.map(member => (
              <div key={member.fullName}
                className="grid grid-cols-3 gap-3 text-sm py-2 px-1 rounded-lg hover:bg-gray-50">
                <span className="text-gray-800">{member.fullName}</span>
                <span className="text-center text-gray-600 font-medium">{member.total}</span>
                <span className="text-right">
                  <span className="text-green-600 font-medium">{member.done}</span>
                  <span className="text-gray-300 mx-1">/</span>
                  <span className="text-blue-600 font-medium">{member.active}</span>
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  )
}