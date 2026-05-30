# CLAUDE WAR ROOMS DESIGN PROMPT

You are a Senior Staff Product Designer and Frontend Architect.

Study the attached CodeRank UI screenshots carefully.

The screenshots are the source of truth.

DO NOT redesign the application.

DO NOT introduce a new design language.

DO NOT introduce Discord styling.

DO NOT introduce gaming/esports styling.

DO NOT introduce bright colors.

Your goal is to create a new feature called **War Rooms** that looks like it was built by the same designer who created the existing CodeRank Playground and Snippets pages.

The final result should feel native to CodeRank.

---

# PRODUCT CONTEXT

CodeRank is not merely a coding challenge website.

CodeRank is an engineering platform centered around:

- Multi-language code execution
- Online compiler functionality
- Docker sandbox execution
- Secure runtime isolation
- Execution APIs
- Snippet sharing
- Resource management
- Runtime monitoring
- Concurrent code execution
- Performance measurement
- Developer collaboration

War Rooms should feel like a natural evolution of the platform and not a disconnected feature.

The feature should visually communicate:

- engineering
- competition
- collaboration
- problem solving
- real-time interaction

without looking like a gaming platform.

The original backend vision includes support for:

- Python
- Java
- JavaScript
- C++
- Containerized execution
- Resource allocation
- Timeout handling
- Runtime error handling
- Concurrency handling
- Authentication
- Rate limiting
- Secure execution environments

Use these concepts to influence UI details where appropriate. :contentReference[oaicite:0]{index=0}

---

# EXISTING CODERANK DESIGN SYSTEM

Maintain exactly:

- dark premium theme
- deep navy background
- purple accent color
- subtle purple glow
- glassmorphism cards
- soft borders
- premium shadows
- same typography hierarchy
- same spacing scale
- same border radius
- same button language
- same card language
- same editor appearance
- same output panel styling
- same navigation styling
- same interaction patterns

Everything should feel like it already exists in the product.

Reuse components aggressively.

---

# NAVIGATION

Add:

Playground

Snippets

War Rooms (NEW)

Docs

Pricing

War Rooms should appear beside Snippets.

Use the exact NEW badge styling already used elsewhere.

No experimental navigation.

No sidebar redesign.

---

# WAR ROOMS INFORMATION ARCHITECTURE

Create the following screens.

1. War Rooms Discovery
2. Create Room
3. Room Lobby
4. Nomination Phase
5. Voting Phase
6. Battle Workspace
7. Battle Results
8. Solution Review
9. Match History

Each screen must be high-fidelity.

No wireframes.

No placeholders.

No generic dashboard templates.

---

# SCREEN 1 — WAR ROOMS DISCOVERY

Purpose:

Allow developers to discover and join active coding battles.

---

## Hero Section

Large heading:

War Rooms

Subtitle:

Live collaborative coding battles.

Primary CTA:

Create Room

Secondary CTA:

Join Room

---

## Live Platform Metrics

Display four premium stat cards.

Active Rooms

Players Online

Battles Today

Average Battle Duration

Use existing metric card styling.

Add subtle live indicators.

---

## Featured Rooms

Premium card grid.

Each card contains:

- Room Name
- Room ID
- Host Name
- Difficulty
- Current Players
- Maximum Players
- Duration
- Status
- Join Button

Statuses:

- Waiting
- Starting
- Live Battle

Use elegant status pills.

---

## Public Rooms Table

Full-width table.

Columns:

- Room
- Host
- Players
- Difficulty
- Mode
- Status
- Join

Above table:

Search Room ID

Filters:

- Difficulty
- Mode
- Status

---

## Spectator Section

Display active battles.

Cards show:

- Problem Difficulty
- Participants
- Elapsed Time
- Watch Battle CTA

Spectator Mode should feel premium.

---

# SCREEN 2 — CREATE ROOM MODAL

Premium modal.

Glassmorphism.

Large width.

---

## Room Details

Fields:

Room Name

Description

Mode

Options:

- Practice
- Battle

Difficulty

Options:

- Easy
- Medium
- Hard
- Mixed

Timer

Options:

- 15 min
- 30 min
- 45 min
- 60 min

Visibility

Options:

