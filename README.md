# 🗂️ Project Management System (PMS)

A full-featured **Project Management System** built with React — featuring Kanban boards, task tracking, squad management, real-time search, analytics, and more.

> Built as a portfolio project to demonstrate modern frontend architecture, clean UI design, and scalable code patterns.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### Core Modules
- **Authentication** — Login, Register with form validation (Zod + React Hook Form)
- **Dashboard** — Stats overview, My Tasks, Recent Projects
- **Projects** — Full CRUD, color picker, squad assignment
- **Tasks** — Kanban board (drag & drop) + List view (inline editing, sorting, filtering)
- **Task Detail Drawer** — Slide-in panel with 5 tabs:
  - 💬 Comments (add, delete, real-time)
  - ✅ Subtasks (add, toggle, progress bar)
  - 📎 Attachments (upload, preview, delete)
  - ⏱️ Time Log (log hours, total tracking)
  - 🔗 Linked Items (blocks, related, duplicates)

### Team & Organization
- **Squad Management** — Create squads, add/remove members, assign roles (Lead/Member)
- **Team Members** — Per-project member management with role-based access (Admin/Member/Viewer)
- **Squad-scoped Assignment** — Task assignees are filtered by the project's assigned squad

### Productivity
- **Global Search** — `Ctrl+K` command palette searching across projects, tasks, squads, members
- **Notifications** — Dropdown with filters (Assigned, Status, Comments, Members), mark read, clear all
- **Project Analytics** — 5 interactive charts:
  - 📊 Task status donut chart
  - 📊 Priority distribution bar chart
  - 📈 Tasks over time area chart
  - 📉 Burndown chart (ideal vs actual)
  - 👥 Team workload horizontal bar chart

### Settings
- **Profile** — Edit name, email, bio with inline editing
- **Password** — Change password with show/hide toggle
- **Preferences** — Timezone, language selection
- **Danger Zone** — Delete account with email confirmation

### UI/UX
- **Fully Responsive** — Mobile hamburger menu, adaptive layouts
- **Smooth Animations** — Page transitions, slide-in drawers, hover effects
- **Custom Scrollbars** — Clean thin scrollbars
- **Keyboard Navigation** — Search with arrow keys + enter

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router DOM v6 |
| **State Management** | Zustand (auth, UI state) |
| **Server State** | TanStack React Query (caching, mutations) |
| **Forms** | React Hook Form + Zod validation |
| **Drag & Drop** | @hello-pangea/dnd |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/pms-frontend.git
cd pms-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Credentials

```
Email:    demo@pms.com
Password: password123
```

---

## 📁 Project Structure

```
src/
├── api/                    # API layer (mock-ready, swap with real backend)
│   ├── axios.js            # Axios instance + interceptors
│   ├── auth.api.js         # Auth endpoints
│   ├── projects.api.js     # Projects CRUD
│   ├── tasks.api.js        # Tasks CRUD + status
│   ├── members.api.js      # Team members
│   ├── squads.api.js       # Squad management
│   ├── taskDetail.api.js   # Comments, subtasks, attachments, time log, linked items
│   ├── notifications.api.js
│   └── mockData.js         # All mock data (remove when backend is ready)
│
├── hooks/                  # React Query hooks
│   ├── useAuth.js
│   ├── useProjects.js
│   ├── useTasks.js
│   ├── useMembers.js
│   ├── useSquads.js
│   ├── useTaskDetail.js
│   └── useNotifications.js
│
├── store/                  # Zustand global state
│   ├── authStore.js        # User, token, login/logout
│   └── uiStore.js          # Sidebar, mobile menu
│
├── pages/                  # Route-level pages
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProjectsPage.jsx
│   ├── ProjectDetailPage.jsx
│   ├── SquadsPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
│
├── components/
│   ├── layout/             # App shell
│   │   ├── AppLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── tasks/              # Task-related components
│   │   ├── KanbanBoard.jsx
│   │   ├── TaskCard.jsx
│   │   ├── ListView.jsx
│   │   ├── CreateTaskModal.jsx
│   │   └── TaskDetailDrawer.jsx
│   ├── projects/
│   ├── members/
│   │   ├── MembersTab.jsx
│   │   └── InviteMemberModal.jsx
│   ├── analytics/
│   │   └── ProjectAnalytics.jsx
│   ├── notifications/
│   │   └── NotificationDropdown.jsx
│   ├── search/
│   │   └── GlobalSearch.jsx
│   └── ui/                 # Reusable atoms
│       ├── Spinner.jsx
│       └── EmptyState.jsx
│
├── routes/
│   └── ProtectedRoute.jsx
│
├── utils/
│   ├── constants.js        # Enums (status, priority, roles)
│   └── formatDate.js       # Date helpers
│
├── App.jsx                 # Root routes + providers
├── main.jsx                # Entry point
└── index.css               # Tailwind + global styles
```

---

## 🔌 Switching to Real Backend

The frontend is designed with a clean API separation layer. Every mock API file has commented-out real API calls ready to uncomment.

**To connect a real backend:**

1. Update `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

2. In each `src/api/*.api.js` file, uncomment the real API calls and remove the mock logic:
```js
// BEFORE (mock):
export const getProjectsApi = async () => {
  await new Promise(r => setTimeout(r, 400))
  return [...mockProjects]
}

// AFTER (real):
export const getProjectsApi = async () => {
  const res = await api.get('/projects')
  return res.data
}
```

3. Remove `src/api/mockData.js` when fully migrated.

---

## 📸 Screenshots

> Add screenshots of your app here — Login, Dashboard, Kanban Board, Task Detail, Analytics, etc.

| Dashboard | Kanban Board |
|-----------|-------------|
| ![Dashboard](screenshots/dashboard.png) | ![Kanban](screenshots/kanban.png) |

| Task Detail | Analytics |
|------------|-----------|
| ![Detail](screenshots/task-detail.png) | ![Analytics](screenshots/analytics.png) |

---

## 🗺️ Roadmap

- [ ] Real backend API (Node.js + Express + Prisma + PostgreSQL)
- [ ] Real-time updates (WebSocket)
- [ ] File upload to cloud storage (AWS S3)
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Export reports (PDF/CSV)
- [ ] Calendar view for tasks
- [ ] Mobile app (React Native)


---

## 👨‍💻 Author

**Vishwa Limbani**

- GitHub: [@vishwalimbani](https://github.com/vishwalimbani)
- LinkedIn: [Vishwa Limbani](https://linkedin.com/in/vishwalimbani)

---

> ⭐ If you found this project helpful, please give it a star on GitHub!