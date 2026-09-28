import { describe, expect, it } from "vitest";

import type { EngineState } from "../../src/engine/save/EngineState.js";
import { validateEngineState } from "../../src/engine/validation/EngineStateValidator.js";

function createValidState(): EngineState {
    return {
        save: {
            id: "save-1",
            name: "Test Save",
            seed: 12345,
            rngState: 12345,
            schemaVersion: "0.1",
            rulesVersion: "0.1",
            rulesetId: "test",
            currentDate: "2026-01-01",
            status: "ACTIVE",
        },

        people: [
            { id: "player-1", displayName: "Player One" },
            { id: "player-2", displayName: "Player Two" },
        ],

        playerStates: [
            {
                personId: "player-1",
                morale: 50,
                fatigue: 0,
                confidence: 50,
            },
            {
                personId: "player-2",
                morale: 50,
                fatigue: 0,
                confidence: 50,
            },
        ],

        teams: [
            {
                id: "team-1",
                name: "Red Wolves",
                playerIds: ["player-1"],
            },
            {
                id: "team-2",
                name: "Blue Hawks",
                playerIds: ["player-2"],
            },
        ],

        organizations: [
            {
                id: "organization-1",
                name: "Red Organization",
                shortName: "RED",
                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,
                teamIds: ["team-1"],
            },
            {
                id: "organization-2",
                name: "Blue Organization",
                shortName: "BLU",
                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,
                teamIds: ["team-2"],
            },
        ],

        contracts: [
            {
                id: "contract-1",
                personId: "player-1",
                organizationId: "organization-1",
                startDate: "2026-01-01",
                endDate: "2027-01-01",
                salary: 100000,
                status: "ACTIVE",
            },
        ],

        contractOffers: [],

        competitions: [
            {
                id: "competition-1",
                name: "Test League",
                participantTeamIds: ["team-1", "team-2"],
            },
        ],

        seasons: [
            {
                id: "season-1",
                competitionId: "competition-1",
                index: 1,
                displayName: "Season 1",
                status: "ACTIVE",
                fixtureIds: ["fixture-1"],
            },
        ],

        fixtures: [
            {
                id: "fixture-1",
                seasonId: "season-1",
                teamAId: "team-1",
                teamBId: "team-2",
                scheduledDate: "2026-01-10",
                status: "COMPLETED",
                resultId: "result-1",
            },
        ],

        fixtureResults: [
            {
                id: "result-1",
                fixtureId: "fixture-1",
                winnerTeamId: "team-1",
                isDraw: false,
                participantTeamIds: ["team-1", "team-2"],
                rulesetResultId: "ruleset-result-1",
            },
        ],

        events: [
            {
                id: "event-1",
                saveId: "save-1",
                date: "2026-01-01",
                category: "SYSTEM",
                title: "Test event",
                description: "A valid event.",
                requiresDecision: false,
                status: "OPEN",
            },
        ],

        careerRecords: [],
    };
}

describe("EngineStateValidator", () => {
    it("accepts a valid engine state", () => {
        expect(() => {
            validateEngineState(createValidState());
        }).not.toThrow();
    });

    it("rejects duplicate entity ids", () => {
        const state = createValidState();
        state.people.push({ id: "player-1", displayName: "Duplicate" });

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects a team with an unknown player", () => {
        const state = createValidState();
        state.teams[0]?.playerIds.push("unknown-player");

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects a team owned by multiple organizations", () => {
        const state = createValidState();
        state.organizations[1]?.teamIds.push("team-1");

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects a contract with an unknown person", () => {
        const state = createValidState();
        const contract = state.contracts[0];

        if (contract === undefined) {
            throw new Error("Missing test contract");
        }

        contract.personId = "unknown-player";

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects overlapping active contracts", () => {
        const state = createValidState();

        state.contracts.push({
            id: "contract-2",
            personId: "player-1",
            organizationId: "organization-2",
            startDate: "2026-06-01",
            endDate: "2027-06-01",
            salary: 200000,
            status: "ACTIVE",
        });

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects a season with an unknown fixture", () => {
        const state = createValidState();
        const season = state.seasons[0];

        if (season === undefined) {
            throw new Error("Missing test season");
        }

        season.fixtureIds.push("unknown-fixture");

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects a fixture not listed by its season", () => {
        const state = createValidState();
        const season = state.seasons[0];

        if (season === undefined) {
            throw new Error("Missing test season");
        }

        season.fixtureIds = [];

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects an event from another save", () => {
        const state = createValidState();
        const event = state.events[0];

        if (event === undefined) {
            throw new Error("Missing test event");
        }

        event.saveId = "save-999";

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });

    it("rejects a completed fixture whose result does not exist", () => {
        const state = createValidState();
        state.fixtureResults = [];

        expect(() => {
            validateEngineState(state);
        }).toThrow();
    });
});
