# IntellMeet: AI-Powered Enterprise Meeting & Collaboration Platform

> Real-time meetings, live captions, AI summaries, smart action items and team task boards in one MERN application.

![CI/CD](https://github.com/yash-deshpande24/IntellMeet-AI-Powered-Enterprise-Meeting-Collaboration-Platform/actions/workflows/ci.yml/badge.svg)

| | |
|---|---|
| **Live demo** | https://intell-meet-ai-powered-enterprise-meeting-git-46cb7d-yash-f623.vercel.app/ |
| **API health check** | https://intellmeet-ai-ei2d.onrender.com/api/health |
| **Demo login (admin)** | `admin@intellmeet.io` / `password123` |
| **Demo login (member)** | `member@intellmeet.io` / `password123` |
| **Demo video** | `<VIDEO_URL>` |

> **Note:** The API runs on a free Render instance that sleeps when idle. The first request can take 30 to 60 seconds. Open the API health link once, then use the app.
> Live captions use the browser's speech recognition and work in **Chrome and Edge**.

---

## 1. What it does

Meetings waste time because decisions and tasks get lost afterwards. IntellMeet turns every meeting into something trackable:

1. **Meet.** Join a room, chat, and turn on live captions.
2. **Summarize.** When the meeting ends, the AI engine builds an executive summary, key points, decisions and action items from the real transcript.
3. **Act.** Convert an action item into a task on the Kanban board and assign it to a teammate.
4. **Notify.** The assignee gets a live notification in the app.
5. **Measure.** A dashboard shows meeting and task analytics.

## 2. Features

| ID | Feature | Status |
|---|---|---|
| F-01 | Authentication: signup, login, JWT, bcrypt, roles (Admin, Member), profile and avatar upload | Done |
| F-02 | Real-time meeting room: Socket.io rooms, WebRTC signaling, live chat events, screen share and hand-raise events | Partial: signaling and events are built; the room UI still shows demo participant tiles |
| F-03 | AI meeting intelligence: live captions (Web Speech API), transcript storage, summary, decisions, action items, sentiment | Done (built-in rule-based engine, optional OpenAI) |
| F-04 | Real-time collaboration: chat, mentions, notifications pushed over Socket.io | Done |
| F-05 | Post-meeting dashboard: summary page, transcript, action items | Done |
| F-06 | Team and project management: workspaces, Kanban board, task assignment | Done |
| F-07 | Analytics: meeting and task metrics | Done |

## 3. Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Context API |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose), MongoDB Atlas in the cloud |
| Real-time | Socket.io, WebRTC signaling |
| AI | Built-in rule-based NLP engine (no paid key needed), optional OpenAI |
| Auth and security | JWT, bcrypt, Helmet, CORS allow-list, express-rate-limit |
| Storage | Cloudinary, with a free Base64 fallback |
| Containers | Docker multi-stage builds, docker-compose |
| Orchestration | Kubernetes manifests and a Helm chart |
| CI/CD | GitHub Actions (tests, Helm lint, Docker build and publish) |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas (database) |
| Monitoring | Prometheus metrics, Grafana dashboard, Sentry (optional), uptime monitor |

## 4. Architecture

```
                 +--------------------+
   Browser  ---> |  React (Vercel)    |
   (HTTPS)       +---------+----------+
                           | REST + WebSocket
                           v
                 +--------------------+        +----------------+
                 | Express + Socket.io| -----> | MongoDB Atlas  |
                 | (Render / Docker)  |        +----------------+
                 +----+----------+----+
                      |          |
          /metrics    |          |  notifications, transcripts
                      v          v
              +-------------+  AI engine (rule-based, optional OpenAI)
              | Prometheus  |
              |  + Grafana  |
              +-------------+
```

## 5. Project structure

```
IntellMeet.../
├── Backend/            Express API, Socket.io, models, AI service, tests
│   └── src/            config, controllers, middleware, models, routes,
│                       services, sockets, monitoring
├── Frontend/           React app (pages, layouts, context, services, hooks)
├── K8s/helm/intellmeet Helm chart (Kubernetes manifests as templates)
├── monitoring/         Prometheus and Grafana configuration
├── loadtest/           Load test and security check scripts
├── .github/workflows/  CI/CD pipeline
└── docker-compose.yml  MongoDB + backend + frontend
```

## 6. Run it locally

### Option A: Docker (easiest)

Requires Docker Desktop.

```bash
docker compose up --build
```

Open http://localhost:8080 and log in with the demo account.

### Option B: run each part

Requires Node.js 20 and a MongoDB (local, or an Atlas connection string).

```bash
# Backend
cd Backend
npm install
# put MONGODB_URI in Backend/.env.local (this file is git-ignored)
node server.js            # http://localhost:5000

# Frontend (new terminal)
cd Frontend
npm install
npm run dev               # http://localhost:5173
```

The first start creates the demo accounts and sample data (`NODE_ENV=development`).

### Environment variables (backend)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Database connection string |
| `JWT_SECRET` | Secret for signing tokens (required) |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs allowed by CORS |
| `NODE_ENV` | `development` or `production` |
| `HTTPS_ORIGIN` | Public API URL (required in production) |
| `SEED_DEMO_DATA` | `true` creates the demo accounts in production |
| `SENTRY_DSN`, `METRICS_TOKEN` | Optional monitoring |
| `RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_MAX` | Raise limits for local load tests only |

Frontend: `VITE_API_URL` is the API address, for example `https://intellmeet-ai-ei2d.onrender.com/api`.

## 7. Kubernetes and Helm

```bash
docker build -t intellmeet-backend:local ./Backend
docker build -t intellmeet-frontend:local --build-arg VITE_API_URL=http://localhost:5000/api ./Frontend
# minikube: load the images
minikube image load intellmeet-backend:local
minikube image load intellmeet-frontend:local

helm install intellmeet ./K8s/helm/intellmeet -n intellmeet --create-namespace
kubectl port-forward -n intellmeet svc/backend 5000:5000
kubectl port-forward -n intellmeet svc/frontend 8080:80
```

## 8. Testing

| Test | Command | Result |
|---|---|---|
| AI summary accuracy (3 sample meetings) | `node Backend/tests/summaryAccuracy.js` | `<fill in>` |
| Load test | `node loadtest/load-test.mjs --users 50 --loops 20` | `<fill in: error %, p95, throughput>` |
| Security checks (OWASP-mapped) | `node loadtest/security-check.mjs` | `<fill in: PASS / FAIL counts>` |
| Dependency audit | `npm audit` in Backend and Frontend | `<fill in>` |
| CI pipeline | GitHub Actions on every push | see the badge above |

## 9. Security measures

- Passwords hashed with bcrypt; JWT with 7-day expiry; demo tokens are disabled in production.
- Helmet security headers, CORS allow-list, request body size limit.
- Rate limiting on all API routes and a stricter limit on login and signup.
- HTTPS enforced in production; non-root Docker user; secrets are kept out of git (`.env.local`, Render and Vercel environment variables).
- Optional `METRICS_TOKEN` protects the metrics endpoint.

## 10. Known limitations and roadmap

Being honest about the current state:

- The meeting room shows demo participant tiles. Real camera streams over WebRTC (peer connections using the existing signaling) are the main next step.
- Meeting rooms are tracked in memory, so the backend runs as a single instance. Horizontal scaling needs the Socket.io Redis adapter.
- Not built yet: refresh tokens, Redis caching, real cloud recording.
- Access control needs hardening: ownership checks on tasks and meetings, field allow-lists on updates, and authenticated socket room joins.
- The free hosting plan sleeps when idle.

## 11. Author

Built by **Yash Deshpande** for the Zidio Development / LogicVeda Web Development (MERN) program, 2026.
