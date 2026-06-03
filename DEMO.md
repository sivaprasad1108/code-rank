# CodeRank — Project Demonstration Script

> Recording-ready. Word-for-word narration with screen actions, technical callouts, and a full preparation checklist.

---

## Part 1 — What Evaluators Care About Most

### Must Show

| Priority | Feature | Why |
|---|---|---|
| 1 | **Online Code Execution** | The core requirement — multi-language, isolated, measurable |
| 2 | **Docker Sandboxing** | Security and isolation are explicit requirements |
| 3 | **Execution Metrics** | Time, exit code, stdout/stderr — measurable output |
| 4 | **User Authentication** | JWT, bcrypt, httpOnly cookies — a full auth system |
| 5 | **Snippet Creation & Saving** | Persistence of code beyond one session |
| 6 | **Snippet Sharing** | Public URL, viewable by anyone — the shareability requirement |
| 7 | **Snippet Discovery (Feed)** | Community layer on top of compiler |
| 8 | **API Architecture** | Fastify + BullMQ async queue + Redis polling — non-trivial design |

### Good To Show

| Priority | Feature | Why |
|---|---|---|
| 9 | **Test Case Execution** | Multi-input, pass/fail per case — practical feature |
| 10 | **Collections & Recents** | Personalisation layer, shows DB breadth |
| 11 | **Rate Limiting** | Security, production-readiness |
| 12 | **Stdin Support** | Completeness of the execution model |
| 13 | **Comments & Stars** | Community interaction on snippets |
| 14 | **Mobile Experience** | Responsive UI |

### Optional

| Priority | Feature | Why |
|---|---|---|
| 15 | **Landing Page Walkthrough** | Contextual intro, not a core technical requirement |
| 16 | **User Profile Page** | Secondary social feature |
| 17 | **War Rooms Preview** | UI prototype only — show briefly for vision, not as functionality |

---

## Part 2 — Recommended Demo Flow

**Principle:** Show working software first. Weave technical explanations into the product demo. Never pause to show a diagram or file.

| Step | What | Why |
|---|---|---|
| 1 | Introduction | Set context, project name, goal in 30 seconds |
| 2 | Landing Page | Frame the product for the evaluator |
| 3 | Playground — First Run | Immediately prove the core feature works |
| 4 | Execution Architecture (inline) | Explain Docker + BullMQ while the result is on screen |
| 5 | Multi-Language Execution | Show all 4 supported languages work |
| 6 | Stdin + Test Cases | Show depth of execution model |
| 7 | Authentication | Register → Login → protected features unlock |
| 8 | Snippet Create, Save, Share | Show the persistence and shareability story |
| 9 | Snippet Feed & Discovery | Community layer, stars, comments |
| 10 | Collections & Recents | Personalised workspace |
| 11 | Technical Architecture (inline) | Mention schema, Redis, rate limits naturally |
| 12 | Mobile Experience | Brief, concise |
| 13 | War Rooms Preview | Short — vision only, explicitly label as prototype |
| 14 | Closing | Summarise and close strong |

---

## Part 3 — Full Narration Script

---

### SECTION 1 — Introduction

> **[Screen: VS Code or terminal — nothing open yet. Speak directly to camera or screen.]**

"Hi, I'm Siva — and this is **CodeRank**.

CodeRank is a full-stack platform I built for this capstone project. At its core, it's an online code execution environment — you write code in the browser, it runs securely on the server inside isolated Docker containers, and you get back real output, real errors, and real execution metrics.

But beyond just a compiler, CodeRank has a full snippet management system, a community discovery feed, user authentication, and a preview of a future collaborative coding feature called War Rooms.

Let me walk you through it."

---

### SECTION 2 — Landing Page

> **[Screen: Open `https://code-rank-app.vercel.app`]**

"This is the CodeRank landing page. The headline captures the product: *Code. Execute. Learn. Rank Higher.*

The two primary calls to action are the playground and the snippet feed — those are the two main surfaces of the product.

