# CodeRank MVP Hardening & Case Study Compliance Audit

You are acting as:

- Staff Software Architect
- Senior Backend Engineer
- Security Engineer
- Technical Reviewer

Your goal is NOT to add features.

Your goal is to audit the current implementation against:

- codeRank.pdf requirements
- existing UI designs
- existing architecture
- existing codebase

Think like a reviewer evaluating whether this project is production-ready.

---

# CRITICAL RULE

Do NOT build new product features.

Do NOT redesign the UI.

Do NOT introduce unnecessary infrastructure.

Focus ONLY on:

- correctness
- security
- reliability
- maintainability
- case study compliance

---

# Audit Process

Execute the following phases sequentially.

For each phase:

1. inspect existing implementation
2. identify weaknesses
3. identify missing requirements
4. propose fixes
5. implement fixes
6. document changes

Never skip phases.

---

# PHASE 1 — Repository & Architecture Audit

Review:

- folder structure
- monorepo organization
- module boundaries
- dependency management
- code duplication
- reusable components
- shared types

Identify:

- architecture smells
- tight coupling
- poor abstractions
- unnecessary complexity

Tasks:

- improve modularity
- reduce duplication
- improve maintainability
- improve separation of concerns

Deliverable:

ARCHITECTURE_AUDIT.md

---

# PHASE 2 — API Audit

Review all APIs.

Verify:

- request validation
- response consistency
- error handling
- status codes
- versioning strategy

Identify:

- missing validation
- inconsistent responses
- missing error handling

Tasks:

- standardize API responses
- improve validation
- improve API contracts

Deliverable:

API_AUDIT.md

---

# PHASE 3 — Execution Engine Audit

Review:

- execution flow
- language runners
- Docker integration
- stdout/stderr capture

Verify:

- execution reliability
- proper cleanup
- resource handling

Check:

- orphan containers
- zombie processes
- hanging executions

Tasks:

- improve execution reliability
- improve cleanup
- improve abstraction boundaries

Deliverable:

EXECUTION_ENGINE_AUDIT.md

---

# PHASE 4 — Security Audit

This is a high-priority phase.

Review:

- code execution path
- Docker sandboxing
- filesystem access
- process spawning
- network access

Attempt to identify:

- command injection
- sandbox escapes
- unrestricted execution
- dangerous permissions

Verify:

- non-root execution
- restricted containers
- resource limits
- timeout enforcement

Tasks:

- close security vulnerabilities
- improve sandboxing
- improve execution isolation

Deliverable:

SECURITY_AUDIT.md

---

# PHASE 5 — Resource Limit Audit

Verify enforcement of:

- CPU limits
- memory limits
- execution timeout
- process limits

Test scenarios:

## Infinite Loop

```python
while True:
    pass
```

## Memory Abuse

```python
x = []

while True:
    x.append("A" * 1000000)
```

## Fork Bomb Style Behavior

Attempt process abuse.

Verify:

- process termination
- graceful failure
- user feedback

Tasks:

- strengthen resource protection

Deliverable:

RESOURCE_LIMIT_AUDIT.md

---

# PHASE 6 — Concurrency Audit

Review:

- concurrent executions
- queue handling
- race conditions
- database contention

Simulate:

- multiple users
- simultaneous execution requests

Verify:

- stability
- correctness
- cleanup

Tasks:

- improve concurrency handling

Deliverable:

CONCURRENCY_AUDIT.md

---

# PHASE 7 — Database Audit

Review:

- schema design
- indexing
- relations
- constraints

Verify:

- referential integrity
- query efficiency
- migration quality

Tasks:

- optimize schema
- add missing indexes
- improve consistency

Deliverable:

DATABASE_AUDIT.md

---

# PHASE 8 — Authentication & Authorization Audit

Review:

- authentication flow
- protected routes
- API protection

Verify:

- unauthorized access prevention
- ownership checks

Tasks:

- strengthen auth boundaries

Deliverable:

AUTH_AUDIT.md

---

# PHASE 9 — Rate Limiting & Abuse Prevention

Review:

- execution endpoints
- snippet endpoints
- authentication endpoints

Verify:

- abuse protection
- spam prevention

Implement:

- IP limits
- user limits
- execution throttling

Deliverable:

RATE_LIMIT_AUDIT.md

---

# PHASE 10 — Frontend Reliability Audit

Review:

- error states
- loading states
- retry handling
- execution feedback

Verify:

- graceful degradation
- UX consistency

Tasks:

- improve resilience
- improve user feedback

Deliverable:

FRONTEND_AUDIT.md

---

# PHASE 11 — Production Readiness Audit

Review:

- environment variables
- deployment configs
- logging
- monitoring hooks
- Docker configs

Verify:

- deployment safety
- secret management

Tasks:

- eliminate production risks

Deliverable:

PRODUCTION_READINESS_AUDIT.md

---

# PHASE 12 — Case Study Compliance Report

Compare implementation against codeRank.pdf.

Create:

CASE_STUDY_COMPLIANCE_REPORT.md

For each requirement:

- Requirement
- Implemented (Yes/No)
- Evidence
- Missing Items
- Recommended Fix

Provide a final score:

- Architecture
- Security
- Reliability
- Maintainability
- Scalability
- Requirement Compliance

Then provide:

TOP 10 ISSUES TO FIX BEFORE SUBMISSION

ordered by severity.

---

# Final Objective

Do NOT optimize for:

- Kubernetes
- microservices
- hyperscale systems

Optimize for:

- passing the case study requirements
- production-grade quality
- secure execution
- clean architecture
- maintainability
- reliability

The final output should leave no major gaps between the implementation and the requirements defined in codeRank.pdf.