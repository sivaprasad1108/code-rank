# War Rooms — Decision Log

All finalized architectural, product, UX, and technical decisions are recorded here.
Each entry includes the decision, the reason it was made, alternatives that were considered, and implications for future work.

---

## 1. War Rooms lives inside CodeRank — not as a separate application

**Decision:** War Rooms is a feature module within the existing CodeRank monorepo, not a standalone app, subdomain, or separate service.

**Reason:** CodeRank's value proposition is the execution engine and editor. Splitting War Rooms into a separate app would mean duplicating authentication, the Monaco editor integration, the execution pipeline, and the design system. Users would face a context switch and a second login. The feature's entire credibility comes from being embedded in the same platform.

**Alternatives considered:**
- Separate Next.js app at `rooms.coderank.app` — rejected; doubles infrastructure, splits user sessions
- Separate repo — rejected; coordination overhead, shared design system becomes a pain point

**Future implications:** War Rooms inherits all CodeRank improvements automatically (editor upgrades, auth improvements, execution engine upgrades). Any breaking change to shared infrastructure is shared across both features — this is a feature, not a risk.

---

## 2. New navigation item: "War Rooms" with a NEW badge

**Decision:** War Rooms appears in the primary navigation between Snippets and Docs. It carries a NEW badge using the exact same pill style already present on other nav items in the design system.

**Reason:** War Rooms is a major new capability. It deserves top-level nav placement. Burying it in a dropdown or sidebar would suppress discoverability, which is the primary growth mechanism for the feature.

**Alternatives considered:**
- Sidebar sub-item under Playground — rejected; underrepresents the feature's scope
- Separate "Community" nav group — rejected; overcomplicated navigation for V1

**Future implications:** When the NEW badge is removed (after the feature is mature), no other changes are needed. The `badge?: string` field on the `NavLink` type supports this gracefully.

---

## 3. Maximum 6 players per room for V1

**Decision:** The Create Room modal caps players at 6 (range: 2–6).

**Reason:** Above 6 players, the Battle Workspace sidebar becomes unreadable, the chat becomes noisy, and the execution engine receives submission bursts that need more careful queue management. 6 players provides enough social dynamics (clear competition, meaningful leaderboard) without infrastructure risk.

**Alternatives considered:**
- Unlimited players — rejected; execution queue saturation, unscalable chat, unreadable leaderboard
- Max 4 — considered but 6 allows for richer team-of-3 dynamics and more interesting leaderboards
- Max 8 — rejected for V1; consider for team battles in V3

**Future implications:** The database schema (`room_participants`) and UI grids are designed to handle up to 8 without visual breakage. Increasing the cap later is a config change, not a redesign.

---

## 4. LeetCode as the only problem source for V1

**Decision:** War Rooms V1 supports LeetCode problem IDs only. Players nominate by entering a LeetCode ID (e.g., `1` for Two Sum). The backend resolves the ID to problem metadata from a cache.

**Reason:** LeetCode is the universal lingua franca of competitive programming. Every developer knows LeetCode problem IDs. It requires no explanation, no custom problem authoring, and problems are well-known enough that dispute over problem quality is unlikely. Starting here minimizes scope.

**Alternatives considered:**
- Custom problem authoring — rejected for V1; extremely complex (test case validation, judge infrastructure)
- Codeforces — considered for V2; see FUTURE_IDEAS.md
- AtCoder — considered for V2; see FUTURE_IDEAS.md
- HackerRank — rejected; licensing complexity
- Internal CodeRank problem bank — future direction, not available at V1

**Future implications:** The backend must implement a `problem_cache` table and a `GET /problems/:leetcodeId` endpoint. The frontend `ProblemNominator` and `ProblemStatement` components are already structured around `MockProblem` which mirrors the expected API response shape exactly. Replacing mock data with real API calls should be a direct substitution.

---

## 5. Future problem provider abstraction

**Decision:** The backend problem-fetching layer should be designed as a provider interface from the start, even though only LeetCode is used in V1.

**Reason:** Multiple problem sources are planned (Codeforces, AtCoder, custom sets). Designing a `ProblemProvider` interface now means adding new sources later is additive, not disruptive.

**Interface sketch:**
```typescript
interface ProblemProvider {
  fetchById(id: string): Promise<Problem>
  search(query: string, filters: ProblemFilters): Promise<Problem[]>
}

class LeetCodeProvider implements ProblemProvider { ... }
class CodeforcesProvider implements ProblemProvider { ... }  // V2
```

