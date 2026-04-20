export const mockUser = {
  id: '1',
  name: 'Vishwa Limbani',
  email: 'demo@pms.com',
  avatar: null,
}

export let mockProjects = [
  {
    id: '1', name: 'Portfolio Website', description: 'Personal portfolio redesign',
    color: '#3B82F6', memberCount: 3, taskCount: 12, createdAt: '2025-01-10', squadId: '1',
  },
  {
    id: '2', name: 'E-Commerce App', description: 'React + Node.js shop',
    color: '#10B981', memberCount: 5, taskCount: 8, createdAt: '2025-02-01', squadId: '2',
  },
  {
    id: '3', name: 'PMS System', description: 'This very project',
    color: '#8B5CF6', memberCount: 2, taskCount: 20, createdAt: '2025-03-15', squadId: null,
  },
]

export let mockTasks = [
  { id: '1', title: 'Setup project structure', status: 'DONE', priority: 'HIGH', projectId: '1', assignee: mockUser, dueDate: '2025-04-01' },
  { id: '2', title: 'Design login page', status: 'DONE', priority: 'HIGH', projectId: '1', assignee: mockUser, dueDate: '2025-04-05' },
  { id: '3', title: 'Build dashboard layout', status: 'IN_PROGRESS', priority: 'HIGH', projectId: '1', assignee: mockUser, dueDate: '2025-04-20' },
  { id: '4', title: 'Implement Kanban board', status: 'IN_PROGRESS', priority: 'MEDIUM', projectId: '1', assignee: mockUser, dueDate: '2025-04-25' },
  { id: '5', title: 'API integration', status: 'TODO', priority: 'MEDIUM', projectId: '1', assignee: null, dueDate: '2025-05-01' },
  { id: '6', title: 'Write unit tests', status: 'TODO', priority: 'LOW', projectId: '1', assignee: null, dueDate: '2025-05-10' },
  { id: '7', title: 'Review PR #12', status: 'REVIEW', priority: 'MEDIUM', projectId: '1', assignee: mockUser, dueDate: '2025-04-18' },
]

export const mockMembers = [
  { id: '1', name: 'Vishwa Limbani', email: 'demo@pms.com', role: 'ADMIN', avatar: null },
  { id: '2', name: 'Riya Shah', email: 'riya@pms.com', role: 'MEMBER', avatar: null },
  { id: '3', name: 'Arjun Patel', email: 'arjun@pms.com', role: 'VIEWER', avatar: null },
]

export let mockComments = [
  { id: '1', taskId: '1', text: 'This is done, checked on staging.', author: mockUser, createdAt: '2025-04-01T10:00:00Z' },
  { id: '2', taskId: '3', text: 'Working on this today.', author: mockUser, createdAt: '2025-04-18T09:30:00Z' },
]

export let mockAttachments = [
  { id: '1', taskId: '1', name: 'design-mockup.png', size: '2.4 MB', type: 'image', uploadedBy: mockUser, createdAt: '2025-04-01T10:00:00Z' },
  { id: '2', taskId: '1', name: 'requirements.pdf', size: '512 KB', type: 'pdf', uploadedBy: mockUser, createdAt: '2025-04-02T11:00:00Z' },
]

export let mockTimeLogs = [
  { id: '1', taskId: '1', duration: 90, note: 'Initial setup', loggedBy: mockUser, createdAt: '2025-04-01T10:00:00Z' },
  { id: '2', taskId: '3', duration: 120, note: 'Building layout', loggedBy: mockUser, createdAt: '2025-04-18T09:00:00Z' },
]

export let mockSubtasks = [
  { id: '1', taskId: '1', title: 'Setup folder structure', done: true },
  { id: '2', taskId: '1', title: 'Install dependencies', done: true },
  { id: '3', taskId: '3', title: 'Build sidebar component', done: false },
  { id: '4', taskId: '3', title: 'Build topbar component', done: false },
]

