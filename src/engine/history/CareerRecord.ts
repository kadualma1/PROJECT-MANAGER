export type CareerEntityType = 
    | "PERSON"
    | "TEAM"
    | "ORGANIZATION";

export interface CareerRecord {
    id: string;

    entityType: CareerEntityType;
    entityId: string;

    seasonId: string;

    games: number;
    wins: number;

    titles: number;

    summary: Record<string, number | string | boolean>;
}