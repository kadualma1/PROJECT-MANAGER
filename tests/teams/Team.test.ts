import { describe, it, expect } from "vitest";
import { Team } from "../../src/engine/teams/Team.js";

describe("Team", () => {
    it("creates a valid team", () => {
        const team = new Team({
            id: "team1",
            name: "Red Wolves",
            playerIds: [],
        });
        expect(team.id).toBe("team1");
        expect(team.getName()).toBe("Red Wolves");
        expect(team.getPlayerCount()).toBe(0);
    });

    it("adds a player", () => {
        const team = new Team({
            id: "team1",
            name: "Red Wolves",
            playerIds: [],
        });

        team.addPlayer("player1");
        expect(team.getPlayerCount()).toBe(1);
        expect(team.hasPlayer("player1")).toBe(true);
    })

    it("does not allow duplicate players", () => {
        const team = new Team({
            id: "team1",
            name: "Red Wolves",
            playerIds: ["player1"],
        });

        expect(() => {
            team.addPlayer("player1");
        }).toThrow();
    })

    it("removes a player", () => {
        const team = new Team({
            id: "team1",
            name: "Red Wolves",
            playerIds: ["player1"],
        });
        team.removePlayer("player1");
        expect(team.getPlayerCount()).toBe(0);
        expect(team.hasPlayer("player1")).toBe(false);
    })

    it("does not allow removing a player that is not in the team", () => {
        const team = new Team({
            id: "team1",
            name: "Red Wolves",
            playerIds: [],
        });
        expect(() => {
            team.removePlayer("player1");
        }).toThrow();
    })

    it("does not allow duplicate players in the initial state", () => {
        expect(() => {
            new Team({
                id: "team-1",
                name: "Red Wolves",
                playerIds: ["player-1", "player-1"],
            });
        }).toThrow();
    });

    it("does not allow an empty id", () => {
        expect(() => {
            new Team({
                id: "   ",
                name: "Red Wolves",
                playerIds: [],
            });
        }).toThrow();
    });

    it("does not allow an empty name", () => {
        expect(() => {
            new Team({
                id: "team-1",
                name: "   ",
                playerIds: [],
            });
        }).toThrow();
    });

    it("does not allow an empty player id", () => {
        const team = new Team({
            id: "team-1",
            name: "Red Wolves",
            playerIds: [],
        });

        expect(() => {
            team.addPlayer("   ");
        }).toThrow();
    });

    it("returns a copy of the player ids", () => {
        const team = new Team({
            id: "team-1",
            name: "Red Wolves",
            playerIds: ["player-1"],
        });

        const playerIds = team.getPlayerIds();

        playerIds.push("player-2");

        expect(team.hasPlayer("player-2")).toBe(false);
        expect(team.getPlayerCount()).toBe(1);
    });

    it("converts the entity back to state", () => {
        const team = new Team({
            id: "team-1",
            name: "Red Wolves",
            playerIds: ["player-1"],
        });

        team.addPlayer("player-2");
        team.rename("Iron Wolves");

        const state = team.toState();

        expect(state).toEqual({
            id: "team-1",
            name: "Iron Wolves",
            playerIds: ["player-1", "player-2"],
        });
    });
});