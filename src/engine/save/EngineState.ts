import type { Person } from "../people/Person";
import type { PlayerState } from "../people/PlayerState";
import type { Team } from "../teams/Team";
import type { Organization } from "../organizations/Organization";
import type { Contract } from "../contracts/Contract";
import type { ContractOffer } from "../market/ContractOffer";
import type { Competition } from "../competition/Competition";
import type { Season } from "../competition/Season";
import type { Fixture } from "../competition/Fixture";
import type { FixtureResult } from "../competition/FixtureResult";
import type { GameEvent } from "../events/GameEvent";
import type { CareerRecord } from "../history/CareerRecord";
import type { SaveGame } from "./SaveGame";

export interface EngineState {
  save: SaveGame;

  people: Person[];
  playerStates: PlayerState[];

  teams: Team[];
  organizations: Organization[];

  contracts: Contract[];
  contractOffers: ContractOffer[];

  competitions: Competition[];
  seasons: Season[];
  fixtures: Fixture[];
  fixtureResults: FixtureResult[];

  events: GameEvent[];
  careerRecords: CareerRecord[];
}