You can see the feature highlights here — instant execution, permanent share links, sandboxed by default, execution metrics, community feed, and multi-language support.

The FAQ covers some common questions about isolation, timeouts, and whether signup is required — and the answer to that last one is no, you can start coding immediately without an account.

Let me click into the playground."

---

### SECTION 3 — Playground — First Code Execution

> **[Screen: Click "Start Coding for Free" → `/playground`]**

"This is the Playground — the core feature of CodeRank.

On the left is the Monaco editor — the same engine that powers VS Code. On the right you'll see the output panel and the sidebar.

Let me run something immediately to show you it works.

I'll select Python, write a simple function —"

> **[Action: Select Python in language picker. Type this code:]**
```python
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
```

"— and click Run."

> **[Action: Click the Run button. Wait for result.]**

"While this runs, let me explain what's actually happening.

The frontend sends the code to the API — a `POST /execute` request. The API doesn't run code synchronously. Instead, it immediately returns a `jobId` and places the job into a **BullMQ queue**, backed by Redis. A pool of workers — up to 5 concurrent — picks up the job and spins up a **Docker container** specifically for this execution. The code is bind-mounted into the container as a read-only file. The worker streams stdout and stderr, waits for the process to exit, and stores the result back in Redis with a 5-minute TTL.

Meanwhile, the frontend is polling `GET /execute/:jobId` every 500ms. When the result lands, it displays it here."

> **[Screen: Result is visible — `[0, 1]`, execution time shown]**

"There's the output. `[0, 1]` — correct answer. And you can see the execution time in milliseconds.

For Python and JavaScript, I built an automatic timing harness that runs the function **three times** and reports the **median** — this filters out JVM warmup noise and gives a more stable measurement.

The result came back in under a second. That's the full round-trip — frontend, API, queue, Docker container, back to Redis, back to the browser."

---

### SECTION 4 — Multi-Language Execution

> **[Screen: Playground still open]**

"CodeRank supports four languages: **Python 3.12**, **Node.js 20**, **Java 21**, and **C++** with GCC 13.

Let me switch to JavaScript."

> **[Action: Switch language picker to JavaScript. Replace code with:]**
```javascript
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement), i];
        seen.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
```

> **[Action: Click Run]**

"Same algorithm, JavaScript this time.

For compiled languages like Java and C++, the container runs `javac` or `g++ -O2` to compile first, then executes the binary. The execution time for those includes compilation — I call that out in the metrics.

Let me show C++ quickly."

> **[Action: Switch to C++. Replace code with:]**
```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            cout << "[" << seen[comp] << ", " << i << "]" << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}
```

> **[Action: Click Run]**

"C++ — compiled and executed inside the container. The exit code, stdout, and stderr all come back correctly."

---

### SECTION 5 — Stdin Support & Test Cases

> **[Screen: Playground, switch back to Python]**

"The execution model goes beyond simple print statements. You can pass **stdin** to the program.

Let me show the test case mode — switch the right panel to 'Test Cases'."

> **[Action: Open the test cases panel. Add a test case with input `9 2 7 11 15` and expected output `0 1`.]**

> **[Action: Replace code with:]**
```python
target, *nums = map(int, input().split())
seen = {}
for i, n in enumerate(nums):
    comp = target - n
    if comp in seen:
        print(seen[comp], i)
        break
    seen[n] = i
```

"When you run with test cases, each case gets its own container execution. The output is compared against the expected output and marked pass or fail. You can add multiple test cases and see a per-case breakdown."

> **[Action: Click Run. Show pass/fail per case.]**

"This makes CodeRank genuinely useful for practising algorithm problems, not just running scripts."

---

### SECTION 6 — Sandboxing & Security

> **[Screen: Stay on Playground. Speak while result is visible.]**

"Let me talk about security — because for a platform that runs arbitrary user code on a server, this is critical.

Every execution runs inside a Docker container with the following constraints:

