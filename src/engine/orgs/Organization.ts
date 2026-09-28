import type { OrganizationState } from "./OrganizationState.js";

export class Organization {
    public readonly id: string;

    private name: string;
    private shortName: string;

    private reputation: number;
    private wealth: number;
    private infrastructure: number;

    private readonly teamIds: Set<string>;

    constructor(state: OrganizationState) {
        if (state.id.trim().length === 0) {
            throw new Error("Organization id cannot be empty");
        }

        if (state.name.trim().length === 0) {
            throw new Error("Organization name cannot be empty");
        }

        if (state.shortName.trim().length === 0) {
            throw new Error("Organization shortName cannot be empty");
        }

        Organization.validateMetric(state.reputation, "reputation");
        Organization.validateMetric(state.wealth, "wealth");
        Organization.validateMetric(state.infrastructure, "infrastructure");

        for (const teamId of state.teamIds) {
            if (teamId.trim().length === 0) {
                throw new Error("Organization team id cannot be empty");
            }
        }

        const uniqueTeamIds = new Set(state.teamIds);

        if (uniqueTeamIds.size !== state.teamIds.length) {
            throw new Error("Organization teamIds must be unique");
        }

        this.id = state.id;
        this.name = state.name;
        this.shortName = state.shortName;
        this.reputation = state.reputation;
        this.wealth = state.wealth;
        this.infrastructure = state.infrastructure;
        this.teamIds = uniqueTeamIds;
    }

    getName(): string {
        return this.name;
    }

    getShortName(): string {
        return this.shortName;
    }

    getReputation(): number {
        return this.reputation;
    }

    getWealth(): number {
        return this.wealth;
    }

    getInfrastructure(): number {
        return this.infrastructure;
    }

    getTeamIds(): string[] {
        return Array.from(this.teamIds);
    }

    hasTeam(teamId: string): boolean {
        return this.teamIds.has(teamId);
    }

    rename(newName: string, newShortName: string): void {
        if (newName.trim().length === 0) {
            throw new Error("Organization name cannot be empty");
        }

        if (newShortName.trim().length === 0) {
            throw new Error("Organization shortName cannot be empty");
        }

        this.name = newName;
        this.shortName = newShortName;
    }

    setReputation(value: number): void {
        Organization.validateMetric(value, "reputation");
        this.reputation = value;
    }

    setWealth(value: number): void {
        Organization.validateMetric(value, "wealth");
        this.wealth = value;
    }

    setInfrastructure(value: number): void {
        Organization.validateMetric(value, "infrastructure");
        this.infrastructure = value;
    }

    addTeam(teamId: string): void {
        if (teamId.trim().length === 0) {
            throw new Error("Team id cannot be empty");
        }

        if (this.teamIds.has(teamId)) {
            throw new Error(
                `Team ${teamId} already belongs to organization ${this.id}`
            );
        }

        this.teamIds.add(teamId);
    }

    removeTeam(teamId: string): void {
        if (!this.teamIds.has(teamId)) {
            throw new Error(
                `Team ${teamId} does not belong to organization ${this.id}`
            );
        }

        this.teamIds.delete(teamId);
    }

    toState(): OrganizationState {
        return {
            id: this.id,
            name: this.name,
            shortName: this.shortName,
            reputation: this.reputation,
            wealth: this.wealth,
            infrastructure: this.infrastructure,
            teamIds: Array.from(this.teamIds),
        };
    }

    private static validateMetric(value: number, fieldName: string): void {
        if (!Number.isFinite(value) || value < 0) {
            throw new Error(
                `Organization ${fieldName} must be a non-negative finite number`
            );
        }
    }
}
