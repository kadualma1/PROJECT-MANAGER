import type {
    FixtureState,
    FixtureStatus,
} from "./FixtureState.js";

import type { FixtureResult } from "./FixtureResult.js";

export class Fixture {
    public readonly id: string;

    public readonly seasonId: string;

    public readonly teamAId: string;
    public readonly teamBId: string;

    public readonly scheduledDate: string;

    private status: FixtureStatus;
    private resultId?: string | undefined;

    constructor(state: FixtureState) {
        if (state.id.trim().length === 0) {
            throw new Error("Fixture id cannot be empty");
        }

        if (state.seasonId.trim().length === 0) {
            throw new Error("Fixture seasonId cannot be empty");
        }

        if (state.teamAId.trim().length === 0) {
            throw new Error("Fixture teamAId cannot be empty");
        }

        if (state.teamBId.trim().length === 0) {
            throw new Error("Fixture teamBId cannot be empty");
        }

        if (state.teamAId === state.teamBId) {
            throw new Error(
                "A fixture cannot have the same team on both sides"
            );
        }

        const scheduledTime = Date.parse(
            state.scheduledDate
        );

        if (Number.isNaN(scheduledTime)) {
            throw new Error(
                "Fixture scheduledDate must be a valid date"
            );
        }

        if (
            state.status === "COMPLETED" &&
            state.resultId === undefined
        ) {
            throw new Error(
                "A completed fixture must have a resultId"
            );
        }

        if (
            state.status !== "COMPLETED" &&
            state.resultId !== undefined
        ) {
            throw new Error(
                "A fixture cannot have a result before it is completed"
            );
        }

        this.id = state.id;

        this.seasonId = state.seasonId;

        this.teamAId = state.teamAId;
        this.teamBId = state.teamBId;

        this.scheduledDate = state.scheduledDate;

        this.status = state.status;
        this.resultId = state.resultId;
    }

    getStatus(): FixtureStatus {
        return this.status;
    }

    getResultId(): string | undefined {
        return this.resultId;
    }

    markReady(): void {
        this.transitionTo(
            "READY",
            ["SCHEDULED"]
        );
    }

    start(): void {
        this.transitionTo(
            "IN_PROGRESS",
            ["READY"]
        );
    }

    complete(result: FixtureResult): void {
        if (this.status !== "IN_PROGRESS") {
            throw new Error(
                `Cannot complete fixture ${this.id} while status is ${this.status}`
            );
        }

        if (this.resultId !== undefined) {
            throw new Error(
                `Fixture ${this.id} already has a result`
            );
        }

        this.validateResult(result);

        this.resultId = result.id;
        this.status = "COMPLETED";
    }

    toState(): FixtureState {
        return {
            id: this.id,

            seasonId: this.seasonId,

            teamAId: this.teamAId,
            teamBId: this.teamBId,

            scheduledDate: this.scheduledDate,

            status: this.status,

            ...(this.resultId !== undefined
                ? { resultId: this.resultId }
                : {}),
        };
    }

    private transitionTo(
        newStatus: FixtureStatus,
        allowedCurrentStatuses: FixtureStatus[]
    ): void {
        if (!allowedCurrentStatuses.includes(this.status)) {
            throw new Error(
                `Cannot change fixture ${this.id} from ${this.status} to ${newStatus}`
            );
        }

        this.status = newStatus;
    }

    private validateResult(
        result: FixtureResult
    ): void {
        if (result.id.trim().length === 0) {
            throw new Error(
                "Fixture result id cannot be empty"
            );
        }

        if (result.fixtureId !== this.id) {
            throw new Error(
                `Result ${result.id} belongs to another fixture`
            );
        }

        const participantIds = new Set(
            result.participantTeamIds
        );

        const hasTeamA =
            participantIds.has(this.teamAId);

        const hasTeamB =
            participantIds.has(this.teamBId);

        if (
            participantIds.size !== 2 ||
            !hasTeamA ||
            !hasTeamB
        ) {
            throw new Error(
                "Fixture result participants do not match fixture teams"
            );
        }

        if (result.isDraw) {
            if (result.winnerTeamId !== undefined) {
                throw new Error(
                    "A drawn fixture cannot have a winner"
                );
            }

            return;
        }

        if (result.winnerTeamId === undefined) {
            throw new Error(
                "A non-draw fixture must have a winner"
            );
        }

        if (
            result.winnerTeamId !== this.teamAId &&
            result.winnerTeamId !== this.teamBId
        ) {
            throw new Error(
                "Fixture winner must be one of the participating teams"
            );
        }
    }
}