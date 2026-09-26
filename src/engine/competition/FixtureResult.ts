export interface FixtureResult {
    id: string;

    fixtureId: string | undefined;

    winnerTeamId?: string;

    isDraw: boolean;

    participantTeamIds: string[];

    rulesetResultId: string;
}