import { Engine } from "../src/engine/Engine.js";
import { Team } from "../src/engine/teams/Team.js";
import { Contract } from "../src/engine/contracts/Contract.js";
import type { EngineState } from "../src/engine/save/EngineState.js";

console.log("Sports Manager Engine | domain demo");

const team = new Team({
  id: "team-aurora",
  name: "Aurora",
  playerIds: ["player-1"],
});
team.addPlayer("player-2");
console.log(`Team: ${team.getName()} | ${team.getPlayerCount()} players`);

let duplicateRejected = false;
try {
  team.addPlayer("player-2");
} catch {
  duplicateRejected = true;
}
if (!duplicateRejected || team.getPlayerCount() !== 2) {
  throw new Error("Duplicate player was not rejected without changing the roster");
}
console.log("Duplicate roster entry: rejected");

const contract = new Contract({
  id: "contract-1",
  personId: "player-1",
  organizationId: "org-aurora",
  startDate: "2026-01-01",
  endDate: "2027-01-01",
  salary: 10000,
  status: "PROPOSED",
});
const statuses = [contract.getStatus()];
contract.accept();
statuses.push(contract.getStatus());
contract.markExpiring();
statuses.push(contract.getStatus());
contract.complete();
statuses.push(contract.getStatus());
console.log(`Contract: ${statuses.join(" -> ")}`);

// A minimal RNG demonstration, not a generated or playable campaign.
// Team/contract examples above are independent of this empty campaign state.
const initialState: EngineState = {
  save: {
    id: "demo-save",
    name: "RNG continuity demo",
    seed: 12345,
    rngState: 12345,
    schemaVersion: "0.1",
    rulesVersion: "0.1",
    rulesetId: "demo",
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

const engine = new Engine(initialState);
engine.getRandom().next();
engine.getRandom().next();
engine.syncRandomState();

// This is an in-memory round trip. Production save loading will need
// runtime validation before data can be trusted as EngineState.
const serialized = JSON.stringify(engine.getState());
const snapshot = JSON.parse(serialized) as EngineState;
const expected = engine.getRandom().next();
const restored = new Engine(snapshot);
const matches = restored.getRandom().next() === expected;

if (!matches) {
  throw new Error("The restored random sequence diverged");
}
console.log("JSON snapshot: restored");
console.log(`Next random value matches after reload: ${matches}`);
