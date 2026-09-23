import type {
    ContractState,
    ContractStatus,
} from "./ContractState.js";

export class Contract {
    public readonly id: string;

    public readonly personId: string;
    public readonly organizationId: string;

    public readonly startDate: string;
    public readonly endDate: string;

    public readonly salary: number;

    private status: ContractStatus;

    constructor(state: ContractState) {
        if (state.id.trim().length === 0) {
            throw new Error("Contract id cannot be empty");
        }

        if (state.personId.trim().length === 0) {
            throw new Error("Contract personId cannot be empty");
        }

        if (state.organizationId.trim().length === 0) {
            throw new Error("Contract organizationId cannot be empty");
        }

        if (!Number.isFinite(state.salary) || state.salary < 0) {
            throw new Error(
                "Contract salary must be a non-negative finite number"
            );
        }

        const startTime = Date.parse(state.startDate);
        const endTime = Date.parse(state.endDate);

        if (Number.isNaN(startTime)) {
            throw new Error("Contract startDate must be a valid date");
        }

        if (Number.isNaN(endTime)) {
            throw new Error("Contract endDate must be a valid date");
        }

        if (endTime <= startTime) {
            throw new Error(
                "Contract endDate must be later than startDate"
            );
        }

        this.id = state.id;

        this.personId = state.personId;
        this.organizationId = state.organizationId;

        this.startDate = state.startDate;
        this.endDate = state.endDate;

        this.salary = state.salary;

        this.status = state.status;
    }

    getStatus(): ContractStatus {
        return this.status;
    }

    accept(): void {
        this.transitionTo(
            "ACTIVE",
            ["PROPOSED"]
        );
    }

    reject(): void {
        this.transitionTo(
            "REJECTED",
            ["PROPOSED"]
        );
    }

    markExpiring(): void {
        this.transitionTo(
            "EXPIRING",
            ["ACTIVE"]
        );
    }

    terminate(): void {
        this.transitionTo(
            "TERMINATED",
            ["ACTIVE", "EXPIRING"]
        );
    }

    complete(): void {
        this.transitionTo(
            "COMPLETED",
            ["EXPIRING"]
        );
    }

    toState(): ContractState {
        return {
            id: this.id,

            personId: this.personId,
            organizationId: this.organizationId,

            startDate: this.startDate,
            endDate: this.endDate,

            salary: this.salary,

            status: this.status,
        };
    }

    private transitionTo(
        newStatus: ContractStatus,
        allowedCurrentStatuses: ContractStatus[]
    ): void {
        if (!allowedCurrentStatuses.includes(this.status)) {
            throw new Error(
                `Cannot change contract ${this.id} from ${this.status} to ${newStatus}`
            );
        }

        this.status = newStatus;
    }
}