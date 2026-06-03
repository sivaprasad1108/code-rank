# War Rooms

> Live collaborative coding battles inside CodeRank.

---

## Vision

War Rooms turns CodeRank from a solo practice tool into a competitive, real-time engineering arena. Developers join or create a room, nominate and vote on a problem together, then race to solve it inside a shared workspace — all within the same platform they already use for the playground and snippets.

The feature is not a separate product. It is the natural competitive layer of CodeRank, built on top of the execution engine, authentication, and editor infrastructure that already exists.

---

## Product Goals

1. Increase time-on-platform by giving developers a reason to return daily.
2. Create social gravity — users invite peers, which drives new registrations.
3. Demonstrate CodeRank's execution engine under real competitive load.
4. Establish CodeRank as a developer community hub, not just a utility.
5. Generate a recurring usage loop: discover → compete → review → rematch.

---

## Why War Rooms Exists

CodeRank already provides:
- Multi-language code execution in Docker sandboxes
- Snippet sharing
- A high-quality Monaco editor experience

What it lacks is **real-time human interaction**. Every other part of the product is asynchronous and solitary. War Rooms addresses this gap by layering competition and collaboration directly onto the execution engine CodeRank is built around. The feature communicates: *CodeRank is not just fast code execution — it is a platform where engineers compete.*

---

## How War Rooms Fits Into CodeRank

```
CodeRank Platform
├── Playground        ← solo execution, experimentation
├── Snippets          ← sharing and discovery
├── War Rooms    ←    competitive real-time battles  [THIS FEATURE]
├── Docs              ← API and integration docs
└── Pricing           ← monetization surface
```

War Rooms sits between Snippets and Docs in the navigation. It consumes the same execution infrastructure as the Playground but adds a WebSocket coordination layer, a room lifecycle manager, and a problem sourcing abstraction.

---

## Complete User Flow

```
1. DISCOVERY
   User visits /war-rooms
   → Sees active rooms, platform metrics, featured battles, spectator section
   → Clicks "Create Room" or "Join by ID"

2. CREATE / JOIN
   Create → Modal opens → Configure room → Submit → Redirect to lobby
   Join   → Enter invite code or room ID → Redirect to lobby

3. LOBBY  /war-rooms/[roomId]
   → See participants, ready status, room details, invite code
   → Host sees Start Match control
   → Host clicks Start Match when all players are ready

4. NOMINATION PHASE  /war-rooms/[roomId]/nominate
   → 90-second countdown
   → Each player enters a LeetCode problem ID
   → Problem preview card auto-generates on input
   → "Random Problem" option available
   → Nominations appear in the shared panel as they are submitted

5. VOTING PHASE  /war-rooms/[roomId]/vote
   → 60-second countdown
   → Nominated problems displayed as selectable cards
   → Each player votes for one problem
   → Vote counts are hidden (blind voting)
   → Problem with most votes wins; tie broken randomly

6. BATTLE WORKSPACE  /war-rooms/[roomId]/battle
   → Full-screen 3-column layout
   → Left: participants with live status indicators
   → Center: problem statement + Monaco editor + output panel
   → Right: live leaderboard + live chat + emoji reactions
   → Timer counts down from configured duration
   → Players submit, leaderboard updates in real time

7. BATTLE RESULTS  /war-rooms/[roomId]/results
   → Winner card with crown, score, runtime
   → 5 achievement cards (Fastest, Best Runtime, Fewest Attempts, Most Efficient, Highest Accuracy)
   → Full final rankings table
   → Actions: Rematch, Review Solutions, Share, Return to Rooms

8. SOLUTION REVIEW  /war-rooms/[roomId]/review
   → Read-only Monaco viewer
   → Switch between players via sidebar
   → Compare mode: two editors side-by-side
   → Metrics panel: runtime, memory, attempts, language per player

9. MATCH HISTORY  /war-rooms/history
   → Filterable table of all past battles
   → Win/loss/draw, score, duration, difficulty
   → Quick actions: Review, Rematch
```

