# Roadmap

The goal is a complete single-player MOBA management season backed by a reusable sports management engine. This is a milestone sequence, not a release-date commitment.

## 1. Domain foundation | In progress

Already implemented:

- [x] Strict TypeScript project with Vitest tests.
- [x] Seeded RNG with state capture and restoration.
- [x] Engine initialization and explicit RNG synchronization.
- [x] Team entity, roster invariants, and plain-state export.
- [x] Contract entity, local validation, lifecycle guards, and plain-state export.
- [x] Initial shared domain data models.

Next:

- [ ] Fixture entity with validated result attachment and terminal completion.
- [ ] Season lifecycle and competition consistency.
- [ ] Organization behavior and financial constraints.
- [ ] Event resolution with guarded state changes.

**Acceptance:** each entity protects its local invariants and round-trips through plain state; failed operations leave it unchanged.

## 2. Coordinated engine services | Planned

- [ ] Validate person/organization references and conflicting contracts.
- [ ] Enforce roster eligibility through actual contract relationships.
- [ ] Apply fixture results to competition state and history exactly once.
- [ ] Advance the campaign calendar through valid checkpoints.

**Acceptance:** a small headless competition can progress without duplicate results, contradictory relationships, or skipped mandatory decisions.

## 3. Persistence and reproducibility | Planned

- [ ] Validate external save data at runtime.
- [ ] Implement a storage adapter and atomic save writes.
- [ ] Enforce schema/rules compatibility and define migration behavior.
- [ ] Support autosave and recovery from failed writes.
- [ ] Verify seeded replay across multi-step campaign operations.

**Acceptance:** a saved campaign resumes with the same domain state and random sequence; incompatible or malformed saves fail explicitly.

## 4. First sport ruleset: MOBA | Planned

- [ ] Define the executable boundary between engine and ruleset.
- [ ] Add player attributes, hero catalog, proficiency, and patch state.
- [ ] Implement scouting, training, contextual draft, and opponent decisions.
- [ ] Produce simulated match results, timelines, and post-match reports.

**Acceptance:** the ruleset can resolve a fixture and return a generic result without introducing MOBA imports into the shared engine.

## 5. Playable reference application | Planned

- [ ] Add roster, calendar, inbox, draft, and reporting screens.
- [ ] Deliver an eight-team league, playoffs, and offseason.
- [ ] Introduce institutional pressure and campaign-ending dismissal.
- [ ] Validate a complete playable season through the browser.

**Acceptance:** a user can create, save, resume, and finish a campaign with consistent history and explainable outcomes.

## Outside the first MVP

A second playable sport, a public plugin API, multiplayer, real-time graphics/physics, real-world teams or athletes, and a complete mobile experience are not current delivery commitments.
