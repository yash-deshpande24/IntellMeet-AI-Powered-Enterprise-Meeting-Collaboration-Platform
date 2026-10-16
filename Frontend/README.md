# IntellMeet - AI-Powered Enterprise Meeting Platform (Frontend)

IntellMeet is a modern, responsive web application for enterprise video collaboration and AI-powered meeting intelligence. It offers instant meeting lobbies, live meeting rooms, automated transcripts, executive AI summaries, action items tracking, and team workspace management.

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`AuthContext`, `ThemeContext`, `MeetingContext`, `NotificationContext`)
- **Animations**: Tailwind transitions and keyframe animations

---

## ✨ Features

- **Authentication & Security**:
  - Sign in, Sign up, Forgot Password, Reset Password, and Email OTP verification.
  - 1-Click Demo login for instant testing.
  - Route protection with `ProtectedRoute`.

- **Enterprise Dashboard**:
  - Meeting overview metrics (upcoming meetings, hours, tasks, AI summaries).
  - Quick actions to launch instant meetings, join with an ID, or schedule.
  - Dark / Light mode toggle with persistent local storage.

- **Meetings & Lobby**:
  - Pre-meeting lobby with audio, video, and device selectors.
  - Immersive live meeting interface with participant grid, audio/video controls, chat drawer, participants list, and emoji reactions.
  - Meeting ended summary view.

- **AI Intelligence Suite**:
  - AI Meeting Summaries with key highlights and sentiment analysis.
  - Searchable timestamped smart transcripts with speaker identification.
  - Action Items checklist with completion status and assigned owners.
  - IntellBot interactive assistant for post-meeting queries.

- **Collaboration Hub**:
  - Team member directory, shared files repository, and workspace calendar.

---

## 📁 Project Structure

```text
src/
├── assets/          # Static assets, logos, and images
├── components/      # Reusable UI components
│   └── common/      # Button, Input, Modal, Badge, Card, Avatar, ToastContainer, ProtectedRoute
├── context/         # React Context providers (Auth, Meeting, Theme, Notification)
├── data/            # Mock dataset for meetings, transcripts, and summaries
├── layouts/         # Layout wrappers (DashboardLayout, MeetingLayout, PublicLayout)
├── pages/           # Application views
│   ├── ai/          # AI Summaries, Transcripts, Action Items, Assistant
│   ├── auth/        # Login, Signup, OTP Verification, Password Reset
│   ├── collaboration/ # Team Members, Files, Calendar, Workspace
│   ├── meetings/    # Live Room, Pre-Call Lobby, Schedule, Join, History
│   ├── public/      # Landing Page, About, Contact
│   └── settings/    # Profile, Device Preferences, Security
├── services/        # Axios API client and WebSocket service
├── App.jsx          # Main route configuration
├── index.css        # Global Tailwind and custom utility styles
└── main.jsx         # Application entry point
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

---

## 🎨 Theme Support
IntellMeet features automatic theme detection and manual toggle between Light Mode and Dark Mode. Themes are synchronized across all views and stored in `localStorage`.
