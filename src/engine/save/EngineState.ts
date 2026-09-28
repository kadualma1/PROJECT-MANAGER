import type { Person } from "../people/Person.js";
import type { PlayerState } from "../people/PlayerState.js";
import type { TeamState } from "../teams/TeamState.js";
import type { OrganizationState } from "../orgs/OrganizationState.js";
import type { ContractState } from "../contracts/ContractState.js";
import type { ContractOffer } from "../contracts/ContractOffer.js";
import type { Competition } from "../competition/Competition.js";
import type { SeasonState } from "../competition/SeasonState.js";
import type { FixtureState } from "../competition/FixtureState.js";
import type { FixtureResult } from "../competition/FixtureResult.js";
import type { GameEventState } from "../events/GameEventState.js";
import type { CareerRecord } from "../history/CareerRecord.js";
import type { SaveGame } from "./SaveGame.js";

export interface EngineState {
  save: SaveGame;

  people: Person[];
  playerStates: PlayerState[];

  teams: TeamState[];
  organizations: OrganizationState[];

  contracts: ContractState[];
  contractOffers: ContractOffer[];

  competitions: Competition[];
  seasons: SeasonState[];
  fixtures: FixtureState[];
  fixtureResults: FixtureResult[];

  events: GameEventState[];
  careerRecords: CareerRecord[];
}