- Public
- Private

Maximum Players

Range:

2–6

---

## Advanced Settings

Allow:

Enable Spectators

Enable Chat

Allow Rematch

Enable Solution Sharing

Lock Language Selection

---

## Language Selection

Allow multiple languages.

Example:

- Python
- Java
- JavaScript
- C++
- Go
- Rust

---

## CTA

Create Room

---

# SCREEN 3 — ROOM LOBBY

Pre-match waiting area.

Layout:

LEFT PANEL

CENTER PANEL

RIGHT PANEL

---

## LEFT PANEL

Participants

Each participant card contains:

- Avatar
- Username
- Rank
- Ready Status
- Host Badge

Statuses:

- Ready
- Not Ready

---

## CENTER PANEL

Room Information

Display:

Room Name

Room ID

Invite Code

Mode

Difficulty

Timer

Player Count

Created Time

Copy Invite Link

Share Button

---

## RIGHT PANEL

Activity Feed

Real-time updates:

User Joined

User Left

User Ready

Room Created

Host Changed

Match Started

---

## Host Controls

Visible only to host.

Actions:

Start Match

Kick User

Transfer Host

Lock Room

Mute Chat

Disable Spectators

Adjust Timer

---

# SCREEN 4 — NOMINATION PHASE

After match starts.

Countdown visible.

20 seconds.

Large timer component.

---

## Problem Nomination

Each player may nominate a LeetCode problem.

Input:

Problem ID

Example:

38

When entered:

Automatically generate preview card.

---

## Preview Card

Display:

Problem Name

Difficulty

Acceptance Rate

Tags

Estimated Solve Time

---

## Random Problem Option

Special card.

Displays:

Random Problem

Surprise Challenge

Generate Random Pick

Use unique visual treatment.

---

## Nominations Panel

Display all submitted nominations.

Show participant who nominated each problem.

---

# SCREEN 5 — VOTING PHASE

After nomination ends.

---

## Voting Countdown

Voting Ends In:

20s

Prominent placement.

---

## Problem Cards

Each card displays:

Problem Name

Problem ID

Difficulty

Tags

Acceptance Rate

---

## Voting Rules

Important:

DO NOT show vote count.

DO NOT show leading candidate.

Maintain suspense.

Only reveal selected card state.

---

## Visual Behavior

Selected card:

- Purple border
- Purple glow
- Elevated shadow

Hover:

- Smooth animation
- Card lift effect

---

# SCREEN 6 — BATTLE WORKSPACE

This is the flagship screen.

It should be the most visually impressive page in CodeRank.

Layout:

LEFT SIDEBAR

CENTER WORKSPACE

RIGHT SIDEBAR

BOTTOM PANEL

---

# LEFT SIDEBAR

Participants

Each participant displays:

Avatar

Username

Current Rank

Current Status

---

## Status Indicators

Thinking

Running

Wrong Answer

Time Limit Exceeded

Runtime Error

Accepted

Disconnected

---

## Mini Leaderboard

Show:

Rank

Player

Points

Attempts

Submission Time

---

# CENTER WORKSPACE

Reuse Playground architecture.

Do NOT redesign editor.

---

## Top Area

Problem Statement

Sections:

Description

Examples

Constraints

Hints

Tags

Difficulty Badge

---

## Middle Area

Monaco Editor

Use existing CodeRank editor.

Maintain:

- theme
- spacing
- controls
- toolbar

---

## Editor Controls

Language Selector

Font Size

Theme

Reset Code

Format Code

---

## Bottom Controls

Run Code

Submit

Custom Input

Save Draft

---

# RIGHT SIDEBAR

## Live Leaderboard

Columns:

Rank

Player

Score

Accepted

Attempts

Submission Time

Runtime

Memory

---

## Live Chat

Messages

System Events

User Messages

Submission Updates

Examples:

Priya solved the problem.

John submitted solution.

Alex received Wrong Answer.

---

## Quick Reactions

Emoji reactions:

🔥

⚡

🚀

👏

💯

Use compact styling.

---

# BOTTOM PANEL

Reuse Playground output architecture.

Tabs:

Output

Test Cases

Submissions

Logs

Execution Details

Performance

---

## Output Tab

Runtime output.

