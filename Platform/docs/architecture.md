# IntellMeet Architecture

```
                         +--------------------------------------+
                         |   Browser (React + Vite SPA)         |
                         |   Tailwind UI, Axios, Socket.io      |
                         |   Web Speech API (live captions)     |
                         +----------+----------------+----------+
                                    |                |
                         REST + JWT |                | WebSocket
                                    v                v
        +--------------------------------------------------------------+
        |                  Backend (Node.js + Express)                 |
        |                                                              |
        |  Middleware: JWT auth | rate limiter | Helmet | CORS | upload |
        |                                                              |
        |  Controllers          Services              Sockets          |
        |  - auth               - aiService           - meetingSocket  |
        |  - meeting            - notificationService   (rooms, chat,  |
        |  - task                                       transcripts,   |
        |  - workspace                                  signaling)     |
        |  - notification                                              |
        |  - analytics                                                 |
        +-----------+------------------+------------------+------------+
                    |                  |                  |
                    v                  v                  v
        +------------------+  +----------------+  +------------------+
        |  MongoDB         |  | Cloudinary     |  | OpenAI (optional)|
        |  users, meetings |  | avatar uploads |  | summaries when   |
        |  tasks,          |  | (Base64        |  | OPENAI_API_KEY   |
        |  workspaces,     |  |  fallback)     |  | is set           |
        |  notifications   |  +----------------+  +------------------+
        +------------------+
```

## Request flows

**Meeting to tasks**
1. Participants join a room (Socket.io room code).
2. Speech is captured in the browser (Web Speech API) and sent as transcript events.
3. The backend stores the transcript on the meeting.
4. On "end meeting", `aiService.generateMeetingSummary` extracts decisions and action items.
5. An action item is converted to a task (`POST /api/tasks`) with an assignee.
6. The task appears in the Backlog column of the Kanban board; the assignee gets a notification.

**Deployment pipeline**
```
git push -> GitHub Actions -> backend tests -> frontend build -> docker image builds -> deploy hook -> live site
```

## Runtime topologies

```
Docker Compose:   frontend (nginx :8080) -> backend (:5000) -> mongo (:27017)
Kubernetes/Helm:  frontend Service -> frontend Pods (x2)
                  backend Service  -> backend Pods (x2..6, HPA) -> mongo StatefulSet
```