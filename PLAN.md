# CodeScreen Clone — Technical Build Plan
### A Real-Time Collaborative Technical Interview Platform

> **Time budget:** 4–5 hours/day | **Duration:** 7–8 Days  
> **Stack you already know:** Express, React (basics), PostgreSQL (NeonDB), REST APIs  
> **Stack you'll be learning:** WebSockets (Socket.io), Monaco Editor, WebRTC (Day 6+)

---

## What We Are Building

A browser-based technical interview platform where:
- An **interviewer** creates a session and invites a **candidate**
- Both join a shared room with a **live collaborative code editor**
- Both can **see each other's cursor and code changes in real time**
- The candidate's code can be **executed** and results shown live
- The interviewer can add **problem statements** from a curated question bank
- Optional: **video/audio** between participants (WebRTC)
- Sessions have a **timer**, a **chat panel**, and a post-session **replay**

---

## Full Architecture Overview

```
┌────────────────────────────────────────────────-────────┐
│                        CLIENT                           │
│  React + Vite                                           │
│  ├── Monaco Editor (code editor, same as VS Code)       │
│  ├── Socket.io-client (real-time sync)                  │
│  ├── React Router (page navigation)                     │
│  ├── Zustand or Context (state management)              │
│  └── WebRTC via simple-peer (video, Day 6+)             │
└───────────────────┬─────────────────────────────────────┘
                    │  HTTP (REST) + WebSocket
┌───────────────────▼─────────────────────────────────────┐
│                      SERVER                             │
│  Node.js + Express                                      │
│  ├── REST API  → Auth, Sessions, Problems               │
│  ├── Socket.io → Real-time collaboration layer          │
│  └── Code Execution → Judge0 API (sandboxed runner)     │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                    DATABASE                             │
│  PostgreSQL on NeonDB                                   │
│  ├── users, sessions, session_participants              │
│  ├── problems, session_problems                         │
│  └── session_snapshots (for replay)                     │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack — Full Breakdown

### Frontend
| Technology | Purpose | Why |
|---|---|---|
| **React + Vite** | UI framework | Fast dev server, you already know React |
| **Monaco Editor** (`@monaco-editor/react`) | The code editor | Powers VS Code, supports 50+ languages, built-in syntax highlighting |
| **Socket.io-client** | WebSocket connection to server | Handles reconnection, rooms, events — easier than raw WS |
| **React Router v6** | Page routing (home, session, lobby) | Standard routing |
| **Zustand** | Lightweight global state | Simpler than Redux, perfect for editor state + session state |
| **Axios** | HTTP REST calls | Auth, loading problems, session create/join |
| **Tailwind CSS** | Styling | Rapid UI building |

### Backend
| Technology | Purpose | Why |
|---|---|---|
| **Express.js** | REST API server | You already know this |
| **Socket.io** | WebSocket server layer | Rooms, broadcasting, namespaces — much easier than raw `ws` |
| **jsonwebtoken (JWT)** | Auth tokens | Stateless auth, works well with sockets too |
| **bcryptjs** | Password hashing | Secure user passwords |
| **pg / postgres.js** | PostgreSQL client for NeonDB | Query your NeonDB instance |
| **Judge0 API** | Remote code execution | Sandboxed runner for 50+ languages, free tier available |
| **node-cron** (optional) | Session cleanup jobs | Auto-close abandoned sessions |

### Infrastructure / Services
| Service | Purpose |
|---|---|
| **NeonDB** | Serverless PostgreSQL (you already use this) |
| **Judge0 (self-hosted or RapidAPI)** | Safe code execution without running user code on your server |
| **Render / Railway** | Deploy backend (free tier) |
| **Vercel** | Deploy frontend |

---

## The Key Concept You Must Understand Before Day 1

### How WebSockets Differ From REST

REST: Client asks → Server replies → Connection closes. Every request is independent.

WebSocket: Client connects → **Persistent two-way pipe** stays open → Either side can push data anytime.

Socket.io wraps WebSockets with:
- **Rooms** — a named channel; you join a room, everyone in it gets your messages
- **Events** — named messages (`'code-change'`, `'cursor-move'`, `'user-joined'`)
- **Automatic reconnection** — if connection drops, it retries

This is exactly how the collaborative editor works: when Candidate types, client emits `code-change` event → server receives it → server **broadcasts** it to everyone else in the same room → their Monaco editor updates.

---

## Database Schema (Design It Now, Build Later)

```sql
-- Users
users (id, email, password_hash, name, role, created_at)

