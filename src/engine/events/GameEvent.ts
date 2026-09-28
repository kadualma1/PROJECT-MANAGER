import type {
    GameEventState,
    GameEventStatus,
} from "./GameEventState.js";

export class GameEvent {
    public readonly id: string;
    public readonly saveId: string;
    public readonly date: string;
    public readonly category: string;
    public readonly title: string;
    public readonly description: string;
    public readonly requiresDecision: boolean;

    private status: GameEventStatus;
    private resolution?: string | undefined;

    constructor(state: GameEventState) {
        if (state.id.trim().length === 0) {
            throw new Error("GameEvent id cannot be empty");
        }

        if (state.saveId.trim().length === 0) {
            throw new Error("GameEvent saveId cannot be empty");
        }

        if (Number.isNaN(Date.parse(state.date))) {
            throw new Error("GameEvent date must be valid");
        }

        if (state.category.trim().length === 0) {
            throw new Error("GameEvent category cannot be empty");
        }

        if (state.title.trim().length === 0) {
            throw new Error("GameEvent title cannot be empty");
        }

        if (
            state.resolution !== undefined &&
            state.resolution.trim().length === 0
        ) {
            throw new Error("GameEvent resolution cannot be empty");
        }

        if (state.status === "OPEN" && state.resolution !== undefined) {
            throw new Error("An open event cannot have a resolution");
        }

        if (
            state.status === "RESOLVED" &&
            state.requiresDecision &&
            state.resolution === undefined
        ) {
            throw new Error(
                "A resolved decision event must have a resolution"
            );
        }

        this.id = state.id;
        this.saveId = state.saveId;
        this.date = state.date;
        this.category = state.category;
        this.title = state.title;
        this.description = state.description;
        this.requiresDecision = state.requiresDecision;
        this.status = state.status;
        this.resolution = state.resolution;
    }

    getStatus(): GameEventStatus {
        return this.status;
    }

    getResolution(): string | undefined {
        return this.resolution;
    }

    resolve(resolution?: string): void {
        if (this.status !== "OPEN") {
            throw new Error(`GameEvent ${this.id} is already resolved`);
        }

        if (
            resolution !== undefined &&
            resolution.trim().length === 0
        ) {
            throw new Error("GameEvent resolution cannot be empty");
        }

        if (this.requiresDecision && resolution === undefined) {
            throw new Error("This event requires a resolution");
        }

        if (resolution !== undefined) {
            this.resolution = resolution;
        }

        this.status = "RESOLVED";
    }

    toState(): GameEventState {
        return {
            id: this.id,
            saveId: this.saveId,
            date: this.date,
            category: this.category,
            title: this.title,
            description: this.description,
            requiresDecision: this.requiresDecision,
            status: this.status,
            ...(this.resolution !== undefined
                ? { resolution: this.resolution }
                : {}),
        };
    }
}
