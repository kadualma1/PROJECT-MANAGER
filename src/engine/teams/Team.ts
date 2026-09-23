import type { TeamState } from "./TeamState.js";

export class Team {
    public readonly id: string;

    private name: string;
    private readonly playerIds: Set<string>;

    constructor(state: TeamState) {
        if (state.id.trim().length === 0) {
            throw new Error("Team id cannot be empty");
        }
        if (state.name.trim().length === 0) {
            throw new Error("Team name cannot be empty");
        }

        for (const playerId of state.playerIds) {
            if (playerId.trim().length === 0) {
                throw new Error("Player id cannot be empty");
            }
        }

        const uniquePlayerIds = new Set(state.playerIds);

        if (uniquePlayerIds.size !== state.playerIds.length) {
            throw new Error("Team playerIds must be unique");
        }

        this.id = state.id;
        this.name = state.name;
        this.playerIds = uniquePlayerIds;
    }

    getName(): string {
        return this.name;
    }

    rename(newName: string): void {
        if (newName.trim().length === 0) {
            throw new Error("Team name cannot be empty");
        }
        this.name = newName;
    }

    getPlayerIds(): string[] {
        return Array.from(this.playerIds);
    }

    getPlayerCount(): number {
        return this.playerIds.size;
    }

    hasPlayer(playerId: string): boolean {
        return this.playerIds.has(playerId);
    }

    addPlayer(playerId: string): void {
        if (playerId.trim().length === 0) {
            throw new Error("Player id cannot be empty");
        }

        if (this.playerIds.has(playerId)) {
            throw new Error(
                `Player with id ${playerId} is already in the team ${this.id}!`
            );
        }

        this.playerIds.add(playerId);
    }

    removePlayer(playerId: string): void {
        if (!this.playerIds.has(playerId)) {
            throw new Error(`Player with id ${playerId} is not in the team ${this.id}!`);
        }
        this.playerIds.delete(playerId);
    }

    toState(): TeamState {
        return {
            id: this.id,
            name: this.name,
            playerIds: Array.from(this.playerIds),
        };
    }
}