-- Interview Sessions
sessions (id, title, host_id, status, language, created_at, ended_at, session_code)

-- Who joined which session
session_participants (id, session_id, user_id, role [interviewer|candidate], joined_at)

-- Question bank
problems (id, title, difficulty, description, examples, constraints, tags)

-- Problem assigned to a session
session_problems (id, session_id, problem_id, added_at)

-- Code snapshots for replay
session_snapshots (id, session_id, code, timestamp, triggered_by)
```

---

## 7-Day Build Plan

---

### NIGHT 0 (Tonight — Until 5 AM)
**Goal: Project scaffold, tooling, repo setup**

**What to do:**
- Create a monorepo with two folders: `/client` (Vite + React) and `/server` (Express)
- Initialize git, create `.gitignore`, set up `package.json` in both
- Install core dependencies in both (listed below)
- Set up NeonDB on neon.tech, get your connection string, store in `.env`
- Write the database schema SQL and run it on NeonDB (use the Neon SQL editor)
- Make sure Express server starts (`nodemon`) and React dev server starts (Vite)
- Push to GitHub — this is your checkpoint

**Server dependencies to install tonight:**
`express`, `socket.io`, `cors`, `dotenv`, `pg`, `jsonwebtoken`, `bcryptjs`, `nodemon`

**Client dependencies to install tonight:**
`react-router-dom`, `axios`, `@monaco-editor/react`, `socket.io-client`, `zustand`, `tailwindcss`

**Deliverable:** Both servers run. DB tables exist. Repo is on GitHub.

---

### DAY 1 — Auth System (REST)
**Goal: Users can register, log in, get a JWT token**

**What to build:**
- `POST /api/auth/register` — hash password, insert user, return JWT
- `POST /api/auth/login` — verify password, return JWT
- `authMiddleware` — Express middleware that reads JWT from `Authorization` header and attaches `req.user`
- React pages: `/register`, `/login` with forms that call the API and store JWT in `localStorage`
- A protected route wrapper in React (redirect to login if no token)

**Concepts to learn today:**
- How `bcryptjs.hash()` and `bcryptjs.compare()` work
- How `jwt.sign()` and `jwt.verify()` work
- How to pass a JWT in `Authorization: Bearer <token>` header

**Deliverable:** You can register, log in, and land on a dashboard page.

---

### DAY 2 — Sessions + The Code Editor (No Real-Time Yet)
**Goal: Create/join a session, open Monaco Editor, write code locally**

**What to build:**
- `POST /api/sessions` — create a new session, generate a unique `session_code` (6-char alphanumeric), return session object
- `GET /api/sessions/:sessionCode` — fetch session details
- `POST /api/sessions/:sessionCode/join` — add participant record
- React page `/session/:sessionCode` — the main interview room layout:
  - Left panel: problem statement (hardcode a dummy problem for now)
  - Right panel: Monaco Editor
  - Top bar: timer display, language selector, participant names
- Wire up Monaco Editor — it renders, you can type code, change language

**Concepts to learn today:**
- `@monaco-editor/react` — how to use the `onChange` prop, `defaultLanguage`, `theme`
- Session codes — use `crypto.randomBytes(3).toString('hex')` in Node for a 6-char code
- Controlled vs uncontrolled editor state in React

**Deliverable:** You can create a session, visit its URL, and type code in Monaco.

---

### DAY 3 — Real-Time Collaboration via WebSockets (The Big Day)
**Goal: Two browser tabs open the same session — code syncs live**

**This is the most important day. Go slow, understand each step.**

**What to learn first (spend 1 hour reading/watching):**
- How Socket.io rooms work on the server: `socket.join(roomId)`, `socket.to(roomId).emit(event, data)`
- How Socket.io works on the client: `io(serverURL)`, `socket.emit()`, `socket.on()`
- The event flow: Client A types → emits `code-change` → server receives → broadcasts to room → Client B's `socket.on('code-change')` fires → updates Monaco

**What to build:**
- Server-side Socket.io setup:
  - On `connection`: authenticate the socket using the JWT passed in `auth` handshake
  - On `join-session`: socket joins the room named after `sessionCode`
  - On `code-change`: broadcast new code to everyone else in the room
  - On `language-change`: broadcast language to room
  - On `cursor-move`: broadcast cursor position to room (for showing other user's cursor)
  - On `disconnect`: emit `user-left` to room
- Client-side:
  - Connect socket on entering session page, pass JWT in `auth` option
  - On Monaco `onChange`: emit `code-change` with new value
  - On receiving `code-change`: update Monaco value (be careful not to create an infinite loop — only update if the change came from the other user)

**The tricky part — avoiding infinite loops:**
When you receive a code change from the server and update the editor, that triggers Monaco's `onChange`, which would emit another `code-change`. Solution: use a `isRemoteChange` ref flag. Set it true before updating editor programmatically, emit only when it's false.

**Deliverable:** Open two browser tabs on same session URL. Type in one → it appears in the other. Language change syncs. This is the core of your app.

---

### DAY 4 — Code Execution via Judge0
**Goal: Run the code and show output in the session**

**What to learn:**
- Judge0 API: send code + language ID → get back stdout, stderr, compile errors
- Sign up at judge0.com or use the RapidAPI hosted version (free tier)
- Language IDs: Python = 71, JavaScript = 63, Java = 62, C++ = 54

**What to build:**
- Server: `POST /api/execute` — protected route, receives `{ code, languageId }`, calls Judge0 API, returns `{ stdout, stderr, status }`
- Why proxy through your server and not call Judge0 directly from React? To hide your Judge0 API key.
- Client: "Run Code" button in session page → calls `/api/execute` → shows output in a terminal-style panel below Monaco
- Emit the execution result over Socket.io too so the interviewer sees the same output as the candidate

**Judge0 flow:**
1. POST to Judge0 `/submissions` with base64-encoded source code → get a `token`
2. GET `/submissions/:token` with a polling loop until `status.id >= 3` (finished)
3. Parse `stdout`, `stderr`, `compile_output`

**Deliverable:** Hit "Run Code" → see output. Both participants see the same output.

---

### DAY 5 — Problem Bank + Session Management
**Goal: Interviewers can assign problems; session has full lifecycle**

**What to build:**
- Seed your `problems` table with 10–15 LeetCode-style problems (insert via SQL)
- `GET /api/problems` — list all problems (protected)
- `POST /api/sessions/:sessionCode/problems` — interviewer assigns a problem to the session
- `GET /api/sessions/:sessionCode/problems` — fetch problems for session
- In session room: interviewer sees a "Problem Picker" panel; candidate sees the problem statement
- When interviewer picks a problem, emit `problem-selected` over Socket.io → candidate's panel updates
- Session timer: start countdown on session creation, sync via socket so both see same time
- `PATCH /api/sessions/:sessionCode/end` — mark session ended, save final code snapshot to `session_snapshots`

**Deliverable:** Full interviewer flow — create session → assign problem → candidate sees it → code together → end session.

---

### DAY 6 — Video/Audio with WebRTC
**Goal: Both participants can see/hear each other**

**This is the hardest new concept. Spend the first hour understanding it.**

**What to learn — WebRTC concepts:**
- WebRTC is peer-to-peer video/audio directly between two browsers
- But to establish the connection, they need a **signaling server** (this is where your Socket.io server helps)
- The flow: Browser A creates an `RTCPeerConnection`, generates an "offer" (SDP) → sends offer to B via Socket.io → B responds with "answer" → both exchange "ICE candidates" (network paths) → direct P2P connection forms → video streams

**Library to use:** `simple-peer` — it wraps the complex WebRTC API into a much simpler interface.

**What to build:**
- Client: When session page mounts, request `getUserMedia` (camera + mic permission)
- Use `simple-peer` to initiate or receive a peer connection
- Use your existing Socket.io connection to pass the signaling data (offer, answer, ICE candidates)
- Render remote stream in a `<video>` element
- Mute / camera toggle buttons

**Deliverable:** Both users can see and hear each other in the session room, like the screenshot you shared.

---

### DAY 7 — Polish, Auth Guards, Deployment
**Goal: The app is shareable and doesn't break**

**What to build:**
- Session replay: fetch snapshots from DB and play them back with a timeline slider
- Participant indicators: show who is in the room, who is "typing" (emit `typing` events)
- Error handling everywhere: disconnected socket, Judge0 timeout, invalid session code
- Loading states, empty states, proper error messages in UI
- Protect all routes: unauthenticated users redirected to login
- Rate limit the `/api/execute` endpoint (use `express-rate-limit`) so nobody abuses it
- Environment variables properly set for production

**Deployment:**
- Backend → **Railway** or **Render** (both support WebSocket, free tier available)
- Frontend → **Vercel** (connect GitHub repo, auto-deploys)
- NeonDB is already cloud-hosted
- Set `CORS` origin on server to your Vercel frontend URL
- Set all `.env` variables in the deployment dashboards

**Deliverable:** Live URL you can share. Full end-to-end flow works in production.

---

### DAY 8 (Bonus) — If You Have Time
Features worth adding if you push further:

- **Notes panel** — interviewer-only scratchpad (persisted to DB)
- **Hints system** — interviewer can unlock hints for the candidate
- **Session history dashboard** — past sessions with replay links
- **Multiple language tabs** — switch between Python/JS/Java mid-session
- **Diff view** — show what changed in the code over the session

---

## Mental Model Map — How Everything Connects

```
User logs in
     │
     ▼
