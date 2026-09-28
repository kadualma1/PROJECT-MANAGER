export interface OrganizationState {
    id: string;
    name: string;
    shortName: string;

    reputation: number;
    wealth: number;
    infrastructure: number;

    teamIds: string[];
}
