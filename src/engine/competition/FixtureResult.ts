export interface FixtureResult {
    id: string;

    fixtureId: string;

    winnerTeamId?: string;

    isDraw: boolean;

    participantTeamsIds: string[];

    rulesetResultId: string;
}