The process runs as **`nobody`** — a non-root user. All Linux capabilities are **dropped**. The root filesystem is **read-only**. The **network is completely disabled** — the container cannot make outbound connections. Memory is capped at **128MB with no swap**. CPU is limited to **50% of one vCPU**. The process limit is **50 PIDs** — which prevents fork bombs. And there's a hard **10-second timeout** — after which the container is forcibly killed.

A user cannot read other users' files, cannot exfiltrate data, cannot install packages, and cannot keep a process running beyond 10 seconds.

Let me prove the timeout works."

> **[Action: Write a simple infinite loop in Python:]**
```python
while True:
    pass
```

> **[Action: Click Run. Wait for timeout.]**

"After 10 seconds, the container is killed and you get a `timeout` status back. The worker cleans up — removes the container and the temp directory."

---

### SECTION 7 — Authentication

> **[Screen: Navigate to `/register`]**

"Now let me show authentication. CodeRank has a full auth system — registration, login, protected routes.

I'll create an account."

> **[Action: Fill in registration form with a demo username, email, password. Submit.]**

"On the backend, the password is hashed with **bcrypt** at 12 rounds. The session is stored as a **JWT in an httpOnly cookie** — not localStorage. This means the token is inaccessible to JavaScript running in the page, which protects against XSS token theft.

In production, the cookie is set with `sameSite: none; secure: true` — this allows the cross-origin request between the Vercel frontend and the VPS-hosted API to work correctly with cookies.

Once logged in, the UI unlocks saving snippets, starring, commenting, and accessing collections and recents. Authentication is **optional** — the playground and public feed work without an account."

> **[Screen: After registration, show the user is now logged in — navbar shows username or avatar.]**

---

### SECTION 8 — Snippet Creation & Saving

> **[Screen: Navigate back to `/playground`]**

"Now that I'm authenticated, I can save my code as a snippet. Let me write something worth saving."

