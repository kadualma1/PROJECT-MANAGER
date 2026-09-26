# Architecture notes

Sports Manager Engine is a domain engine for sports management simulations. It manages shared concepts while delegating sport-specific behavior to a ruleset. It is not a graphics or physics engine.

These notes summarize the direction in the **Sports Manager Engine MVP specification v0.2** and distinguish it from the current implementation.

## Current implementation

All executable product logic currently lives under `src/engine/`. The repository contains no implemented web application or sport ruleset.

| Location | Role |
| :--- | :--- |
| `src/engine/Engine.ts` | Holds campaign state and its random generator |
| `src/engine/random/` | Seeded random numbers and generator-state restoration |
| `src/engine/teams/` | Team entity and serializable team state |
| `src/engine/contracts/` | Contract entity, serializable state, and offer model |
| `src/engine/people/` | Person identity and player-state models |
| `src/engine/orgs/` | Organization model |
| `src/engine/competition/` | Competition, season, fixture, result, and standings models |
| `src/engine/events/` | Decision/information event model |
| `src/engine/history/` | Career record model |
| `src/engine/save/` | Campaign metadata and aggregate state shape |
| `tests/` | Vitest coverage for implemented behavior |
| `examples/` | Executable domain demonstration |

## Decision: separate state from behavior

`TeamState` and `ContractState` contain plain data. `Team` and `Contract` reconstruct that data, enforce their local rules, and export a fresh state object through `toState()`.

For teams, a `Set<string>` prevents duplicate roster entries internally. Exporting arrays keeps the persistence format independent of that implementation detail. Changing an exported roster array does not change the entity.

This pattern is established for these two entities. The remaining interfaces have not yet been converted to behavioral domain objects.

## Decision: protect legal transitions

Contract status is private and changed through intent-named methods. A single internal transition guard checks the allowed source statuses before mutating state.

| Method | Allowed source | Destination |
| :--- | :--- | :--- |
| `accept()` | `PROPOSED` | `ACTIVE` |
| `reject()` | `PROPOSED` | `REJECTED` |
| `markExpiring()` | `ACTIVE` | `EXPIRING` |
| `terminate()` | `ACTIVE`, `EXPIRING` | `TERMINATED` |
| `complete()` | `EXPIRING` | `COMPLETED` |

`REJECTED`, `TERMINATED`, and `COMPLETED` have no outgoing operation. Completion currently requires the explicit expiring step. Status changes do not yet consult the campaign clock.

Local validity does not establish global validity: constructing a contract does not prove that a referenced person or organization exists, that the organization can afford it, or that another contract does not overlap. Future application/domain services will coordinate those checks.

## Decision: persist RNG position explicitly

`SeededRandom` initializes from a seed and exposes `getState()` / `setState()`. The engine restores the generator from `save.rngState` and uses `syncRandomState()` to write its current position back into the campaign state.

The intended snapshot sequence is:

1. Finish a domain operation.
2. Synchronize the RNG state.
3. Capture the campaign snapshot.
4. Persist that snapshot through a future storage adapter.

The current demo uses JSON in memory. The repository does not yet implement file/database storage, transactions, autosave, or migration. Saving a seed alone would restart the random sequence rather than resume it.

Determinism at campaign scale also depends on the same initial state, inputs, rules versions, and ordering of random calls. The current tests establish generator behavior and snapshot continuity; they do not prove an entire season is reproducible.

## Intended dependency boundary

The web application will compose the shared engine with a sport ruleset. The ruleset may depend on engine contracts; the engine must not depend on a concrete ruleset or user interface.

| Shared engine owns | MOBA ruleset will own |
| :--- | :--- |
| Persistent person and organization identity | Competitive roles and MOBA-specific attributes |
| Contract and roster relationships | Hero proficiency and lineup eligibility |
| Generic fixtures and results | Picks, bans, patches, and match resolution |
| Campaign state, chronology, and shared history | Match statistics and tactical interpretation |
| Shared event structure and seeded RNG | Sport-specific event conditions and effects |

`FixtureResult` currently models a generic result with participants, an optional winner, a draw flag, and a `rulesetResultId`. This is a data boundary only. Result application and an executable ruleset interface remain to be implemented.

## Deliberate limits and open work

- **Mutable aggregate state:** `Engine` retains the supplied state object and `getState()` returns that same reference. The engine is not yet an immutable or transactionally protected aggregate.
- **Runtime input validation:** TypeScript types disappear at runtime. Entity constructors perform selected checks, but there is no complete untrusted-save parser or runtime status-enum validator.
- **Date handling:** contract construction uses `Date.parse` and checks ordering. A strict calendar-date format and calendar-driven transitions still need a domain policy.
- **Persistence compatibility:** schema and rules version fields exist; migrations and compatibility checks do not.
- **Random API constraints:** range validation and sustained-run numeric-state robustness should be addressed before long campaign simulations.
- **No speculative plugin platform:** the first MVP commits to one MOBA ruleset. Further abstractions need evidence from actual use.

## Verification entry points

- `tests/teams/Team.test.ts`: roster operations, invariants, copies, and state export.
- `tests/contracts/Contract.test.ts`: construction, supported transitions, illegal operations, and state export.
- `tests/random/SeededRandom.test.ts`: repeatability, integer ranges, and restoration.
- `tests/engine/Engine.test.ts`: state loading, RNG synchronization, and continuity after reload.
- `examples/domain-demo.ts`: teams, contracts, and a JSON snapshot round trip in one runnable example.

Run `npm run check` and `npm run demo` from the repository root.
