import type { Person } from "../people/Person.js";
import type { PlayerState } from "../people/PlayerState.js";
import type { TeamState } from "../teams/TeamState.js";
import type { Organization } from "../orgs/Organization.js";
import type { ContractState } from "../contracts/ContractState.js";
import type { ContractOffer } from "../contracts/ContractOffer.js";
import type { Competition } from "../competition/Competition.js";
import type { Season } from "../competition/Season.js";
import type { Fixture } from "../competition/Fixture.js";
import type { FixtureResult } from "../competition/FixtureResult.js";
import type { GameEvent } from "../events/GameEvent.js";
import type { CareerRecord } from "../history/CareerRecord.js";
import type { SaveGame } from "./SaveGame.js";

export interface EngineState {
  save: SaveGame;

  people: Person[];
  playerStates: PlayerState[];

  teams: TeamState[];
  organizations: Organization[];

  contracts: ContractState[];
  contractOffers: ContractOffer[];

  competitions: Competition[];
  seasons: Season[];
  fixtures: Fixture[];
  fixtureResults: FixtureResult[];

  events: GameEvent[];
  careerRecords: CareerRecord[];
}