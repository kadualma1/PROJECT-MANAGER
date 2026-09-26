export type FixtureStatus =
    | "SCHEDULED"
    | "READY"
    | "IN_PROGRESS"
    | "COMPLETED";

export interface FixtureState {
    id: string;

    seasonId: string;

    teamAId: string;
    teamBId: string;

    scheduledDate: string;

    status: FixtureStatus;

    resultId?: string;
}