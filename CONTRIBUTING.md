# Contributing

The project is in active foundation development. Focused bug reports, domain-model feedback, and small improvements are welcome.

For a larger feature or new abstraction, open an issue first with the use case and the problem it solves. The first MVP targets one MOBA ruleset; additional sports and a public plugin platform are outside its scope.

## Local workflow

1. Use Node.js 24 and install dependencies with `npm ci`.
2. Keep shared engine code independent of UI frameworks and MOBA-specific concepts.
3. Add or update behavioral tests when changing a domain rule.
4. Run `npm run check` and `npm run demo`.
5. Explain the problem, the changed behavior, and the verification in your pull request.

Use English for code identifiers, documentation, issues, and pull requests. Prefer small changes with clear ownership of state and explicit failure behavior.

Do not introduce nondeterministic randomness into persistent simulation behavior. Use the engine's seeded generator and preserve its state at snapshot boundaries.