> **[Action: Write a clean Python snippet — something clearly useful, e.g.:]**
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))
```

> **[Action: Click Run — show it works. Then click Save Snippet (or the save button in the sidebar).]**

> **[Action: Fill in title "Binary Search — Clean Implementation", leave public, save.]**

"The snippet is saved to PostgreSQL with a unique auto-generated slug — a 10-character nanoid. That slug becomes the permanent URL for this snippet."

---

### SECTION 9 — Snippet Sharing

> **[Screen: Navigate to the saved snippet's share page — `/s/[slug]`]**

"This is the snippet sharing page. Anyone with this URL can view the code, see the language and title, and click **Run** to execute it directly — without needing an account.

This is the shareability story of CodeRank. You paste this link in a PR review, a team chat, a blog post — the recipient sees exactly your code, can run it to verify it, and can explore it."

> **[Action: Open the snippet URL in an incognito window or a different browser to prove it works without auth.]**

"The view count increments asynchronously each time the snippet is fetched — non-blocking.

Authenticated users can also star the snippet. Stars are tracked in a join table — one star per user per snippet."

---

### SECTION 10 — Snippet Feed & Discovery

> **[Screen: Navigate to `/feed`]**

"The feed is the community discovery layer. Every public snippet lands here — filterable by language, sortable by stars, most recent, or most viewed.

You can browse what other developers are sharing — interesting algorithms, utilities, experiments.

Let me find the snippet I just saved."

> **[Action: Filter by Python. Find the binary search snippet. Click on it.]**

"From the snippet detail page, I can star it, read the description, run it, and leave a comment. Comments support **nested replies** — a threaded comment model via a `parentId` self-reference in the schema."

> **[Action: Add a comment. Show it appears.]**

---

### SECTION 11 — Collections & Recents

> **[Screen: Navigate to `/playground`. Show the sidebar.]**

"The playground sidebar has two persistent features — **Recents** and **Collections**.

Recents automatically saves the last 10 code snippets I've executed. It deduplicates by language and code, so re-running the same snippet doesn't create duplicates. Each recent has a custom title and can be renamed.

Let me click into a recent execution."

> **[Action: Click a recent entry in the sidebar. Show the code loads into the editor.]**

"Collections are like folders. I can create a named collection — say, 'Sorting Algorithms' — and add any code snippet to it manually. Items get auto-titled from code comments or function names, or I can set a custom title.

Both recents and collections are stored in PostgreSQL under the authenticated user. For unauthenticated users, they fall back to localStorage."

---

### SECTION 12 — Technical Architecture

> **[Screen: Stay on Playground. Speak over the UI.]**

"Let me bring together the architecture now that you've seen all the features working.

**Frontend:** Next.js 14 with the App Router. Feature-based folder structure — each feature has its own components, hooks, and store. TypeScript throughout.

**Backend:** Fastify 4 — chosen for its performance and schema-first design. All routes are validated with Zod schemas at the boundary. The same Zod schemas are shared between the API and frontend via a local `packages/types` workspace package — a single source of truth.

**Database:** PostgreSQL with Drizzle ORM. 9 tables: users, snippets, stars, comments, follows, recents, collections, collectionItems, and an executions table in the schema that's currently unused — execution results are ephemeral, stored in Redis with a 5-minute TTL instead.

**Execution queue:** BullMQ backed by a dedicated persistent Redis instance. I have two Redis configurations — one for app-level caching like rate limits, and a separate one for the BullMQ queue. This matters because BullMQ uses Lua scripts and polls at around 10 requests per second — running it against Upstash's serverless Redis exhausted the free tier quota in 12 hours. Separating them keeps each concern on the right storage tier.

**Rate limiting:** Global 100 requests per minute per IP. The execute endpoint is additionally limited to 10 per minute. Login is 10 per 15 minutes, and registration is 5 per 15 minutes.

**Deployment:** The API runs on a Ubuntu VPS managed by PM2. The frontend is on Vercel. PostgreSQL is on Neon's serverless offering. Redis runs in a Docker container on the VPS."

---

### SECTION 13 — Mobile Experience

> **[Screen: Open DevTools. Switch to mobile viewport (iPhone 14 or similar). Navigate to `/playground`.]**

"CodeRank is fully responsive. The layout adapts cleanly to mobile viewport sizes — the editor, output panel, and sidebar all reflow correctly.

Syntax highlighting, language selection, and code execution all work on mobile. This is a real-world use case — you can be on the go, think of a problem, and still test a solution in your browser."

> **[Action: Type a few lines of Python. Click Run. Show it executes on mobile viewport.]**

"I'll keep this brief — the point is that the core functionality isn't desktop-only."

---

### SECTION 14 — War Rooms Preview

> **[Screen: Navigate to `/war-rooms`]**

"Last feature — and I want to be explicitly clear here: **War Rooms is a design preview. It is not a completed feature.**

When you navigate to War Rooms for the first time, you'll see this modal explaining that. You can dismiss it and explore the UI, but there is no backend behind it. The rooms, participants, and battle flow are all mock data."

> **[Action: Dismiss the modal. Show the discovery page — featured rooms grid, public rooms table.]**

"The vision for War Rooms is a real-time collaborative coding battle platform. Multiple participants join a room, nominate and vote on a problem, then race to solve it live. There'd be a real-time leaderboard, live chat, and a post-battle review where you can compare solutions side by side.

Let me show you what the Battle Workspace looks like — this is the most complex screen."

> **[Action: Navigate to `/war-rooms/demo-room/battle`]**

"This is the battle layout. Left panel — participant list. Center — the problem statement with tabs for description, examples, constraints, hints, and tags. Below that, the Monaco editor. Bottom panel — output with test cases. Right panel — live leaderboard and chat.

All panels are resizable and collapsible. The editor takes full space when you need it.

This UI is fully built. The missing piece is the real-time backend — WebSockets, matchmaking, battle state management, and persistence. That's the next major development phase."

> **[Action: Show collapsing the left panel, resizing the output panel. Then navigate away.]**

---

### SECTION 15 — Closing Statement

> **[Screen: Return to the landing page `/`]**

"That's CodeRank.

Let me summarise what was actually built:

A **production-deployed full-stack application** with a Fastify API, a Next.js frontend, PostgreSQL, and Redis. A **secure code execution engine** running user code inside Docker containers with strict sandbox constraints — no network, no root, no persistence, with a hard 10-second timeout. Support for **four programming languages**: Python, JavaScript, Java, and C++. A complete **snippet management system** with creation, saving, sharing via permanent URLs, starring, and threaded comments. A **community feed** with filters and sorting. Personalised **collections and recents** stored per user. A full **JWT-based authentication system** with bcrypt password hashing and httpOnly cookies. **Rate limiting** on all sensitive endpoints backed by Redis. And a full **UI preview** for the War Rooms feature that lays the groundwork for future real-time collaboration.

The project satisfies all core requirements: multi-language online execution, sandboxed and isolated, with measurable metrics, persistent storage, sharing capability, and a clean responsive UI.

Thank you."

---

## Part 4 — Screen Actions Reference

| Section | URL | Actions |
|---|---|---|
| Introduction | *(terminal or blank)* | Speak to camera |
| Landing Page | `https://code-rank-app.vercel.app/` | Scroll through sections, read headline, point out CTAs |
| First Execution | `/playground` | Select Python, type Two Sum, click Run, wait for result |
| Multi-language | `/playground` | Switch to JavaScript, run. Switch to C++, run |
| Stdin/Test Cases | `/playground` | Open test case panel, add input/expected, run |
| Timeout Demo | `/playground` | Write `while True: pass`, run, wait for timeout |
| Register | `/register` | Fill form, submit, confirm logged in |
| Save Snippet | `/playground` | Write binary search, run, save snippet |
| Snippet Share | `/s/[slug]` | Open URL, show it loads, open in incognito |
| Feed | `/feed` | Filter by Python, find snippet, click into it, add comment |
| Collections | `/playground` | Show sidebar: recents list, click entry, show collections |
| Mobile | `/playground` (DevTools mobile) | Resize viewport, type code, click run |
| War Rooms Discovery | `/war-rooms` | Dismiss modal, scroll page |
| Battle Workspace | `/war-rooms/demo-room/battle` | Show full layout, collapse/resize panels |
| Closing | `/` | Return to landing page |