---

## Room Lifecycle

```
CREATED
  ↓
WAITING        ← players join, ready up
  ↓
STARTING       ← host clicks Start Match (all players ready)
  ↓
NOMINATING     ← 90-second nomination window
  ↓
VOTING         ← 60-second blind voting window
  ↓
LIVE BATTLE    ← countdown timer running, editor active
  ↓
COMPLETED      ← timer expired or all players submitted
  ↓
ARCHIVED       ← results saved, review accessible
```

State transitions are server-authoritative. The client receives state updates via WebSocket. Clients never transition state unilaterally.

---

## Screen Hierarchy

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | War Rooms Discovery | `/war-rooms` | Browse and join rooms |
| 2 | Create Room Modal | (modal on `/war-rooms`) | Configure and create a room |
| 3 | Room Lobby | `/war-rooms/[roomId]` | Pre-match waiting area |
| 4 | Nomination Phase | `/war-rooms/[roomId]/nominate` | Submit LeetCode problem IDs |
| 5 | Voting Phase | `/war-rooms/[roomId]/vote` | Blind vote on nominated problems |
| 6 | Battle Workspace | `/war-rooms/[roomId]/battle` | The flagship full-screen workspace |
| 7 | Battle Results | `/war-rooms/[roomId]/results` | Winner card and final rankings |
| 8 | Solution Review | `/war-rooms/[roomId]/review` | Read solutions, compare mode |
| 9 | Match History | `/war-rooms/history` | All past battles, filterable |

---

## Feature Overview

### Problem Sourcing
- V1: LeetCode problem IDs only. Players enter an ID, the backend fetches problem metadata (name, difficulty, tags, acceptance rate, description, examples, constraints) from a stored problem cache or scraping layer.
- The problem content is served through CodeRank's own API — no client-to-LeetCode calls.

### Scoring
```
Base Score (accepted)              = 200 pts
First Solve Bonus                  = +50 pts
Fastest Runtime Bonus              = +30 pts
Fewest Attempts Bonus              = +20 pts
Time Remaining Bonus               = up to +50 pts (linear, time remaining / total time)
Wrong Attempt Penalty              = -10 pts each
Total Maximum Possible             = ~350 pts
```

### Battle Modes
- **Battle Mode**: Competitive. Scoring active. Rating changes apply.
- **Practice Mode**: No scoring. No rating changes. No leaderboard pressure.

### Spectator Mode
- Spectators can watch any Live Battle room.
- They see the leaderboard, chat, and submission timeline.
- They cannot see player code until the battle completes (to prevent coaching).
- After completion, full code review is available to spectators too.

### Chat System
Three message types:
1. **User messages** — typed by participants
2. **System events** — automated ("alex_dev submitted", "priya_codes accepted")
3. **Achievement events** — visual callouts ("sivaprasad solved in 6:12!")

Quick emoji reactions: 🔥 ⚡ 🚀 👏 💯

---

## UX Overview

### Core UX Principles
1. **No gaming aesthetics** — dark navy, purple accents, glassmorphism, same design language as Playground and Snippets.
2. **Suspense by design** — blind voting, no live vote counts, status indicators that hint but do not reveal (e.g., "Running" shows activity without showing code).
3. **Every status visible** — participants know what everyone else is doing via colored status dots, never losing the social context of competition.
4. **Non-intrusive notifications** — achievement moments and system events appear in the chat sidebar, never as modal interruptions.
5. **Seamless transitions** — the room lifecycle moves between phases without full page reloads (WebSocket-driven state transitions drive route changes).
6. **Desktop-first** — designed for 1440p, gracefully degrades. Mobile is a secondary consideration for V1.

