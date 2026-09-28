# Roadmap

The goal is a complete single-player MOBA management season backed by a reusable sports management engine. Milestones describe implementation order, not release dates.

## M0 — Engine foundation | Complete

Implemented:

- [x] Strict TypeScript project and automated domain tests.
- [x] Seeded RNG with state capture, restoration, bounded integers, and input validation.
- [x] Serializable aggregate state with explicit schema/rules versions.
- [x] Team entity with roster invariants and plain-state export.
- [x] Contract entity with local validation and guarded lifecycle transitions.
- [x] Fixture entity with result validation and terminal completion.
- [x] Season entity with fixture registration and lifecycle guards.
- [x] Organization entity with identity, metrics, team ownership, and plain-state export.
- [x] GameEvent entity with guarded decision resolution.
- [x] Cross-entity EngineState validation for references, unique IDs, competition membership, fixture/result consistency, event/save ownership, and overlapping active contracts.
- [x] Engine initialization validates the aggregate before restoring RNG state.

**M0 acceptance:** the shared engine can represent and validate a coherent headless campaign foundation without importing a sport-specific ruleset or UI.

## M1 — MOBA ruleset foundation | Next

- [ ] Define MOBA roles and player-specific competitive attributes.
- [ ] Add MOBA player profiles without contaminating generic Person/Team models.
- [ ] Add hero catalog and player-hero mastery.
- [ ] Define MOBA lineup/input/result boundaries.
- [ ] Preserve one-way dependency: `games/moba -> engine`.

**Acceptance:** a valid MOBA roster and lineup can be represented entirely through a ruleset that depends on, but is not imported by, the shared engine.

## M2 — MOBA match simulation | Planned

- [ ] Implement deterministic match resolution from seed + state + decisions.
- [ ] Model early, mid, and late phases.
- [ ] Produce a MOBA-specific result and map it to generic `FixtureResult`.
- [ ] Add explainable player/team performance outputs and timeline events.

**Acceptance:** identical inputs and RNG state reproduce the same match result; the shared engine only receives the generic result boundary.

## M3 — Competition services | Planned

- [ ] Generate and validate schedules.
- [ ] Apply fixture results exactly once.
- [ ] Calculate standings and tiebreaks.
- [ ] Advance season phases and determine a champion through competition rules.

**Acceptance:** a small headless league can progress from schedule creation to completion without contradictory state.

## M4 — Persistence and reproducibility | Planned

- [ ] Add PostgreSQL and a typed persistence layer.
- [ ] Validate external save payloads before they become `EngineState`.
- [ ] Enforce schema/rules compatibility and define migration behavior.
- [ ] Add atomic save operations, autosave, and recovery policy.
- [ ] Add multi-step seeded regression fixtures.

**Acceptance:** a saved campaign resumes with the same validated domain state and random sequence.

## M5+ — Management systems and playable application | Planned

- [ ] Market and negotiation services.
- [ ] Training, scouting, patch/meta, and contextual draft.
- [ ] Opponent AI under imperfect information.
- [ ] Application/API layer.
- [ ] React/Next.js development UI, then player-facing UI and styling.
- [ ] Complete eight-team league, playoffs, offseason, history, and campaign-ending conditions.

## Outside the first MVP

A second playable sport, a public plugin API, multiplayer, real-time graphics/physics, real-world teams or athletes, and a complete mobile experience are not current delivery commitments.