---

## Part 5 — Technical Talking Points

### Code Execution
- `POST /execute` returns `202` with a `jobId` immediately — no blocking
- BullMQ queue with 5 concurrent workers processes jobs in FIFO order
- Each worker calls Docker SDK (`dockerode`) to spin up a container per execution
- Code is bind-mounted as `/code:ro` — read-only, never written inside the container
- Worker races `container.wait()` against a 10-second timeout promise; loser kills the container
- Result stored in Redis as `exec:{jobId}` with 300s TTL
- Frontend polls every 500ms until status is not `pending` or `running`

### Timing & Accuracy
- Python/JS: auto-driver injects `time.perf_counter_ns()` / `process.hrtime.bigint()` around the detected function, runs 3 times, reports median
- Java/C++: full container time (includes compilation)
- This is intentional — pure algorithm time vs total runtime are different metrics

### Docker Security
- `--network none`, `--read-only`, `--cap-drop ALL`, `--no-new-privileges`
- PID limit 50 (fork bomb protection), memory 128MB, CPU 0.5
- `/tmp` tmpfs 10MB noexec; `/build` tmpfs 10MB exec (C++ only)
- User: `nobody` (UID 65534)

### Authentication
- bcrypt 12 rounds (deliberate — slower is more secure for passwords)
- JWT payload: `{ sub: userId, username }`
- httpOnly cookie: inaccessible to `document.cookie` JavaScript — XSS-resistant
- `sameSite: none` in production required for cross-origin cookie on Vercel → VPS

### Database
- Drizzle ORM — no magic, SQL-first, full TypeScript inference
- Shared Zod schemas in `packages/types` — API and frontend share the same type definitions
- `executions` table exists in schema but is intentionally unused — Redis TTL is sufficient for the polling window