**Future implications:** The `problem_cache` table should store a `source` column (`leetcode`, `codeforces`, etc.) from day one, even if it only ever contains `leetcode` in V1.

---

## 6. Reuse existing CodeRank execution engine — no changes for V1

**Decision:** War Rooms submissions use the existing Docker execution engine (the same one used by the Playground). No new execution infrastructure is built for V1.

**Reason:** The execution engine already handles everything needed: multi-language support, Docker sandbox isolation, timeouts, memory limits, stdout/stderr capture, and runtime error handling. The only difference in War Rooms is that submission results need to be broadcast to all room participants via WebSocket rather than returned only to the submitter. This broadcast happens at the API layer — the execution engine itself does not need to know it is processing a "battle" submission.

**Alternatives considered:**
- Dedicated execution cluster for War Rooms — rejected for V1; over-engineering
- Shared execution pool with priority lanes — deferred to V2 if execution queue contention becomes a problem

**Future implications:** If War Rooms gains significant adoption, battle submissions may starve playground submissions. Plan: introduce a named execution queue (`battle` vs `playground`) with configurable priority weights. This is a queue configuration change, not an architectural change.

---

## 7. Blind voting — vote counts are never revealed during voting

**Decision:** During the Voting Phase, no vote counts are shown. Players see only their own selection (highlighted card). The winning problem is revealed only when the battle starts.

**Reason:** Showing vote counts creates herding behavior — players vote for what appears to be winning rather than what they actually want. Blind voting produces more authentic preferences and preserves suspense.

**Alternatives considered:**
- Show vote counts in real time — rejected; leads to bandwagon voting
- Show counts after voting closes — considered, but decided the reveal is better handled by the battle starting directly

**Future implications:** This must be enforced server-side. The `GET /war-rooms/:id` endpoint must not expose vote counts to clients during the voting phase. Any client that reconstructs the leaderboard from WebSocket events must also not receive this information.

---

## 8. Problem nomination phase with per-player nominations

**Decision:** Before voting, each player has a nomination window (90 seconds) to submit one LeetCode problem ID. All nominations are visible to all players. A player who does not nominate has no problem card in the vote phase.

**Reason:** Player-sourced problems create buy-in. Players are more engaged when competing on a problem someone in the room chose. Shared visibility of nominations builds anticipation before voting.

**Alternatives considered:**
- Host picks the problem alone — rejected; reduces participant agency
- System picks randomly — available as fallback ("Random Problem" option) but not the primary flow
- Anonymous nominations — considered but visibility was kept to build pre-vote discussion in chat

**Future implications:** Nomination data is stored in the `nominations` table. After the battle, this data enables showing "nominated by X" on the problem card in Solution Review.

---

## 9. Random problem option during nomination

**Decision:** During nomination, each player can click "Random Problem" instead of entering a specific ID. The system selects a random problem from the cache that matches the room's configured difficulty.

**Reason:** Not every developer knows LeetCode problem IDs by heart. The random option lowers the cognitive load of nomination and adds an element of surprise that some players enjoy.

**Future implications:** The backend needs a `GET /problems/random?difficulty=Medium` endpoint that returns a problem from the cache. The frontend `ProblemNominator` component already has UI scaffolding for this flow.

---

## 10. Host controls are visible only to the room host

**Decision:** In the Lobby, the "Start Match", "Kick User", "Transfer Host", "Lock Room", "Mute Chat", "Disable Spectators", and "Adjust Timer" controls are visible only to the authenticated room host.

**Reason:** Only the host should be able to advance the room lifecycle or moderate participants. Showing these controls to all users would be confusing and presents a security surface.

**Frontend implementation:** The current implementation hard-codes host controls as always visible (since there is no auth integration yet). When real auth is wired in, host-only controls must be conditionally rendered based on `currentUser.id === room.hostId`.

**Future implications:** Transfer Host is a first-class operation — when the host disconnects, the server must promote the next oldest participant to host and broadcast `room:host_changed`. The UI must handle this gracefully.

---

## 11. Ready check before match start

**Decision:** The host cannot start a match unless all participants have clicked "Ready". The lobby displays each player's ready status visually.

**Reason:** Prevents a player from being launched into a battle while they are away from keyboard. A battle that starts with an AFK player is a poor experience for everyone.

**Alternatives considered:**
- No ready check, host starts at will — rejected; fairness concern
- Auto-start after countdown — considered for V2 as an optional room setting

**Future implications:** The server must validate ready state on `room:start`. A race condition is possible if a player un-readies as the host clicks start — server must revalidate and reject or use a short lock window.