### Status Indicator System (Battle Workspace)
| Status | Color | Meaning |
|--------|-------|---------|
| Thinking | `--color-text-muted` (grey) | Player is reading / coding |
| Running | `--color-warning` (amber) | Code is being executed |
| Wrong Answer | `--color-error` (red) | Last submission failed |
| Time Limit Exceeded | `--color-error` (red) | Execution timed out |
| Runtime Error | `--color-error` (red) | Runtime crash |
| Accepted | `--color-success` (green) | Problem solved |
| Disconnected | `--color-text-subtle` | Player lost connection |

### Countdown Timer
- SVG circle with `strokeDashoffset` animation
- Turns `text-error` / `stroke-error` when ≤ 5 seconds
- Used in both Nomination and Voting phases
- Props: `initialSeconds: number`, `label: string`, `onComplete?: () => void`

### Voting Phase UX
- Selected card: `border-accent` + `shadow-glow-sm` + `scale-[1.02]`
- NO vote counts shown at any time
- NO indication of which problem is leading
- Purpose: prevent vote-following behavior, preserve genuine preference

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js)                      │
│                                                              │
│  /war-rooms/**  ← feature module: features/war-rooms/       │
│                                                              │
│  WebSocket client (socket.io or native WS)                  │
│  ↕ events: room_state, player_status, submission, chat       │
└───────────────────────────────┬─────────────────────────────┘
                                │ HTTP + WebSocket
┌───────────────────────────────▼─────────────────────────────┐
│                        API (Express)                         │
│                                                              │
│  REST: /war-rooms/** (CRUD: rooms, nominations, votes)       │
│  WebSocket: socket.io server (room namespace per roomId)     │
│                                                              │
│  RoomManager       ← manages state machine per room         │
│  SubmissionHandler ← routes to execution engine             │
│  ProblemCache      ← stores fetched LeetCode metadata        │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├── Postgres (rooms, participants, submissions, results)
       ├── Redis     (room state cache, WebSocket pub/sub)
       └── Docker execution engine (existing, reused)
```

---

## Backend Considerations

### New Database Tables Required
```sql
war_rooms          (id, name, host_id, config, status, created_at, ended_at)
room_participants  (room_id, user_id, joined_at, is_ready, is_host)
nominations        (room_id, user_id, problem_id, nominated_at)
votes              (room_id, user_id, problem_id, voted_at)
battle_submissions (room_id, user_id, problem_id, code, language, status, runtime, memory, attempts, submitted_at)
battle_results     (room_id, winner_id, problem_id, duration, ended_at)
problem_cache      (leetcode_id, name, difficulty, acceptance, tags, description, examples, constraints, cached_at)
```

### New API Endpoints Required
```
POST   /war-rooms                    ← create room
GET    /war-rooms                    ← list public rooms
GET    /war-rooms/:id                ← room details
POST   /war-rooms/:id/join           ← join room
POST   /war-rooms/:id/ready          ← mark ready
POST   /war-rooms/:id/start          ← host starts match
POST   /war-rooms/:id/nominate       ← submit nomination
POST   /war-rooms/:id/vote           ← submit vote
POST   /war-rooms/:id/submit         ← submit solution (→ execution engine)
GET    /war-rooms/:id/results        ← final results
GET    /war-rooms/history            ← user match history
GET    /problems/:leetcodeId         ← problem metadata (from cache)
```

### WebSocket Events
```
CLIENT → SERVER                     SERVER → CLIENT
─────────────────────────────────   ──────────────────────────────────
room:join                           room:state_update
room:ready                          room:player_joined
room:nominate                       room:player_left
room:vote                           room:player_ready
room:submit                         room:nomination_submitted
room:chat_message                   room:voting_started
room:reaction                       room:battle_started
                                    room:player_status_changed
                                    room:submission_received
                                    room:submission_result
                                    room:leaderboard_update
                                    room:chat_message
                                    room:battle_ended
```

### Execution Engine Integration
- War Rooms submissions route through the same Docker execution pipeline as the Playground.
- The difference: results are broadcast to all room participants via WebSocket, not just returned to the submitter.
- The execution engine already handles: language runtimes, timeouts, resource limits, stderr/stdout capture.
- No changes needed to the execution engine itself for V1.

---

## Frontend Considerations

### Current State
All 9 screens are fully implemented as a static/mock frontend. Zero backend integration exists. All data comes from `apps/web/features/war-rooms/data/mock.ts`.

### Backend Integration Points (when resuming)
Each of these static data sources needs to be replaced with real API/WebSocket data:

| Component | Currently | Needs |
|-----------|-----------|-------|
| `FeaturedRoomsGrid` | `MOCK_ROOMS` | `GET /war-rooms` via TanStack Query |
| `PublicRoomsTable` | `MOCK_ROOMS` | `GET /war-rooms` with filter params |
| `ParticipantsPanel` | `MOCK_PLAYERS` | WebSocket `room:player_joined/left/ready` |
| `LiveLeaderboard` | `MOCK_LEADERBOARD` | WebSocket `room:leaderboard_update` |
| `LiveChat` | `MOCK_CHAT` | WebSocket `room:chat_message` |
| `BattleLayout` | hardcoded timer string | WebSocket `room:state_update` with server time |
| `ProblemStatement` | `MOCK_PROBLEMS[0]` | `GET /problems/:id` after vote resolves |
| `HistoryTable` | `MOCK_HISTORY` | `GET /war-rooms/history` |
| `ResultsHero` | `MOCK_LEADERBOARD[0]` | `GET /war-rooms/:id/results` |

### State Management Strategy
- Room state and WebSocket connection: dedicated Zustand store (`useWarRoomStore`)
- Problem data and history: TanStack Query (cacheable REST data)
- Local UI state (chat input, selected vote, compare mode): `useState` in components

### The `BattleEditor` Decision
The existing `EditorPanel` in `features/playground` is tightly coupled to the Playground's Zustand store (`useEditorStore`). Rather than entangle the playground store with war room state, a standalone `BattleEditor` component was created. It shares the same Monaco configuration (`EDITOR_OPTIONS`, `EDITOR_THEME_NAME`, `MONACO_THEME_DATA`, `LANGUAGES`) but maintains its own local state. This is intentional and clean — do not merge these back.

---

## Realtime Considerations

### Technology Choice
Socket.io is recommended over raw WebSockets for V1 because:
- Automatic reconnection (critical when a player's connection drops mid-battle)
- Room-based namespacing aligns with the room model
- Fallback to long-polling for environments where WebSockets are blocked

### Connection Lifecycle
```
Player joins room page → socket connects → emits room:join
Battle ends          → socket disconnects gracefully
Player disconnects   → server broadcasts room:player_status_changed (disconnected)
Player reconnects    → server replays current room state (idempotent join)
```

### Redis Pub/Sub
Multiple API server instances need to broadcast to the same room's participants. Redis pub/sub bridges socket.io across instances. This is important for Render deployments where the API may scale horizontally.

### Timer Authority
The battle countdown timer is **server-authoritative**. The client displays a local countdown initialized from the server's `battle_started_at` timestamp and remaining duration. Never trust a client-only timer — a refreshed page must show the correct remaining time.

---

## Future Scalability Considerations

- **Room sharding**: Route all participants of a room to the same server instance to reduce Redis pub/sub overhead.
- **Execution queue priority**: Battle submissions may benefit from a priority queue lane so competitive submissions are not queued behind long-running playground executions.
- **Problem cache warming**: Pre-fetch popular LeetCode problems into the `problem_cache` table so nomination previews are instant.
- **Observer scaling**: Spectators can be served via SSE (Server-Sent Events) rather than WebSocket to reduce persistent connection count.
- **CDN for static assets**: The Battle Workspace loads Monaco editor — ensure Monaco worker files are cached at the CDN edge.
