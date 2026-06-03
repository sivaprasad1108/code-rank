# War Rooms — Future Ideas

Ideas that are intentionally excluded from V1 scope. They are captured here so they are not lost and can be evaluated when the core feature is stable.

---

## Release Tiers

```
V1   →  Core live battle feature (currently in frontend implementation)
V2   →  Social and competitive depth
V3   →  Platform expansion and monetization
Long-term  →  Ecosystem vision
```

---

## V1 — Core Scope (Already Decided)

These are NOT future ideas. They are the committed V1 scope, listed here for contrast.

- War Rooms Discovery page
- Create Room modal (Battle / Practice mode, 2–6 players, language selection)
- Room Lobby (ready check, host controls, invite code)
- Nomination Phase (90-second window, LeetCode ID input, random option)
- Voting Phase (60-second blind vote)
- Battle Workspace (3-column layout, Monaco editor, live leaderboard, live chat)
- Battle Results (winner card, achievement cards, final rankings)
- Solution Review (read-only code, compare mode)
- Match History (filterable table)
- Spectator mode (read-only watch)

---

## V2 — Social and Competitive Depth

### Friends System
Allow users to add friends, see their online/battle status, and invite them directly to rooms from a friends panel. Notifications when a friend creates a room. This is the single most impactful retention driver after match history.

### Rematch with Carry-Forward
One-click rematch that pre-populates a new room with the same participants. Currently the UI has a Rematch button that links back to `/war-rooms` — a real rematch would re-invite all previous participants and skip directly to nomination.

### Rating and Leaderboard System
Competitive rating (Elo-like or Codeforces-style) for Battle Mode matches. Global leaderboard page. Personal rating history chart. Rating changes displayed after each match.

### Multiple Problem Sources
- **Codeforces integration**: Fetch problems by contest ID and problem index (e.g., `1234A`). Codeforces has an open API.
- **AtCoder integration**: Fetch problems from the AtCoder Problems dataset (community-maintained, good coverage).

Both should implement the `ProblemProvider` interface described in DECISIONS.md.

### Replay System
A structured event log of every submission, status change, and leaderboard update during a battle. "Replay" button on Match History rows. Replays are a step-by-step scrub through the battle timeline with a visible leaderboard evolution. This is high-effort but extremely high-value for learning.

### Advanced Spectator Features
- Spectator count displayed in the battle workspace header
- Spectator chat (separate from participant chat, labeled differently)
- "Cheer" system: spectators can send reactions that appear briefly in participant view
- Spectator leaderboard predictions ("who do you think will win?")

### Room Templates
Save a room configuration as a template (mode, difficulty, timer, languages, advanced settings). Reuse templates for recurring sessions (e.g., "Friday Code Battle" template).

### QR Code Invite
Generate a QR code for the room invite link. High value for in-person meetups and events.

### Push Notifications
"Your friend started a War Room — join now" browser push notifications. Requires notification permission consent flow and a notification service.

---

## V3 — Platform Expansion and Monetization

### Tournaments
Multi-round elimination bracket. 8 or 16 players. Automated bracket progression. Winners advance, losers are eliminated. Final round is Battle Workspace like normal. Tournament lobby with bracket visualization.

### Team Battles
2v2 or 3v3 team format. Teams share a collaborative editor (CRDT-based real-time co-editing, similar to Google Docs). One submission per team. Teams communicate via a private team chat separate from room chat. Scoring is per-team rather than per-individual.

### Seasonal Events
Monthly or quarterly themed competitions. "May Hard Mode" season. "Algorithm Week" event. Limited-time leaderboards. Seasonal badges that appear on profiles. These drive return visits and social sharing.

### Global Rankings Page
A public leaderboard of all War Rooms players ranked by rating. Filterable by time period, country, difficulty preference. This is a growth surface — users share their ranking, which drives new registrations.

### AI Battle Analysis
After a battle, an AI model analyzes all submissions and generates:
- Time complexity analysis per solution
- Approach comparison ("Player A used a hash map, Player B used brute force")
- Suggested optimizations
- "What Player A could have done differently" section
This is a premium/paid feature candidate. Uses the Anthropic API. See `claude-api` skill in the assistant config.

### Custom Problem Sets
Allow hosts to create their own problem banks with custom test cases, descriptions, and expected outputs. Problems are validated against a simple judge. Custom problems can be shared publicly or kept private. This opens War Rooms to bootcamps, coding coaches, and university courses.

### Matchmaking
Automatic room placement for solo players. "Find me a match" button on the Discovery page. Matchmaking considers: rating range, preferred difficulty, preferred languages. Places the player in an existing waiting room or creates a new one. This lowers the barrier to entry for users who do not have friends on the platform.

### Coding Streak and Daily Challenges
Daily featured War Room battle. "Battle of the Day" — same problem, all players compete in a shared daily leaderboard. Streak counter for consecutive daily battle participation. High retention mechanic.

---

## Long-Term Vision

### Voice Chat Integration
Optional WebRTC voice channel per room. Push-to-talk or always-on. Separate from text chat. High value for team battles and friend groups. Significant infrastructure addition (TURN/STUN servers, media relay).

### Live Streaming Integration
"Stream this battle" option that integrates with Twitch or YouTube Live. A dedicated stream URL that shows the battle in a viewer-friendly layout (read-only battle workspace with spectator view). Content creators on the platform can stream their battles.

### Embeddable War Room Widget
An embeddable `<iframe>` widget that conference organizers, bootcamps, and educators can embed on their own sites. Shows a live or scheduled War Room battle. Read-only spectator view. Branding opportunity.

### CodeRank as a Competition Infrastructure Provider
Long-term: allow organizations (universities, companies for hiring events, coding bootcamps) to run private War Rooms tournaments under their own branding. White-label competition infrastructure. This is the B2B monetization angle for the platform.

### Mobile App
React Native app for iOS and Android. War Rooms is the key use case — watching battles, checking leaderboards, receiving notifications that a friend started a battle. The code editor experience on mobile is secondary; the social/competitive feed is primary.

### Hiring / Assessment Integration
Allow companies to use War Rooms as a live technical interview tool. Two participants: candidate and interviewer. Interview mode: interviewer can see candidate's code in real time, leave inline comments, and score the session. GDPR-compliant recording with candidate consent. This is the highest-value monetization surface.

---

## Deferred UX Enhancements

These are quality-of-life improvements that were identified during V1 design but deferred to keep scope manageable:

- **Resizable panels** in the Battle Workspace (drag to resize the output panel height, left/right sidebar widths)
- **Dark/Light mode** — currently hardcoded dark; theming infrastructure exists via CSS variables
- **Keyboard shortcuts** — submit with Ctrl+Enter, toggle chat with a hotkey
- **Code snippet sharing from review** — "Share this solution as a Snippet" button on the Solution Review screen, integrating with the existing Snippets feature
- **Problem difficulty distribution** in Match History (pie chart of Easy/Medium/Hard breakdown)
- **Win/loss streak tracking** — consecutive wins/losses displayed on the profile
- **Chat emoji picker** — beyond the quick-reaction strip, a full emoji picker in the chat input
- **Chat @ mentions** — tag other participants in chat
- **Presence typing indicator** in chat ("priya_codes is typing…")
- **Battle soundtrack** — optional ambient focus music (user opt-in, browser Audio API)
- **Accessibility audit** — keyboard navigation through the entire battle workspace, ARIA labels on all interactive elements, screen reader support for live leaderboard updates