---

## 12. Spectator mode — read-only, code hidden during battle

**Decision:** Spectators can watch Live Battle rooms. They see the leaderboard updates, submission timeline, and chat. They cannot see any player's code until the battle is complete.

**Reason:** Showing code in real time would enable coaching or hint-giving through the chat. Hiding code preserves competitive integrity. Post-battle code reveal is fine because the competition is over.

**Alternatives considered:**
- Spectators see code in real time — rejected; integrity violation
- No spectator mode at all — rejected; reduces the social/entertainment value of the feature

**Future implications:** The WebSocket server must maintain a `spectator` role per socket. Code content is stripped from events broadcast to spectator sockets. This filtering happens server-side, not client-side.

---

## 13. Solution reveal after battle completion

**Decision:** After a battle ends, all solutions are visible to all participants and spectators via the Solution Review screen.

**Reason:** Learning from others' approaches is one of the highest-value activities in competitive programming. Post-battle review creates a teaching moment and increases time-on-platform.

**Future implications:** The `battle_submissions` table stores the final accepted (or best attempted) code per player. The Solution Review screen reads from this. The `SOLUTION_CODES` mock data in `data/mock.ts` mirrors this data shape exactly.

---

## 14. Match history persisted per user

**Decision:** Every battle a user participates in is saved to their match history. Accessible at `/war-rooms/history`.

**Reason:** Match history is a core retention mechanic. Users return to see their win rate trend, review past battles, and challenge opponents they have faced before.

**Future implications:** The `battle_results` table must record all participants, not just the winner. A join query is needed: `SELECT * FROM battle_results JOIN room_participants ON ... WHERE user_id = :currentUser ORDER BY ended_at DESC`.

---

## 15. Practice mode alongside Battle mode

**Decision:** Rooms can be configured as "Practice" or "Battle". Practice mode removes scoring, rating changes, and leaderboard pressure. It is still real-time and collaborative.

**Reason:** Not every session needs to be competitive. Practice mode allows friends to work through problems together, or developers to use War Rooms as a study group tool, without the stress of competitive scoring.

**Future implications:** The scoring and rating change logic must be gated on `room.mode === 'Battle'`. Practice rooms are not excluded from Match History — they appear with a Practice label.

---

## 16. Anti-cheat considerations

**Decision (V1):** No active anti-cheat in V1. The following passive measures exist:
- Code is not visible to other players during the battle
- Submissions are executed server-side in isolated Docker containers (no client-side execution)
- Rate limiting on submission endpoint (prevent flooding)

**Known gaps (accepted for V1):**
- A player can look up solutions in another browser tab — no mitigation
- Copy-paste detection is not implemented
- Screen sharing detection is not implemented

**Future implications:** Anti-cheat is a deep rabbit hole. For V1, we accept that War Rooms is a good-faith competition platform, not a proctored exam. The user base (developers who chose this platform) is self-selecting toward honest competition. V2 may introduce: submission timing analysis (suspiciously fast first-try accepts), code originality heuristics, and/or tab-switch detection (with user consent).

---

## 17. Leaderboard ranking rules

**Decision:** Final rank is determined by:
1. Accepted status (accepted > not accepted)
2. Score (higher is better)
3. Submission time (earlier is better, tiebreaker)

**Score formula:**
```
Base:              200 pts  (accepted)
First solve:       +50 pts  (first player to accept)
Fastest runtime:   +30 pts  (best runtime among accepted)
Fewest attempts:   +20 pts  (fewest total submissions)
Time bonus:        up to +50 pts  (linear: remaining_time / total_time * 50)
Wrong attempt:     -10 pts each
```

Players who do not solve the problem are ranked below all who do, ordered by score then by last submission time (most recent first).

**Future implications:** This formula must be implemented server-side and must be deterministic (same inputs always produce same score). The client leaderboard is display-only and receives pre-computed rank and score from the server.

---

## 18. Submission status lifecycle

**Decision:** A submission goes through these server-side states:

```
PENDING     ← received by API, queued for execution
RUNNING     ← executing in Docker container
ACCEPTED    ← all test cases passed
WRONG_ANSWER ← one or more test cases failed
TIME_LIMIT_EXCEEDED ← execution exceeded the problem's time limit
MEMORY_LIMIT_EXCEEDED ← execution exceeded memory limit
RUNTIME_ERROR ← process crashed (exception, segfault, etc.)
COMPILE_ERROR ← compilation failed (Java, C++)
```

Each state transition is broadcast to all room participants via `room:player_status_changed`.

