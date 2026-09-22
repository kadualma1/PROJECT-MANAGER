export type SeasonStatus = 
    | "SCHEDULED"
    | "ACTIVE"
    | "COMPLETED";

export interface Season {
    id: string;

    competitionId: string;

    index: number;
    displayName: string;

    status: SeasonStatus;

    fixtureIds: string[];

    championTeamId?: string;
}