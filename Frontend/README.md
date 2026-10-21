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

---

## 🔗 Full-Stack Backend Integration & Architecture

IntellMeet is built with an **Adaptive Dual-Mode Integration**:
- **Live Mode:** Connects automatically to the Express + Socket.io backend (`http://localhost:5000`) for real JWT authentication, MongoDB persistence, live WebRTC socket mesh, real-time chat, floating reactions, and automated AI meeting summaries.
- **Graceful Fallback Mode:** If the backend or MongoDB is offline, or when testing with 1-Click Demo profiles, the frontend transparently falls back to curated in-memory mock datasets without any UI interruptions or application errors.

### Backend Endpoints Connected:
- **Authentication (`/api/auth`):**
  - `POST /login` & `POST /register`: JWT issue & verification.
  - `GET /me`, `PUT /profile`, `POST /avatar`: User profile management.
- **Meetings (`/api/meetings`):**
  - `GET /` & `POST /`: Fetch meeting list and create new scheduled/instant conferences.
  - `GET /code/:code` & `GET /:id`: Retrieve or ad-hoc initialize meeting rooms.
  - `PATCH /:id/status`: Update meeting status (`active` / `completed`).
  - `POST /:id/ai-summary`: Trigger automatic executive summary, action items & sentiment generation.
  - `POST /:meetingId/action-items/:actionItemId/convert`: Convert meeting action items into Kanban workspace tasks.
- **Kanban Tasks (`/api/tasks`):**
  - `GET /`, `POST /`, `PATCH /:id/status`, `DELETE /:id`: Manage workspace tasks.
- **Real-Time Sockets (`meetingSocket.js`):**
  - `join-room`, `room-peers`, `user-joined`, `user-left`: Participant presence.
  - `chat-message`, `typing`, `stop-typing`: Live in-meeting text channels.
  - `media-toggle`, `screen-share-toggle`, `hand-raise-toggle`: Control states.
  - `send-reaction`: Floating synchronized emoji animations.
  - `ask-ai-copilot` & `ai-copilot-response`: In-meeting real-time AI assistant.

