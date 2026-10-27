# IntellMeet: AI-Powered Enterprise Meeting Collaboration Platform

IntellMeet is a full-stack meeting platform. Teams hold video meetings, get live captions, receive an AI-generated summary with action items, and turn those action items into tasks on a Kanban board. It is deployed live, packaged with Docker, Kubernetes and Helm, monitored with Prometheus, Grafana, Sentry and UptimeRobot, and checked with load tests and an OWASP ZAP security scan.

## Live demo

| Part | Link |
|---|---|
| Frontend (Vercel) | https://intell-meet-ai-powered-enterprise-m-ebon.vercel.app |
| Backend API (Render) | https://intellmeet-ai-ei2d.onrender.com |
| Health check | https://intellmeet-ai-ei2d.onrender.com/api/health |

Demo account (seeded sample data only, never reuse this password anywhere):

- Email: `admin@intellmeet.io`
- Password: `password123`

The backend runs on a free instance that sleeps after about 15 minutes without traffic. The first request after a pause can take up to 50 seconds, so open the health link first and wait for the JSON.

## Features

- Real-time video meetings with WebRTC and Socket.io signaling
- Live captions during meetings
- AI meeting summary: executive summary, key points, decisions, action items, sentiment and speaker analytics (with a built-in fallback when no AI key is set)
- Action items converted into tasks on a Kanban workspace board
- Real-time notifications with a bell menu
- Meeting analytics dashboard
- JWT authentication, role-based users and rate limiting
- Monitoring and error tracking (Prometheus, Grafana, Sentry, UptimeRobot)

## Tech stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, TanStack Query, Zustand |
| Backend | Node.js 20, Express, Socket.io, Mongoose |
| Database | MongoDB (local for development, MongoDB Atlas in production) |
| Security | Helmet, CORS allowlist, express-rate-limit, JWT, protected `/metrics` |
| Containers | Docker (multi-stage builds), Docker Compose |
| Orchestration | Kubernetes manifests and a Helm chart (MongoDB, backend, frontend, autoscaling) |
| CI/CD | GitHub Actions (tests, Helm lint, Docker image publish) |
| Monitoring | Prometheus, Grafana, Sentry, UptimeRobot |
| Testing | Node load-test script, OWASP ZAP baseline scans |
| Hosting | Render (backend), Vercel (frontend), MongoDB Atlas (database) |

## Folder structure

```
IntellMeet-AI-Powered-Enterprise-Meeting-Collaboration-Platform/
├── Backend/
│   ├── src/
│   │   ├── config/            # database connection (db.js)
│   │   ├── controllers/       # request handlers
│   │   ├── middleware/        # rate limiter, auth
│   │   ├── models/            # User, Workspace, Meeting, Task
│   │   ├── monitoring/        # sentry.js, metrics.js (Prometheus)
│   │   ├── routes/            # auth, meetings, tasks, workspaces, analytics, notifications
│   │   ├── services/          # business logic and AI summary
│   │   ├── sockets/           # meetingSocket.js (WebRTC signaling, chat)
│   │   └── server.js          # app entry point
│   ├── Dockerfile
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/             # dashboard, meeting room, Kanban board, analytics
│   │   ├── services/          # API client and socket.js
│   │   ├── sentry.js          # frontend error tracking
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── vercel.json            # SPA rewrites and security headers
│   └── package.json
├── K8s/
│   ├── (plain manifests)
│   └── helm/intellmeet/       # Chart.yaml, values.yaml, templates/
├── monitoring/
│   ├── docker-compose.monitoring.yml
│   ├── prometheus.yml
│   └── grafana/               # provisioning and the IntellMeet dashboard JSON
├── loadtest/
│   ├── load-test.mjs          # load test (Node, no install needed)
│   ├── node-report.md         # latest results
│   └── node-results.json
├── zap-reports/               # OWASP ZAP baseline reports
├── .github/workflows/         # CI pipeline
├── docker-compose.yml         # full stack: MongoDB, backend, frontend
└── README.md
```

## Run it step by step

### 0. Prerequisites

- Node.js 20 and npm
- Git
- MongoDB running locally on port 27017 (or a MongoDB Atlas connection string)
- Docker Desktop (for steps 6 to 8)
- Optional: minikube, kubectl and Helm (step 7)

### 1. Clone the repository

```powershell
git clone https://github.com/yash-deshpande24/IntellMeet-AI-Powered-Enterprise-Meeting-Collaboration-Platform.git
cd IntellMeet-AI-Powered-Enterprise-Meeting-Collaboration-Platform
```

### 2. Configure the backend

Create `Backend/.env`:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/intellmeet
JWT_SECRET=replace-with-a-long-random-string
ALLOWED_ORIGINS=http://localhost:5173
```

Generate a secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit `.env` files. With `NODE_ENV=development`, the first start seeds the demo accounts and sample data.

### 3. Start the backend

```powershell
cd Backend
npm install
npm start
```

Check it in a second terminal:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

The log should show `MongoDB Connected successfully` and `running on port 5000`.

### 4. Start the frontend

Create `Frontend/.env.local`:

```
VITE_API_URL=http://localhost:5000/api
```

Then, in a new terminal:

```powershell
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173 and log in with the demo account.