export let mockLinkedItems = [
  { id: '1', taskId: '1', linkedTaskId: '3', type: 'blocks' },
  { id: '2', taskId: '3', linkedTaskId: '4', type: 'related' },
]
export let mockProjectMembers = {
  '1': [
    { id: '1', name: 'Vishwa Limbani', email: 'demo@pms.com', role: 'ADMIN', avatar: null, joinedAt: '2025-01-10' },
    { id: '2', name: 'Riya Shah', email: 'riya@pms.com', role: 'MEMBER', avatar: null, joinedAt: '2025-02-01' },
    { id: '3', name: 'Arjun Patel', email: 'arjun@pms.com', role: 'VIEWER', avatar: null, joinedAt: '2025-03-15' },
  ],
  '2': [
    { id: '1', name: 'Vishwa Limbani', email: 'demo@pms.com', role: 'ADMIN', avatar: null, joinedAt: '2025-02-01' },
    { id: '4', name: 'Priya Mehta', email: 'priya@pms.com', role: 'MEMBER', avatar: null, joinedAt: '2025-02-15' },
  ],
  '3': [
    { id: '1', name: 'Vishwa Limbani', email: 'demo@pms.com', role: 'ADMIN', avatar: null, joinedAt: '2025-03-15' },
  ],
}

export let mockSquads = [
  {
    id: '1',
    name: 'Frontend Squad',
    description: 'React, Angular, Vue developers',
    color: '#3B82F6',
    createdAt: '2025-01-10',
    members: [
      { id: '1', name: 'Vishwa Limbani', email: 'demo@pms.com', role: 'Lead' },
      { id: '2', name: 'Riya Shah', email: 'riya@pms.com', role: 'Member' },
      { id: '5', name: 'Kavya Desai', email: 'kavya@pms.com', role: 'Member' },
    ],
  },
  {
    id: '2',
    name: 'Backend Squad',
    description: 'Node.js, Python, Database engineers',
    color: '#10B981',
    createdAt: '2025-02-01',
    members: [
      { id: '1', name: 'Vishwa Limbani', email: 'demo@pms.com', role: 'Lead' },
      { id: '3', name: 'Arjun Patel', email: 'arjun@pms.com', role: 'Member' },
    ],
  },
  {
    id: '3',
    name: 'QA Squad',
    description: 'Testing and quality assurance',
    color: '#F59E0B',
    createdAt: '2025-03-01',
    members: [
      { id: '4', name: 'Priya Mehta', email: 'priya@pms.com', role: 'Lead' },
    ],
  },
]
export let mockNotifications = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'Task assigned to you',
    message: '"Build dashboard layout" was assigned to you',
    read: false,
    projectId: '1',
    taskId: '3',
    createdAt: '2025-04-20T09:00:00Z',
  },
  {
    id: '2',
    type: 'status_changed',
    title: 'Task status updated',
    message: '"Setup project structure" moved to Done',
    read: false,
    projectId: '1',
    taskId: '1',
    createdAt: '2025-04-19T15:30:00Z',
  },
  {
    id: '3',
    type: 'comment_added',
    title: 'New comment on your task',
    message: 'Vishwa commented on "Setup project structure"',
    read: true,
    projectId: '1',
    taskId: '1',
    createdAt: '2025-04-18T11:00:00Z',
  },
  {
    id: '4',
    type: 'member_invited',
    title: 'New member joined',
    message: 'Riya Shah was added to Portfolio Website',
    read: true,
    projectId: '1',
    taskId: null,
    createdAt: '2025-04-17T08:00:00Z',
  },
  {
    id: '5',
    type: 'task_assigned',
    title: 'Task assigned to you',
    message: '"Implement Kanban board" was assigned to you',
    read: false,
    projectId: '1',
    taskId: '4',
    createdAt: '2025-04-20T10:30:00Z',
  },
  {
    id: '6',
    type: 'status_changed',
    title: 'Task status updated',
    message: '"Design login page" moved to Done',
    read: true,
    projectId: '1',
    taskId: '2',
    createdAt: '2025-04-16T14:00:00Z',
  },
  {
    id: '7',
    type: 'comment_added',
    title: 'New comment on your task',
    message: 'Arjun commented on "Build dashboard layout"',
    read: false,
    projectId: '1',
    taskId: '3',
    createdAt: '2025-04-20T11:45:00Z',
  },
]