JWT stored in client
     │
     ├──► REST calls: Authorization header carries JWT
     │
     └──► Socket.io: JWT passed in `auth` on connect handshake
                │
                ▼
          Server validates JWT on every socket connect
                │
                ▼
          socket.join(sessionCode)  ← both users in same "room"
                │
          ┌─────┴─────┐
     User A types    User B types
          │                │
    emit('code-change')  emit('code-change')
          │                │
          └────► server receives
                      │
               broadcast to room
               (excluding sender)
                      │
                ┌─────┴─────┐
           User B gets     User A gets
           update          update
```

---

## Common Pitfalls to Avoid

1. **Infinite loop in editor sync** — always use a flag to distinguish local vs remote changes
2. **Running user code on your server** — never. Always use Judge0 or similar sandboxed service
3. **Storing JWT in localStorage vs httpOnly cookie** — localStorage is fine to start, but know it's XSS-vulnerable; cookies with `httpOnly` are safer
4. **CORS misconfiguration** — when deploying, your Socket.io CORS config must explicitly allow your frontend domain
5. **Not handling socket disconnection** — always listen to `disconnect` and clean up room state
6. **Calling Judge0 from the frontend** — your API key will be exposed. Always proxy through your backend

---

## Suggested File Structure

```
/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Session.jsx        ← the main room
│   │   ├── components/
│   │   │   ├── Editor.jsx         ← Monaco wrapper
│   │   │   ├── ProblemPanel.jsx
│   │   │   ├── OutputPanel.jsx
│   │   │   ├── VideoPanel.jsx
│   │   │   └── Topbar.jsx
│   │   ├── hooks/
│   │   │   ├── useSocket.js       ← socket connection + events
│   │   │   └── useWebRTC.js       ← simple-peer logic
│   │   ├── store/
│   │   │   └── sessionStore.js    ← Zustand store
│   │   └── api/
│   │       └── axios.js           ← Axios instance with base URL + auth header
│   └── vite.config.js
│
└── server/
    ├── routes/
    │   ├── auth.js
    │   ├── sessions.js
    │   ├── problems.js
    │   └── execute.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── socket/
    │   └── sessionHandlers.js     ← all socket event logic lives here
    ├── db/
    │   ├── index.js               ← pg pool setup
    │   └── schema.sql
    └── index.js                   ← Express + Socket.io bootstrap
```

---

## Resources to Bookmark Right Now

- Socket.io docs — `socket.io/docs/v4` (read: Rooms, Emitting events, Auth)
- Monaco Editor React — `github.com/suren-atoyan/monaco-react`
- Judge0 API — `judge0.com` (look at the /submissions endpoint)
- simple-peer — `github.com/feross/simple-peer` (WebRTC made simple)
- NeonDB docs — `neon.tech/docs`

---

*Built with focus, shipped with intention. One day at a time.*
