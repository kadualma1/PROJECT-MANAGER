export type SeasonStatus =
    | "SCHEDULED"
    | "ACTIVE"
    | "COMPLETED";

export interface SeasonState {
    id: string;

    competitionId: string;

    index: number;
    displayName: string;

    status: SeasonStatus;

    fixtureIds: string[];

    championTeamId?: string;
}