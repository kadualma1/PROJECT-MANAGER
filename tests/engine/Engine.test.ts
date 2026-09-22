import { describe, expect, it } from "vitest";

import { Engine } from "../../src/engine/Engine.js";
import type { EngineState } from "../../src/engine/save/EngineState.js";

function createInitialState(): EngineState {
  return {
    save: {
      id: "save-1",
      name: "Test Save",

      seed: 12345,
      rngState: 12345,

      schemaVersion: "0.1",
      rulesVersion: "0.1",

      rulesetId: "test",

      currentDate: "2026-01-01",

      status: "ACTIVE",
    },

    people: [],
    playerStates: [],

    teams: [],
    organizations: [],

    contracts: [],
    contractOffers: [],

    competitions: [],
    seasons: [],
    fixtures: [],
    fixtureResults: [],

    events: [],
    careerRecords: [],
  };
}

describe("Engine", () => {
  it("loads the provided state", () => {
    const state = createInitialState();

    const engine = new Engine(state);

    expect(engine.getState()).toBe(state);
  });

  it("uses the saved RNG state", () => {
    const stateA = createInitialState();
    const stateB = createInitialState();

    const engineA = new Engine(stateA);
    const engineB = new Engine(stateB);

    expect(engineA.getRandom().next()).toBe(
      engineB.getRandom().next()
    );
  });

  it("synchronizes the RNG state with the save", () => {
    const state = createInitialState();

    const engine = new Engine(state);

    engine.getRandom().next();
    engine.getRandom().next();

    engine.syncRandomState();

    expect(state.save.rngState).toBe(
      engine.getRandom().getState()
    );
  });

  it("continues the same random sequence after reload", () => {
    const state = createInitialState();

    const engineA = new Engine(state);

    engineA.getRandom().next();
    engineA.getRandom().next();

    engineA.syncRandomState();

    const savedState = structuredClone(engineA.getState());

    const expectedNextValue = engineA.getRandom().next();

    const engineB = new Engine(savedState);

    const loadedNextValue = engineB.getRandom().next();

    expect(loadedNextValue).toBe(expectedNextValue);
  });
});