### 5. Run the tests

```powershell
cd Backend
npm test
```

### 6. Run everything with Docker Compose

From the project root, with Docker Desktop running:

```powershell
docker compose up --build
```

Stop it with `docker compose down`.

### 7. Deploy to Kubernetes with Helm (minikube)

```powershell
minikube start
docker build -t intellmeet-backend:local ./Backend
docker build -t intellmeet-frontend:local ./Frontend
minikube image load intellmeet-backend:local
minikube image load intellmeet-frontend:local

helm lint ./K8s/helm/intellmeet
helm install intellmeet ./K8s/helm/intellmeet -n intellmeet --create-namespace
kubectl get pods -n intellmeet -w
```

Useful follow-up commands:

```powershell
helm upgrade intellmeet ./K8s/helm/intellmeet -n intellmeet --set frontend.replicas=2
helm list -n intellmeet
helm uninstall intellmeet -n intellmeet
```

### 8. Start monitoring (Prometheus and Grafana)

Start the backend first, then:

```powershell
cd monitoring
docker compose -f docker-compose.monitoring.yml up -d
```

- Prometheus: http://localhost:9090/targets
- Grafana: http://localhost:3000 (dashboard: IntellMeet Backend). Change the default login on first use.

To scrape the protected `/metrics` endpoint of a deployed backend, put the same value as the backend's `METRICS_TOKEN` in the `authorization.credentials` field of `monitoring/prometheus.yml`. Keep the real token out of git.

### 9. Load test

With the backend running locally:

```powershell
$env:RATE_LIMIT_MAX="100000"
$env:AUTH_RATE_LIMIT_MAX="100000"
cd Backend
npm start
```

In a second terminal, from the project root:

```powershell
node loadtest/load-test.mjs --users 50 --loops 20 --ramp 30 --think 300
```

The script writes `loadtest/node-report.md` and `loadtest/node-results.json`. Raise the rate limits only for local tests, never in production. Do not run heavy tests against the free hosted backend.

### 10. Security scan (OWASP ZAP baseline)

```powershell
mkdir zap-reports -Force
docker pull ghcr.io/zaproxy/zaproxy:stable
docker run --rm -v "${PWD}/zap-reports:/zap/wrk/:rw" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:5000 -r backend-baseline.html -I
```

Scan only systems you own.

## Environment variables

### Backend (Render or `Backend/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign login tokens (required) |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs allowed by CORS and Socket.io |
| `HTTPS_ORIGIN` | Public HTTPS URL of the backend (required in production) |
| `SEED_DEMO_DATA` | `true` to seed demo data in production |
| `METRICS_TOKEN` | Protects `/metrics`; Prometheus sends it as a Bearer token |
| `SENTRY_DSN` | Enables backend error tracking |
| `ENABLE_DEBUG_ROUTES` | `true` only briefly to test Sentry, otherwise `false` or unset |
| `RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_MAX` | Rate limit overrides (raise only for local load tests) |

### Frontend (Vercel or `Frontend/.env.local`)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API address, ending in `/api` |
| `VITE_SENTRY_DSN` | Enables frontend error tracking (optional) |

Values prefixed with `VITE_` are public in the browser bundle, so never put real secrets there.

## Deployment

| Part | Platform | Key settings |
|---|---|---|
| Backend | Render (web service) | Root directory `Backend`, build `npm ci`, start `npm start` |
| Frontend | Vercel | Root directory `Frontend`, preset Vite, build `npm run build`, output `dist` |
| Database | MongoDB Atlas | Network access allows Render, dedicated database user |

After deploying the frontend, set its URL in the backend's `ALLOWED_ORIGINS`, so CORS and Socket.io accept it.

## Security

- Helmet sets security headers, including a Content Security Policy and Permissions-Policy
- API responses use `Cache-Control: no-store`
- CORS only allows the listed frontend origins
- Rate limiting on the API and on login
- JWT authentication, with passwords stored as hashes
- `/metrics` is locked with a token in production
- Secrets live in environment variables and are never committed

## Testing results

**Load test** (local backend, 50 virtual users, 20 loops, 30 s ramp-up):

- 6,050 requests, 0.0% errors, about 66 requests per second
- p95 latency 799 ms overall; the analytics endpoint was the slowest and is the first candidate for caching and indexes

**OWASP ZAP baseline** (reports in `zap-reports/`):

- Backend: 0 failures; after adding a CSP and Permissions-Policy, the remaining warnings are informational
- Frontend: 0 failures; the findings were missing headers, addressed in `Frontend/vercel.json`

## Monitoring

| Tool | Use |
|---|---|
| Prometheus and Grafana | Request rate, p95 latency, 5xx errors, active sockets, memory, event-loop lag |
| Sentry | Backend and frontend error tracking |
| UptimeRobot | Uptime checks on the API health endpoint and the frontend |

## Known limitations

- The free hosting tier sleeps when idle, so the first request can be slow
- WebRTC peer-to-peer video may need a TURN server on some mobile or corporate networks
- Live captions rely on the browser speech API, which works best in Chrome and Edge
