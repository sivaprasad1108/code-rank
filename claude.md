You are a Staff+ Software Architect and Product Engineer.

I am building a product called “CodeRank”.

Before writing ANY code, I want you to deeply analyze the project context, UI direction, product scope, and technical requirements from the files inside this repository.

IMPORTANT:
Do NOT immediately generate implementation code.
First understand the product completely and create a detailed engineering execution plan.

---

# Repository Context

Inside this repository:

- `/UI-figma`
  Contains all UI mockups and product designs.

- `codeRank.pdf`
  Contains the official backend case study and technical requirements.

You MUST carefully review:
1. all UI images
2. layout patterns
3. product flows
4. design consistency
5. backend requirements from the PDF

---

# VERY IMPORTANT PRODUCT SCOPE

CodeRank is:

- an online compiler
- a cloud code execution platform
- a snippet sharing platform

CodeRank is NOT:

- LeetCode
- HackerRank
- competitive programming platform
- contest platform
- judge engine

DO NOT include:
- accepted/wrong-answer systems
- rankings
- DSA problem sets
- test-case judging
- leaderboards

The product ONLY focuses on:
- writing code
- running code
- viewing output
- saving snippets
- sharing snippets

---

# Product Goals

The platform should feel:

- premium
- developer-first
- modern
- minimal
- fast
- cinematic
- production-grade

Inspired by:
- Vercel
- Linear
- Raycast
- GitHub
- VSCode
- Replit

---

# Design System

The attached UI designs are the source of truth.

The design language includes:
- dark mode
- purple neon accents
- glassmorphism
- cinematic glow
- spacious layouts
- premium typography
- modern IDE aesthetic

You MUST analyze:
- spacing system
- layout hierarchy
- component patterns
- interaction patterns
- responsive behavior
- mobile UX direction

---

# What I Want From You

I want you to behave like the founding engineer planning a real startup MVP.

Create a COMPLETE execution plan for building this project from scratch.

DO NOT write implementation code yet.

---

# Your Tasks

## 1. Product Understanding

First explain:
- what the product is
- target users
- core workflows
- scope boundaries
- MVP scope
- future scope

---

## 2. UI/UX Analysis

Analyze the provided UI mockups.

Explain:
- design system
- reusable components
- layout structure
- page hierarchy
- responsive strategy
- frontend complexity areas

Identify:
- shared components
- reusable layouts
- editor architecture
- mobile-specific UX challenges

---

## 3. Architecture Planning

Design a practical MVP architecture.

Recommend:
- frontend stack
- backend stack
- database
- Docker strategy
- monorepo structure
- folder organization
- shared packages
- execution engine structure

IMPORTANT:
Keep architecture practical and MVP-focused.

Avoid:
- overengineering
- microservices
- Kubernetes
- unnecessary distributed systems

---

## 4. Backend Planning

Analyze the backend requirements from coderank.pdf.

Explain:
- execution flow
- queueing strategy
- Docker isolation
- security requirements
- timeout handling
- memory limits
- concurrency handling
- API design
- snippet storage
- authentication

---

## 5. Security Planning

Explain:
- sandboxing strategy
- container isolation
- preventing malicious execution
- rate limiting
- filesystem restrictions
- network restrictions
- non-root execution

---

## 6. Database Design

Design:
- entities
- relationships
- schema structure

Include:
- users
- snippets
- executions
- comments
- execution history

---

## 7. API Planning

Design:
- REST endpoints
- request/response structure
- API versioning
- execution APIs
- snippet APIs
- auth APIs

---

## 8. Development Roadmap

Create a realistic phased roadmap.

Example:
- Phase 1 → Monorepo setup
- Phase 2 → Frontend foundation
- Phase 3 → Playground UI
- Phase 4 → Execution engine
- etc.

For EACH phase include:
- goals
- deliverables
- dependencies
- risks
- estimated complexity

---

## 9. Folder Structure

Propose a complete production-style folder structure.

---

## 10. Engineering Decisions

For every major decision:
- explain WHY
- explain tradeoffs
- explain alternatives

---

# Constraints

IMPORTANT:

Keep this as a REALISTIC startup MVP.

Optimize for:
- development speed
- maintainability
- clean architecture
- developer experience
- production-style quality

NOT for:
- hyperscale distributed systems
- FAANG complexity
- unnecessary infrastructure

---

# Expected Output

I expect:

- highly detailed planning
- engineering reasoning
- architecture diagrams (ASCII acceptable)
- folder structures
- phased roadmap
- backend flow explanations
- security analysis
- UI system analysis

DO NOT generate implementation code unless explicitly asked later.

Your job right now is ONLY:
- understand
- analyze
- plan
- architect
- organize