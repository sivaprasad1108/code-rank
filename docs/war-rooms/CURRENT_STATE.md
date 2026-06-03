# War Rooms — Current Implementation State

Last updated: 2026-05-30
Branch: `main`

---

## Summary

The War Rooms frontend is **complete as a static UI**. All 9 screens are built, all components are implemented, all route pages are wired up, and the TypeScript compiler passes with zero errors. There is no backend integration at all. Everything runs on mock data.

The feature is production-quality in terms of design fidelity, component architecture, and code hygiene. It is not production-ready in terms of functionality — it cannot create real rooms, run real battles, or persist any state.

---

## What Is Implemented

### Frontend — Fully Complete

#### Navigation
- [x] `apps/web/config/navigation.config.ts` — War Rooms added to `NAV_LINKS`, `NAV_LINKS_EXTENDED`, and `ROUTES`
- [x] `apps/web/components/layout/NavBar.tsx` — NEW badge rendered for nav items with `badge` field

#### Mock Data (`apps/web/features/war-rooms/data/mock.ts`)
- [x] `MOCK_PLAYERS` — 4 players with ratings, ranks, statuses, host flags
- [x] `MOCK_ROOMS` — 6 rooms covering all statuses (waiting, starting, live)
- [x] `MOCK_PROBLEMS` — 3 problems (Two Sum #1, Valid Parentheses #20, Maximum Subarray #53) with full metadata
- [x] `MOCK_LEADERBOARD` — 4 entries with scores, runtimes, memory, attempts
- [x] `MOCK_CHAT` — user, system, and achievement message types
- [x] `MOCK_ACTIVITY` — lobby activity feed events
- [x] `MOCK_TIMELINE` — battle submission timeline events
- [x] `MOCK_HISTORY` — 8 match history entries
- [x] `PLATFORM_STATS` — live metric numbers
- [x] `SOLUTION_CODES` — one solution per player (Python)
- [x] TypeScript types exported: `RoomStatus`, `Difficulty`, `RoomMode`, `PlayerStatus`, `MockPlayer`, `MockRoom`, `MockProblem`, `LeaderboardEntry`, `ChatMessage`, `MatchHistoryEntry`

#### Screen 1 — War Rooms Discovery (`/war-rooms`)
- [x] `DiscoveryHero` — hero heading, subtitle, Create Room CTA, Join by ID CTA, purple glow background
- [x] `PlatformMetrics` — 4 GlassCard stat panels with live pulse indicators
- [x] `FeaturedRoomsGrid` — 3-column card grid with `StatusPill`, difficulty badge, player count, host avatar
- [x] `PublicRoomsTable` — full-width table with search input, difficulty/status/mode filter dropdowns
- [x] `SpectatorSection` — Live battle cards with Watch Battle CTA and participant list
- [x] `apps/web/app/war-rooms/page.tsx` — client component, manages CreateRoomModal open state

#### Screen 2 — Create Room Modal
- [x] `CreateRoomModal` — glassmorphic modal (size="lg"), uses existing `Modal` component
  - Room name + description inputs
  - Mode, difficulty, timer, visibility, max players selectors (styled `SelectRow` component)
  - Language chips with multi-select (Python, JavaScript, Java, C++, Go, Rust)
  - 5 advanced setting toggles (Enable Spectators, Enable Chat, Allow Rematch, Enable Solution Sharing, Lock Language Selection)
  - "Create Room" button navigates to `/war-rooms/demo-room`

#### Screen 3 — Room Lobby (`/war-rooms/[roomId]`)
- [x] `ParticipantsPanel` — player cards with Crown for host, Ready/Not Ready indicator, rating
- [x] `RoomInfoPanel` — room details, invite code (`ALPHA-7X42`), copy-to-clipboard, Share button, Start Match CTA
- [x] `ActivityFeed` — timestamped event log with colored dot indicators, host controls grid (Lock, Mute, Kick, Adjust)
- [x] `apps/web/app/war-rooms/[roomId]/page.tsx` — 2-column grid layout

#### Screen 4 — Nomination Phase (`/war-rooms/[roomId]/nominate`)
- [x] `CountdownTimer` — SVG animated circle, `initialSeconds` prop, `onComplete` callback, turns red at ≤5s
- [x] `ProblemNominator` — problem ID input, auto-generates problem preview card, Random Problem option
- [x] `NominationsPanel` — shows all submitted nominations with nominator avatars
- [x] `apps/web/app/war-rooms/[roomId]/nominate/page.tsx`

#### Screen 5 — Voting Phase (`/war-rooms/[roomId]/vote`)
- [x] `ProblemVoteCard` — selectable card, purple border + glow when selected, NO vote counts shown
- [x] `apps/web/app/war-rooms/[roomId]/vote/page.tsx` — client component with `useState` for selected problem, "Confirm Vote & Start" navigates to battle

#### Screen 6 — Battle Workspace (`/war-rooms/[roomId]/battle`)
- [x] `BattleLayout` — full-screen 3-column layout (220px | flex-1 | 280px), top status bar with elapsed/remaining time, End Battle link
- [x] `ParticipantsSidebar` — status dots with color per status, mini leaderboard at bottom
- [x] `ProblemStatement` — 5 tabs (Description/Examples/Constraints/Hints/Tags), renders problem markdown
- [x] `BattleEditor` — standalone Monaco editor (separate from playground), language selector dropdown, Run/Save Draft/Reset toolbar
- [x] `LiveLeaderboard` — right sidebar table with rank, score, accepted badge, runtime, memory
- [x] `LiveChat` — user/system/achievement message rendering, emoji reactions strip (🔥⚡🚀👏💯), message input
- [x] `BattleOutputPanel` — 5 tabs (Output/Test Cases/Submissions/Logs/Performance) with mock content
- [x] `apps/web/app/war-rooms/[roomId]/battle/page.tsx` — renders `BattleLayout` directly, no NavBar wrapper (full screen)

#### Screen 7 — Battle Results (`/war-rooms/[roomId]/results`)
- [x] `ResultsHero` — winner card with Crown, avatar, score, runtime, submission time, golden glow
- [x] `AchievementCards` — 5 cards (Fastest Solver, Best Runtime, Fewest Attempts, Most Efficient, Highest Accuracy)
- [x] `FinalRankings` — full rankings table (Rank/Player/Score/Status/Attempts/Runtime/Solved At), Rematch/Review/Share actions
- [x] `apps/web/app/war-rooms/[roomId]/results/page.tsx`

#### Screen 8 — Solution Review (`/war-rooms/[roomId]/review`)
- [x] `PlayerList` — clickable sidebar, rank/username/runtime/accepted status per player
- [x] `SolutionViewer` — read-only Monaco viewer, compare mode toggle, side-by-side editor when compare is active, compare player dropdown
- [x] `MetricsPanel` — 6-cell metrics bar (Runtime/Memory/Attempts/Solved At/Score/Language)
- [x] `apps/web/app/war-rooms/[roomId]/review/page.tsx` — client component, `useState` for selected player, compare player, compare mode

#### Screen 9 — Match History (`/war-rooms/history`)
- [x] `HistoryTable` — Win Rate summary stats, search + difficulty + result filters, full table with Review/Rematch actions
- [x] `apps/web/app/war-rooms/history/page.tsx`

#### Barrel Export
- [x] `apps/web/features/war-rooms/index.ts` — all 27 components exported

#### TypeScript
- [x] `pnpm --filter web exec tsc --noEmit` passes with zero errors

---

## What Is NOT Implemented

### Backend — Nothing Exists

| Component | Status |
|-----------|--------|
| `war_rooms` database table | Not created |
| `room_participants` table | Not created |
| `nominations` table | Not created |
| `votes` table | Not created |
| `battle_submissions` table | Not created |
| `battle_results` table | Not created |
| `problem_cache` table | Not created |
| `POST /war-rooms` | Not implemented |
| `GET /war-rooms` | Not implemented |
| `POST /war-rooms/:id/join` | Not implemented |
| `POST /war-rooms/:id/ready` | Not implemented |
| `POST /war-rooms/:id/start` | Not implemented |
| `POST /war-rooms/:id/nominate` | Not implemented |
| `POST /war-rooms/:id/vote` | Not implemented |
| `POST /war-rooms/:id/submit` | Not implemented |
| `GET /war-rooms/:id/results` | Not implemented |
| `GET /war-rooms/history` | Not implemented |
| `GET /problems/:leetcodeId` | Not implemented |
| WebSocket server (socket.io) | Not implemented |
| Room state machine | Not implemented |
| Problem cache service | Not implemented |
| Execution result broadcast | Not implemented |
| Redis pub/sub for WebSocket fan-out | Not implemented |

### Frontend — Integration Gaps

All these components currently read from mock data. When backend integration begins, these must be wired to real APIs/WebSockets:

| Component | Mock Source | Real Source Needed |
|-----------|-------------|-------------------|
| `FeaturedRoomsGrid` | `MOCK_ROOMS` | `GET /war-rooms` (TanStack Query) |
| `PublicRoomsTable` | `MOCK_ROOMS` | `GET /war-rooms?difficulty=&status=` |
| `ParticipantsPanel` | `MOCK_PLAYERS` | WebSocket `room:state_update` |
| `ActivityFeed` | `MOCK_ACTIVITY` | WebSocket `room:*` events |
| `BattleLayout` timer | hardcoded strings | WebSocket room state (`battle_started_at`) |
| `ParticipantsSidebar` | `MOCK_PLAYERS` | WebSocket `room:player_status_changed` |
| `ProblemStatement` | `MOCK_PROBLEMS[0]` | `GET /problems/:id` (after vote) |
| `LiveLeaderboard` | `MOCK_LEADERBOARD` | WebSocket `room:leaderboard_update` |
| `LiveChat` | `MOCK_CHAT` | WebSocket `room:chat_message` |
| `BattleOutputPanel` | hardcoded strings | Submission result from execution engine |
| `BattleEditor` Run/Submit buttons | no-op | `POST /war-rooms/:id/submit` |
| `CreateRoomModal` submit | navigates to /demo-room | `POST /war-rooms` |
| `RoomInfoPanel` invite code | hardcoded `ALPHA-7X42` | API response |
| `ResultsHero` | `MOCK_LEADERBOARD[0]` | `GET /war-rooms/:id/results` |
| `FinalRankings` | `MOCK_LEADERBOARD` | `GET /war-rooms/:id/results` |
| `HistoryTable` | `MOCK_HISTORY` | `GET /war-rooms/history` |
| `SolutionViewer` | `SOLUTION_CODES` | `GET /war-rooms/:id/submissions/:userId` |

### Missing Frontend Work

- **WebSocket client**: No `useWarRoomStore` (Zustand) or socket.io client initialization exists. This is the highest-priority frontend piece after the backend WebSocket server is ready.
- **Auth-gated host controls**: Host-only controls in `RoomInfoPanel` and `ActivityFeed` are currently always visible. Must be conditional on `currentUser.id === room.hostId`.
- **Real routing**: `CreateRoomModal` navigates to `/war-rooms/demo-room` (hardcoded). Must navigate to the real `roomId` returned by `POST /war-rooms`.
- **Loading and error states**: All data-fetching components currently show mock data immediately. They need loading skeletons and error handling.
- **Nomination phase auto-advance**: After the nomination countdown reaches 0, the client should navigate to `/vote`. Currently the timer calls `onComplete` but the page does nothing with it.
- **Voting phase auto-advance**: Same — after voting timer expires, navigate to `/battle`.
- **Battle end detection**: When the server broadcasts `room:battle_ended`, the client should navigate to `/results`.
- **Metrics panel memory column**: Currently `MOCK_LEADERBOARD` has a `memory` field but `MetricsPanel` hardcodes "14.2 MB" — this must read from the leaderboard entry.

---

## Technical Debt

| Item | Severity | Description |
|------|----------|-------------|
| `outputHeight` state in `BattleLayout` | Low | `setOutputHeight` is declared but the panel height is not user-resizable (no drag handle). Either wire it up or remove the unused setter. |
| Hardcoded `parseInt(TIME_LEFT) < 5` | Medium | `BattleLayout` timer logic uses `parseInt` on a `MM:SS` string — this compares minutes to 5, not minutes remaining. Must be fixed when the real countdown is implemented. |
| `demo-room` hardcoded roomId | High | Every link that navigates to a room uses `/demo-room` as the roomId. This must be replaced with dynamic routing from API responses. |
| `BattleOutputPanel` tab `badge` | Low | Tab badge counts (3 test cases, 1 submission) are hardcoded. Should derive from actual data. |
| Missing `key` stability in chat | Low | `MOCK_CHAT` uses numeric IDs. When real data arrives, chat message keys must be stable UUIDs to prevent React reconciliation flicker. |
| No error boundaries | Medium | None of the War Rooms components have error boundaries. A single API failure will crash the entire page. Add `ErrorBoundary` wrappers before backend integration. |
| `HistoryTable` missing Date Range filter | Low | The spec calls for a Date Range filter. Only difficulty and result filters are implemented. |
| `MetricsPanel` hardcoded language | Low | `MetricsPanel` always shows "Python 3.12". Must read from the player's submission record. |

---

## Blockers Before Backend Integration Can Begin

1. **WebSocket infrastructure decision**: Choose between socket.io and native WebSockets. Socket.io is recommended for reconnection handling. This decision affects both the server implementation and the client `useWarRoomStore` design.

2. **Problem cache strategy**: LeetCode does not have an official public API. Options:
   - Scrape and cache problem data manually (legal grey area, practical for a small closed set)
   - Use the unofficial LeetCode GraphQL API (fragile, may break without notice)
   - Manually seed a curated set of ~500 problems into the `problem_cache` table
   The recommended path for V1 is manually seeding ~500 well-known problems. This is reliable, offline, and avoids API dependency.

3. **Execution engine submission flow**: The current execution engine returns results to the submitter only. It needs a callback mechanism so the API server can broadcast results to all room participants after execution completes. This may require a callback URL or a result queue (Redis list) per room.

4. **Auth integration**: The current frontend has no user identity in the War Rooms context. `currentUser.id` is needed to distinguish host vs participant, to associate nominations and votes with users, and to personalize Match History.

---

## Recommendations Before Resuming Development

### Step 1 — Do not touch the frontend until the backend is ready
The frontend is complete and clean. Adding more frontend polish without a backend to integrate against creates more integration debt. Resist the urge to refine UI details.

### Step 2 — Start with the database schema
Run migrations for all 7 new tables. Validate the schema with real data before writing a single API endpoint. The schema is the contract everything else depends on.

### Step 3 — Build the REST API first, WebSocket second
Implement all REST endpoints (`/war-rooms`, `/war-rooms/:id/*`) and verify them with curl or Postman before writing the WebSocket layer. Mixing both at once increases debugging complexity.

### Step 4 — Build the problem cache seeder
Before the nomination feature can be demoed with real data, the `problem_cache` table needs data. Write a one-time seed script that inserts ~50 well-known LeetCode problems (the "Blind 75" list is an obvious starting point). This unblocks the nomination and voting flows immediately.

### Step 5 — Integrate frontend one screen at a time
Integration order recommended:
1. Discovery page (GET /war-rooms → replace MOCK_ROOMS)
2. Create Room + Lobby (POST /war-rooms, GET /war-rooms/:id)
3. Nomination + Voting (POST /nominate, POST /vote)
4. Battle Workspace (WebSocket — this is the hardest step)
5. Results + Review (GET /war-rooms/:id/results)
6. Match History (GET /war-rooms/history)

### Step 6 — Fix the timer logic in BattleLayout before integration
The `parseInt(TIME_LEFT) < 5` bug must be fixed before connecting the real countdown. The correct check is: `remainingSeconds < 5 * 60` (5 minutes) or `remainingSeconds < 30` (30 seconds, depending on intent).
