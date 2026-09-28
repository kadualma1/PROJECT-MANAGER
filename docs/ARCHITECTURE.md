# Architecture notes

Sports Manager Engine is a headless TypeScript domain engine for sports-management simulations. Shared management concepts live in the engine; sport-specific behavior belongs to a ruleset. It is not a graphics or physics engine.

These notes describe the implementation at the end of **M0 — Engine Foundation**.

## Current implementation

| Location | Role |
| :--- | :--- |
| `src/engine/Engine.ts` | Validates aggregate campaign state and restores/synchronizes deterministic RNG state |
| `src/engine/validation/` | Cross-entity integrity checks for the aggregate state |
| `src/engine/random/` | Seeded pseudo-random numbers and state restoration |
| `src/engine/teams/` | Team entity and serializable state |
| `src/engine/contracts/` | Contract entity/state plus the still-data-only offer model |
| `src/engine/people/` | Generic person identity and player-state data |
| `src/engine/orgs/` | Organization entity and serializable state |
| `src/engine/competition/` | Competition data plus fixture/season behavioral entities and generic fixture results |
| `src/engine/events/` | Game-event entity and serializable state |
| `src/engine/history/` | Career record data |
| `src/engine/save/` | Save metadata and aggregate `EngineState` shape |
| `tests/` | Domain and aggregate-integrity tests |

No web application or sport-specific ruleset is implemented in M0.

## State and behavior are separate

Behavioral entities use two representations:

- `*State` interfaces contain plain serializable data.
- Classes reconstruct that state, protect invariants, expose intent-named operations, and return fresh plain data with `toState()`.

This pattern currently applies to `Team`, `Contract`, `Fixture`, `Season`, `Organization`, and `GameEvent`.

The boundary is deliberate. A persistence adapter should store state, not private class implementation details such as `Set<string>` collections.

## Local invariants vs aggregate invariants

An entity protects rules it can decide using only its own state. Examples:

- `Team` prevents empty and duplicate player IDs.
- `Contract` validates dates/salary and legal lifecycle transitions.
- `Fixture` validates its two sides and the generic result attached to it.
- `Season` protects fixture registration and champion/lifecycle state.
- `Organization` protects identity, metrics, and local team ownership collection.
- `GameEvent` protects open/resolved decision semantics.

Rules that require several entities belong outside a single entity. `EngineStateValidator` currently verifies, among other things:

- globally unique IDs inside each collection;
- referenced people, teams, organizations, competitions, seasons, fixtures, and results exist;
- a team is not owned by two organizations;
- competition participants exist and are unique;
- fixtures are registered by their season and use competition participants;
- completed fixture/result links are mutually consistent;
- a completed season only contains completed fixtures and has a valid participant as champion;
- events belong to the current save;
- overlapping `ACTIVE`/`EXPIRING` contracts for one person are rejected.

The validator runs when `Engine` is constructed. `Engine.validateState()` can be called again after external code has directly manipulated the mutable aggregate.

## Lifecycle decisions

### Contract

| Operation | Allowed source | Destination |
| :--- | :--- | :--- |
| `accept()` | `PROPOSED` | `ACTIVE` |
| `reject()` | `PROPOSED` | `REJECTED` |
| `markExpiring()` | `ACTIVE` | `EXPIRING` |
| `terminate()` | `ACTIVE`, `EXPIRING` | `TERMINATED` |
| `complete()` | `EXPIRING` | `COMPLETED` |

### Fixture

`SCHEDULED -> READY -> IN_PROGRESS -> COMPLETED`. Completion requires a valid generic `FixtureResult` whose fixture, participants, winner/draw state, and result ID are coherent.

### Season

`SCHEDULED -> ACTIVE -> COMPLETED`. Fixtures can only be added while scheduled; a season cannot start empty; completion records a champion. Aggregate validation supplies the cross-entity checks that the `Season` class cannot perform by itself.

### GameEvent

`OPEN -> RESOLVED`. Decision-required events need a non-empty resolution; informational events may resolve without one.

## Generic fixture result boundary

The shared engine does not calculate goals, kills, rounds, heroes, maps, draft choices, or other sport-specific details.

A future ruleset will produce its own detailed result and provide the engine a generic `FixtureResult` containing:

- fixture ID;
- participating team IDs;
- winner or draw state;
- `rulesetResultId`, which points back to the sport-specific detailed result.

This lets MOBA, football, or another future ruleset integrate without moving sport-specific data into the shared engine.

## Deterministic randomness

`SeededRandom` stores a canonical unsigned 32-bit state. `next()` advances and mixes that state deterministically. `Engine.syncRandomState()` copies the generator position back into the save before serialization.

A deterministic campaign requires more than the same initial seed: initial state, decisions, rules versions, and random-call ordering must also match.

## Dependency direction

The intended direction remains:

```text
application / UI
      ↓
sport ruleset
      ↓
shared engine
```

The engine must not import MOBA roles, heroes, drafts, patches, or React components. M1 will be the first implementation that actively tests this boundary.

## Deliberate M0 limits

- `EngineState` is still mutable and `getState()` returns the live object. M0 validates the aggregate but does not provide transactions or immutable commands.
- TypeScript interfaces are not runtime parsers. Loading arbitrary JSON safely will require a dedicated persistence/input validation boundary.
- `Competition`, `ContractOffer`, `Person`, `PlayerState`, and `CareerRecord` remain plain data contracts because M0 does not yet need richer behavior from them.
- Date handling currently relies on `Date.parse`; strict calendar/date policies belong to a later milestone.
- Database storage, migrations, autosave, services for applying results/standings, and sport-specific simulation are not part of M0.

## Verification

Run from the repository root:

```bash
npm run check
npm run demo
```

The tests cover deterministic RNG behavior, local entity invariants, lifecycle transitions, serialization boundaries, and cross-entity aggregate integrity.
