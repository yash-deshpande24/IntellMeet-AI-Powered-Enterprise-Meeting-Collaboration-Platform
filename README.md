# IntellMeet - AI-Powered Enterprise Meeting & Collaboration Platform

IntellMeet is an enterprise video conferencing, real-time collaboration, and AI meeting intelligence platform. It features instant WebRTC meeting lobbies, interactive live meeting rooms, automated speech transcription, zero-cost AI meeting summaries, smart action item conversion to Kanban boards, and workspace governance.

---

## 🌟 Architecture Overview

```text
IntellMeet-AI-Powered-Enterprise-Meeting-Collaboration-Platform/
├── Backend/                 # Express, Node.js, Socket.io, MongoDB & AI Intelligence Engine
│   ├── src/
│   │   ├── config/          # MongoDB connection & Cloudinary setup
│   │   ├── controllers/     # Auth, Meeting, Task, Workspace & Analytics controllers
│   │   ├── middleware/      # JWT auth guard, rate limiters, file upload
│   │   ├── models/          # User, Meeting, Task, Workspace Mongoose models
│   │   ├── routes/          # Express API route declarations
│   │   ├── services/        # AI Service (OpenAI + Zero-Cost Fallback NLP Synthesizer)
│   │   └── sockets/         # WebRTC mesh signaling, chat, reactions & AI Copilot
│   ├── .env                 # Backend environment configuration
│   └── package.json
│
├── Frontend/                # React 18, Vite, Tailwind CSS, Lucide Icons, Socket.io Client
│   ├── src/
│   │   ├── components/      # Glassmorphic, accessible UI components
│   │   ├── context/         # AuthContext, MeetingContext, ThemeContext, NotificationContext
│   │   ├── data/            # High-fidelity baseline data & offline fallback
│   │   ├── layouts/         # Dashboard, Meeting, and Public marketing layouts
│   │   ├── pages/           # 18+ enterprise views (Lobby, Live Room, AI Summary, Tasks)
│   │   └── services/        # Axios API client, WebSocket bridge & modular services
│   ├── .env                 # Frontend environment configuration
│   ├── vite.config.js       # Vite configuration with API & WebSocket proxy
│   └── package.json
│
└── package.json             # Root orchestrator script to run both servers concurrently
```

---

## 🚀 Quick Start

### 1. Install Dependencies
You can install dependencies for both the frontend and backend with a single command from the project root:

```bash
npm run install:all
```

Or install individually:
```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 2. Start Full-Stack Application
From the root directory:
```bash
npm run dev
```

* **Frontend Web App:** [http://localhost:5173](http://localhost:5173)
* **Backend API Server:** [http://localhost:5000](http://localhost:5000)
* **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛡️ Dual-Mode Operation (Production Resilient)

IntellMeet is built with **graceful degradation**:
1. **Full-Stack Live Mode:** When the backend is running, the frontend connects to live JWT authentication, real-time Socket.io mesh, database persistence, and the AI meeting intelligence engine.
2. **Offline / Fallback Mode:** If the backend server is offline or MongoDB is not yet provisioned, the frontend automatically falls back to curated mock data and simulated local workflows without throwing errors or breaking the UI.

---

## 🔑 Default Enterprise Demo Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Enterprise VP** | `admin@intellmeet.io` | `password123` | Full admin privileges & workspace ownership |
| **Lead Engineer** | `member@intellmeet.io` | `password123` | Engineering workspace contributor |
| **1-Click Demo** | *(Click button on Login)* | *(Auto)* | Instant preview with pre-loaded meetings & summaries |

---

## 📡 Key API & Socket Specifications

### REST APIs (`/api/`)
* `/api/auth`: Registration, JWT login, profile updates, and avatar uploads.
* `/api/meetings`: Meeting scheduling, room lookup, transcript storage, AI summary generation, and action item conversion.
* `/api/tasks`: Kanban board task management and drag-and-drop status syncing.
* `/api/workspaces`: Workspace members and asset governance.
* `/api/analytics`: Enterprise analytics (hours saved by AI, meeting frequency, sentiment scores).

### WebSocket Events (`/socket.io`)
* `join-room`, `room-peers`, `user-joined`, `user-left`: Peer mesh routing.
* `chat-message`, `user-typing`: Real-time in-room communication.
* `media-toggle`, `screen-share-toggle`, `hand-raise-toggle`: Peer control states.
* `send-reaction`, `receive-reaction`: Synchronized floating emoji reactions.
* `ask-ai-copilot`, `ai-copilot-response`: In-meeting real-time AI copilot query answering.