---

## Test Cases Tab

Visible test cases.

---

## Submissions Tab

Submission history.

---

## Logs Tab

Execution logs.

---

## Performance Tab

Display:

Runtime

Memory Usage

Language

Submission Timestamp

Execution Duration

---

# LIVE BATTLE FEATURES

Add naturally into the UI.

---

## Submission Timeline

Chronological timeline.

Examples:

12:31 PM

Priya Submitted

12:32 PM

Wrong Answer

12:35 PM

Accepted

---

## Real-Time Updates

Live indicators.

Animated status changes.

Non-intrusive notifications.

---

## Runtime Monitoring

Display:

Execution Time

Memory Consumption

Container Status

Queue Status

Inspired by CodeRank execution engine.

---

# SCORING SYSTEM

Leaderboard should support:

Accepted Status

Runtime

Memory

Submission Time

Attempts

Bonus Points

First Solve Bonus

Fastest Runtime Bonus

Fewest Attempts Bonus

---

# SCREEN 7 — BATTLE RESULTS

Shown when battle ends.

---

## Hero Section

Battle Complete

Large celebration card.

Display:

Winner Avatar

Winner Name

Winner Score

Completion Time

---

## Results Overview

Cards:

Fastest Solver

Best Runtime

Fewest Attempts

Most Efficient Submission

Highest Accuracy

---

## Final Rankings

Columns:

Rank

Player

Score

Accepted

Attempts

Runtime

Memory

Time

---

## Actions

Rematch

Review Solutions

Return To Rooms

Share Results

---

# SCREEN 8 — SOLUTION REVIEW

Accessible after battle completion.

---

## Layout

LEFT

Player List

CENTER

Code Viewer

RIGHT

Performance Metrics

---

## Player List

All participants.

Click to switch solution.

---

## Code Viewer

Syntax highlighted.

Read-only.

Monaco Viewer.

---

## Metrics Panel

Display:

Runtime

Memory

Language

Submission Time

Attempts

Status

---

## Compare Mode

Allow side-by-side comparison.

Compare:

Player A

vs

Player B

---

## Timeline

Submission progression.

Show:

Attempt 1

Attempt 2

Accepted

---

# SCREEN 9 — MATCH HISTORY

User profile section.

---

## History Table

Columns:

Date

Problem

Difficulty

Winner

Players

Duration

Result

Mode

---

## Filters

Date Range

Difficulty

Mode

Result

---

## Battle Replay

Click row.

Open replay.

Replay includes:

Timeline

Leaderboard Evolution

Submission Events

Final Ranking

---

# ADDITIONAL PREMIUM FEATURES

Integrate naturally.

---

## Spectator Mode

Read-only access.

Watch active battles.

Observe leaderboard changes.

Observe submissions.

Observe chat.

---

## Room Sharing

Copy Invite Link

Copy Room ID

Share Button

QR Invite Option

---

## Rematch System

One-click rematch.

Carry forward participants.

---

## Host Controls

Lock Room

Mute Chat

Disable Spectators

Adjust Timer

Restrict Languages

Remove User

Transfer Host

---

## Presence Indicators

Show:

Online

Typing

Coding

Running

Away

Disconnected

---

## Achievement Moments

First Accepted

Fastest Runtime

Clutch Finish

Perfect Score

Use subtle celebration animations.

---

# ANIMATION GUIDELINES

Use:

- subtle motion
- premium transitions
- smooth card hover states
- elegant glow effects
- leaderboard transitions
- countdown animations

Avoid:

- flashy gaming effects
- neon overload
- excessive particles
- esports visuals

---

# RESPONSIVE REQUIREMENTS

Design:

Desktop First

Large Screens

1440p

Ultra-wide Monitors

Then gracefully adapt to:

Tablet

Laptop

Mobile

without changing the overall architecture.

---

# FINAL DESIGN REQUIREMENTS

The generated UI must look:

- Production Ready
- Enterprise Grade
- Premium SaaS
- Investor Demo Ready
- Dribbble Quality
- Senior Product Designer Quality

The user should instantly believe that War Rooms was part of CodeRank from day one.

The feature must feel like the most advanced and most exciting capability inside the entire CodeRank ecosystem.