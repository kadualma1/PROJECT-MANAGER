import type {
    SeasonState,
    SeasonStatus,
} from "./SeasonState.js";

export class Season {
    public readonly id: string;
    public readonly competitionId: string;
    public readonly index: number;

    private readonly displayName: string;

    private status: SeasonStatus;
    private readonly fixtureIds: Set<string>;

    private championTeamId?: string | undefined;

    constructor(state: SeasonState) {
        if (state.id.trim().length === 0) {
            throw new Error("Season id cannot be empty");
        }

        if (state.competitionId.trim().length === 0) {
            throw new Error(
                "Season competitionId cannot be empty"
            );
        }

        if (
            !Number.isInteger(state.index) ||
            state.index < 1
        ) {
            throw new Error(
                "Season index must be a positive integer"
            );
        }

        if (state.displayName.trim().length === 0) {
            throw new Error(
                "Season displayName cannot be empty"
            );
        }

        for (const fixtureId of state.fixtureIds) {
            if (fixtureId.trim().length === 0) {
                throw new Error(
                    "Season fixture id cannot be empty"
                );
            }
        }

        const uniqueFixtureIds = new Set(
            state.fixtureIds
        );

        if (
            uniqueFixtureIds.size !==
            state.fixtureIds.length
        ) {
            throw new Error(
                "Season fixtureIds must be unique"
            );
        }

        if (
            state.championTeamId !== undefined &&
            state.championTeamId.trim().length === 0
        ) {
            throw new Error(
                "Season championTeamId cannot be empty"
            );
        }

        if (
            state.status === "COMPLETED" &&
            state.championTeamId === undefined
        ) {
            throw new Error(
                "A completed season must have a champion"
            );
        }

        if (
            state.status !== "COMPLETED" &&
            state.championTeamId !== undefined
        ) {
            throw new Error(
                "A season cannot have a champion before completion"
            );
        }

        this.id = state.id;

        this.competitionId = state.competitionId;
        this.index = state.index;

        this.displayName = state.displayName;

        this.status = state.status;

        this.fixtureIds = uniqueFixtureIds;

        this.championTeamId =
            state.championTeamId;
    }

    getDisplayName(): string {
        return this.displayName;
    }

    getStatus(): SeasonStatus {
        return this.status;
    }

    getFixtureIds(): string[] {
        return Array.from(this.fixtureIds);
    }

    getFixtureCount(): number {
        return this.fixtureIds.size;
    }

    hasFixture(fixtureId: string): boolean {
        return this.fixtureIds.has(fixtureId);
    }

    getChampionTeamId(): string | undefined {
        return this.championTeamId;
    }

    addFixture(fixtureId: string): void {
        if (this.status !== "SCHEDULED") {
            throw new Error(
                "Fixtures can only be added to a scheduled season"
            );
        }

        if (fixtureId.trim().length === 0) {
            throw new Error(
                "Fixture id cannot be empty"
            );
        }

        if (this.fixtureIds.has(fixtureId)) {
            throw new Error(
                `Fixture ${fixtureId} is already registered in season ${this.id}`
            );
        }

        this.fixtureIds.add(fixtureId);
    }

    start(): void {
        if (this.status !== "SCHEDULED") {
            throw new Error(
                `Cannot start season ${this.id} while status is ${this.status}`
            );
        }

        if (this.fixtureIds.size === 0) {
            throw new Error(
                "A season cannot start without fixtures"
            );
        }

        this.status = "ACTIVE";
    }

    complete(championTeamId: string): void {
        if (this.status !== "ACTIVE") {
            throw new Error(
                `Cannot complete season ${this.id} while status is ${this.status}`
            );
        }

        if (championTeamId.trim().length === 0) {
            throw new Error(
                "Champion team id cannot be empty"
            );
        }

        this.championTeamId = championTeamId;
        this.status = "COMPLETED";
    }

    toState(): SeasonState {
        return {
            id: this.id,

            competitionId: this.competitionId,

            index: this.index,
            displayName: this.displayName,

            status: this.status,

            fixtureIds: Array.from(
                this.fixtureIds
            ),

            ...(this.championTeamId !== undefined
                ? {
                    championTeamId:
                        this.championTeamId,
                }
                : {}),
        };
    }
}