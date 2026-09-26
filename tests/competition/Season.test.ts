import { describe, expect, it } from "vitest";

import { Season } from "../../src/engine/competition/Season.js";

describe("Season", () => {
    it("creates a valid scheduled season", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "SCHEDULED",

            fixtureIds: [],
        });

        expect(season.id).toBe("season-1");
        expect(season.getStatus()).toBe(
            "SCHEDULED"
        );
        expect(season.getFixtureCount()).toBe(0);
    });

    it("adds a fixture to a scheduled season", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "SCHEDULED",

            fixtureIds: [],
        });

        season.addFixture("fixture-1");

        expect(
            season.hasFixture("fixture-1")
        ).toBe(true);

        expect(season.getFixtureCount()).toBe(1);
    });

    it("does not allow duplicate fixtures", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "SCHEDULED",

            fixtureIds: ["fixture-1"],
        });

        expect(() => {
            season.addFixture("fixture-1");
        }).toThrow();
    });

    it("does not start without fixtures", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "SCHEDULED",

            fixtureIds: [],
        });

        expect(() => {
            season.start();
        }).toThrow();
    });

    it("starts a scheduled season", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "SCHEDULED",

            fixtureIds: ["fixture-1"],
        });

        season.start();

        expect(season.getStatus()).toBe(
            "ACTIVE"
        );
    });

    it("does not allow adding fixtures after the season starts", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "ACTIVE",

            fixtureIds: ["fixture-1"],
        });

        expect(() => {
            season.addFixture("fixture-2");
        }).toThrow();
    });

    it("completes an active season", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "ACTIVE",

            fixtureIds: ["fixture-1"],
        });

        season.complete("team-1");

        expect(season.getStatus()).toBe(
            "COMPLETED"
        );

        expect(
            season.getChampionTeamId()
        ).toBe("team-1");
    });

    it("does not allow completing a scheduled season", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "SCHEDULED",

            fixtureIds: ["fixture-1"],
        });

        expect(() => {
            season.complete("team-1");
        }).toThrow();
    });

    it("requires a champion when completed", () => {
        expect(() => {
            new Season({
                id: "season-1",
                competitionId: "competition-1",

                index: 1,
                displayName: "Season 1",

                status: "COMPLETED",

                fixtureIds: ["fixture-1"],
            });
        }).toThrow();
    });

    it("does not allow a champion before completion", () => {
        expect(() => {
            new Season({
                id: "season-1",
                competitionId: "competition-1",

                index: 1,
                displayName: "Season 1",

                status: "ACTIVE",

                fixtureIds: ["fixture-1"],

                championTeamId: "team-1",
            });
        }).toThrow();
    });

    it("returns a copy of fixture ids", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "SCHEDULED",

            fixtureIds: ["fixture-1"],
        });

        const fixtureIds =
            season.getFixtureIds();

        fixtureIds.push("fixture-2");

        expect(
            season.hasFixture("fixture-2")
        ).toBe(false);
    });

    it("converts the season back to state", () => {
        const season = new Season({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "ACTIVE",

            fixtureIds: ["fixture-1"],
        });

        season.complete("team-1");

        expect(season.toState()).toEqual({
            id: "season-1",
            competitionId: "competition-1",

            index: 1,
            displayName: "Season 1",

            status: "COMPLETED",

            fixtureIds: ["fixture-1"],

            championTeamId: "team-1",
        });
    });
});