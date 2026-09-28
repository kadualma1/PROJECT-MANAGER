import { describe, expect, it } from "vitest";

import { Fixture } from "../../src/engine/competition/Fixture.js";

describe("Fixture", () => {
    it("creates a valid scheduled fixture", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "SCHEDULED",
        });

        expect(fixture.id).toBe("fixture-1");
        expect(fixture.getStatus()).toBe(
            "SCHEDULED"
        );

        expect(fixture.getResultId()).toBe(
            undefined
        );
    });

    it("does not allow the same team on both sides", () => {
        expect(() => {
            new Fixture({
                id: "fixture-1",
                seasonId: "season-1",

                teamAId: "team-1",
                teamBId: "team-1",

                scheduledDate: "2026-01-10",

                status: "SCHEDULED",
            });
        }).toThrow();
    });

    it("does not allow an invalid scheduled date", () => {
        expect(() => {
            new Fixture({
                id: "fixture-1",
                seasonId: "season-1",

                teamAId: "team-1",
                teamBId: "team-2",

                scheduledDate: "not-a-date",

                status: "SCHEDULED",
            });
        }).toThrow();
    });

    it("moves from scheduled to ready", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "SCHEDULED",
        });

        fixture.markReady();

        expect(fixture.getStatus()).toBe(
            "READY"
        );
    });

    it("moves from ready to in progress", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "READY",
        });

        fixture.start();

        expect(fixture.getStatus()).toBe(
            "IN_PROGRESS"
        );
    });

    it("does not allow starting a scheduled fixture directly", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "SCHEDULED",
        });

        expect(() => {
            fixture.start();
        }).toThrow();

        expect(fixture.getStatus()).toBe(
            "SCHEDULED"
        );
    });

    it("completes an in-progress fixture with a valid result", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "IN_PROGRESS",
        });

        fixture.complete({
            id: "result-1",

            fixtureId: "fixture-1",

            winnerTeamId: "team-1",
            isDraw: false,

            participantTeamIds: [
                "team-1",
                "team-2",
            ],

            rulesetResultId: "moba-result-1",
        });

        expect(fixture.getStatus()).toBe(
            "COMPLETED"
        );

        expect(fixture.getResultId()).toBe(
            "result-1"
        );
    });

    it("does not allow completing a fixture with a result from another fixture", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "IN_PROGRESS",
        });

        expect(() => {
            fixture.complete({
                id: "result-1",

                fixtureId: "fixture-999",

                winnerTeamId: "team-1",
                isDraw: false,

                participantTeamIds: [
                    "team-1",
                    "team-2",
                ],

                rulesetResultId:
                    "moba-result-1",
            });
        }).toThrow();

        expect(fixture.getStatus()).toBe(
            "IN_PROGRESS"
        );
    });

    it("does not allow a winner outside the fixture", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "IN_PROGRESS",
        });

        expect(() => {
            fixture.complete({
                id: "result-1",

                fixtureId: "fixture-1",

                winnerTeamId: "team-999",
                isDraw: false,

                participantTeamIds: [
                    "team-1",
                    "team-2",
                ],

                rulesetResultId:
                    "moba-result-1",
            });
        }).toThrow();
    });

    it("allows a draw without a winner", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "IN_PROGRESS",
        });

        fixture.complete({
            id: "result-1",

            fixtureId: "fixture-1",

            isDraw: true,

            participantTeamIds: [
                "team-1",
                "team-2",
            ],

            rulesetResultId: "ruleset-result-1",
        });

        expect(fixture.getStatus()).toBe(
            "COMPLETED"
        );
    });

    it("does not allow a draw to have a winner", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "IN_PROGRESS",
        });

        expect(() => {
            fixture.complete({
                id: "result-1",

                fixtureId: "fixture-1",

                winnerTeamId: "team-1",
                isDraw: true,

                participantTeamIds: [
                    "team-1",
                    "team-2",
                ],

                rulesetResultId:
                    "ruleset-result-1",
            });
        }).toThrow();
    });

    it("does not allow a completed fixture without a result", () => {
        expect(() => {
            new Fixture({
                id: "fixture-1",
                seasonId: "season-1",

                teamAId: "team-1",
                teamBId: "team-2",

                scheduledDate: "2026-01-10",

                status: "COMPLETED",
            });
        }).toThrow();
    });

    it("does not allow a result before completion", () => {
        expect(() => {
            new Fixture({
                id: "fixture-1",
                seasonId: "season-1",

                teamAId: "team-1",
                teamBId: "team-2",

                scheduledDate: "2026-01-10",

                status: "SCHEDULED",

                resultId: "result-1",
            });
        }).toThrow();
    });

    it("converts the fixture back to state", () => {
        const fixture = new Fixture({
            id: "fixture-1",
            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "SCHEDULED",
        });

        fixture.markReady();
        fixture.start();

        const state = fixture.toState();

        expect(state).toEqual({
            id: "fixture-1",

            seasonId: "season-1",

            teamAId: "team-1",
            teamBId: "team-2",

            scheduledDate: "2026-01-10",

            status: "IN_PROGRESS",

            resultId: undefined,
        });
    });
});