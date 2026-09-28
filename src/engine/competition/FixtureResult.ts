export interface FixtureResult {
    id: string;
    fixtureId: string;
    winnerTeamId?: string;
    isDraw: boolean;
    participantTeamIds: string[];
    rulesetResultId: string;
}