**Future implications:** The `battle_submissions.status` column must use an enum type. The frontend `ParticipantsSidebar` status indicator maps directly to these enum values — changing the enum requires updating the status indicator map.

---

## 19. WebSocket event model — server-authoritative, broadcast fan-out

**Decision:** All room state mutations happen server-side. The client sends intent events (e.g., `room:submit`); the server validates, mutates state, and broadcasts the new state to all room members. Clients never optimistically update shared room state.

**Reason:** Competitive integrity requires that all participants see the same ground truth at the same time. Client-side optimistic updates for shared state (leaderboard, submission status, timer) would create races and inconsistencies.

**Exception:** Local UI state (typing in the chat input, code in the editor) is client-only and not broadcast until the user explicitly sends.

**Future implications:** The WebSocket server must be designed around a "broadcast to room" primitive. Redis pub/sub is the standard pattern for multi-instance deployments. This is the most complex part of the backend and should be implemented carefully before the frontend integration begins.

---

## 20. Database entities

**Decision:** Seven new tables are required. See the README.md for full schema. Key decisions within the schema:

- `war_rooms.config` is a JSONB column storing the full room configuration (mode, difficulty, timer, max players, advanced settings). This avoids a wide table and allows easy addition of new config fields without migrations.
- `battle_submissions` stores every submission, not just the final one. This enables the submission timeline and attempt counting.
- `problem_cache.cached_at` is indexed so stale problems can be re-fetched on a schedule.
- All tables include `created_at` timestamps for audit and analytics.

---

## 21. UX principles

**Decision:** The following UX principles govern all War Rooms design decisions:

1. **Native to CodeRank** — every pixel should look like it was designed by the same person who built the Playground. No gaming aesthetics, no Discord styling, no esports neon.
2. **Status always visible** — in a live competition, anxiety comes from not knowing what others are doing. Status indicators reduce anxiety and increase engagement.
3. **Suspense by design** — blind voting, hidden vote counts, and the nomination-to-vote-to-battle sequence build anticipation deliberately.
4. **Non-intrusive notifications** — achievements and system events live in the chat sidebar. Zero modal popups during the battle.
5. **Desktop-first** — the Battle Workspace is intentionally full-screen and feature-dense. It is not designed for mobile in V1.
6. **Seamless room progression** — phases advance without page reloads (WebSocket-driven). The URL changes but the connection stays live.

---

## 22. Design principles

**Decision:** The following design constraints are hard rules, not preferences:

| Rule | Rationale |
|------|-----------|
| Use `--color-*` CSS variables only, never hex values | Ensures theme consistency and future theme support |
| Glassmorphism cards via `GlassCard` component only | Single source of truth for card appearance |
| Purple accent (`--color-accent`) for primary interactive states | Matches Playground and Snippets; enforces brand coherence |
| `GlassCard`, `Button`, `Badge`, `Avatar`, `Tabs`, `Modal` reused | Prevents component fragmentation |
| No new icon library, lucide-react only | Consistent icon sizing and stroke weight |
| `font-code` class for all code/monospace content | Ensures consistent monospace rendering |
| Animation: `transition-colors`, `transition-all duration-200`, `animate-ping` only | Prevents overuse of animation |
| `text-gradient` class for hero accent text | Reuses existing gradient definition from design system |

These constraints were applied throughout the V1 implementation. Violating them in future development will cause visual inconsistency.

---

## 23. `BattleEditor` is a standalone component, separate from `EditorPanel`

**Decision:** The Battle Workspace uses a purpose-built `BattleEditor` component rather than reusing `EditorPanel` from `features/playground`.

**Reason:** `EditorPanel` is tightly coupled to `useEditorStore` (Zustand), which manages playground-specific state (saved snippets, auto-save, multi-tab sessions). Importing this store into War Rooms would create incorrect cross-feature state entanglement. `BattleEditor` maintains its own local `useState` and shares only the Monaco configuration constants.

**What is shared:**
- `EDITOR_OPTIONS` from `config/editor.config.ts`
- `EDITOR_THEME_NAME` and `MONACO_THEME_DATA` from `config/editor.config.ts`
- `LANGUAGES` from `config/languages.config.ts`

**What is NOT shared:**
- `useEditorStore`
- Auto-save behavior
- Multi-file/tab support

**Future implications:** If the playground editor gains new features (e.g., AI code completion, collaborative editing), those changes will not automatically appear in `BattleEditor`. This is intentional — battle-specific editor behavior (read-only mode for solution review, submit button wiring) is clean and contained. Avoid merging these back.
