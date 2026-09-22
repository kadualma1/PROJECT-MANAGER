export interface Organization {
    id: string;
    fullName: string;
    shortName: string;

    reputation: number;
    wealth: number;
    infraestructure: number;

    teamIds: string[];
}