### Dual Redis
- `REDIS_URL` — rate limiting, app caching (can be Upstash)
- `QUEUE_REDIS_URL` — BullMQ only (must be persistent; Upstash incompatible at ~10 req/s polling)

### Deployment
- API: PM2 on Ubuntu VPS, port 3001
- Frontend: Vercel with automatic CI from `main` branch
- Database: Neon serverless PostgreSQL
- Redis: Docker container on VPS (`docker run -d --name coderank-redis redis:7-alpine`)

---

## Part 6 — Recording Checklist

### Environment
- [ ] Open `https://code-rank-app.vercel.app` in a clean browser window (not incognito — need localStorage for War Rooms modal)
- [ ] Clear all cookies/sessions so the demo login is clean
- [ ] Have a second incognito window ready for snippet sharing demo
- [ ] Open DevTools ready to switch to mobile viewport (iPhone 14 Pro: 390×844)
- [ ] Close all other tabs — no distracting notifications
- [ ] Set browser zoom to 100%
- [ ] Disable browser notifications

### Pre-Demo State
- [ ] Verify the API is running: check `http://161.118.182.142:3001/api/v1/health` returns `{ status: "ok" }`
- [ ] Verify the frontend loads without errors
- [ ] Have a demo email/username ready (don't register live if you can avoid it — or use a fresh throwaway)
- [ ] If re-recording: clear the `war-rooms-preview-acknowledged` localStorage key so the Coming Soon modal shows
- [ ] Have the Two Sum and Binary Search code snippets in a notepad for fast copy-paste

### Code Snippets Ready To Paste

**Python — Two Sum:**
```python
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))
```

**JavaScript — Two Sum:**
```javascript
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement), i];
        seen.set(nums[i], i);
    }
    return [];
}
console.log(twoSum([2, 7, 11, 15], 9));
```

**C++ — Two Sum:**
```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;
int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            cout << "[" << seen[comp] << ", " << i << "]" << endl;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}
```

**Python — Infinite Loop (timeout demo):**
```python
while True:
    pass
```

**Python — Binary Search (snippet save demo):**
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))
```

### Screen Recording Setup
- [ ] Screen recording software running (OBS / QuickTime / Loom)
- [ ] Mic check — audio is clear, no background noise
- [ ] Resolution: at minimum 1080p
- [ ] If recording face-in-corner: camera framed, good lighting
- [ ] Test a 30-second recording to confirm audio/video sync

### Pacing
- [ ] Speak at a normal conversational pace — not rushed, not slow
- [ ] Pause 1-2 seconds after clicking "Run" before explaining — let the network round-trip land visually
- [ ] Do not read from the script word-for-word if possible — it sounds more natural slightly paraphrased
- [ ] Sections 3-6 (execution) are the most important — give them the most time
- [ ] War Rooms section: keep under 90 seconds

---

## Part 7 — Final Closing Statement

> Use this verbatim or adapt it to your natural delivery style.

---

"What I set out to build was a platform where a developer can write code in their browser, execute it securely, and share it instantly — and that's exactly what CodeRank delivers.

The execution engine isn't a simulation. It's real code running inside real Docker containers with real security constraints. The sandbox was designed so that even if a user submits malicious code — infinite loops, fork bombs, network requests — the system handles it safely without affecting other users or the host server.

The snippet system turns CodeRank from a disposable compiler into a persistent workspace. Every snippet has a permanent URL. Anyone can run it. That's the shareability and collaboration story.

The foundation is solid. The architecture supports horizontal scaling — the BullMQ queue decouples execution load from API throughput. The database schema supports the features that are coming next.

War Rooms is the vision for where this goes — real-time competitive coding, collaborative problem solving, live leaderboards. The UI is fully designed. The backend is the next phase.

CodeRank was built end-to-end — frontend, backend, execution engine, deployment — as a solo project. I'm proud of what it does, and I'm excited about where it goes from here."

---

*End of DEMO.md*
