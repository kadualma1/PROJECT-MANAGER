import { describe, expect, it } from "vitest";

import { Contract } from "../../src/engine/contracts/Contract.js";

describe("Contract", () => {
    it("creates a valid proposed contract", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "PROPOSED",
        });

        expect(contract.id).toBe("contract-1");
        expect(contract.personId).toBe("player-1");
        expect(contract.organizationId).toBe(
            "organization-1"
        );

        expect(contract.salary).toBe(100000);

        expect(contract.getStatus()).toBe("PROPOSED");
    });

    it("does not allow a negative salary", () => {
        expect(() => {
            new Contract({
                id: "contract-1",

                personId: "player-1",
                organizationId: "organization-1",

                startDate: "2026-01-01",
                endDate: "2027-01-01",

                salary: -1,

                status: "PROPOSED",
            });
        }).toThrow();
    });

    it("does not allow the end date to be before the start date", () => {
        expect(() => {
            new Contract({
                id: "contract-1",

                personId: "player-1",
                organizationId: "organization-1",

                startDate: "2027-01-01",
                endDate: "2026-01-01",

                salary: 100000,

                status: "PROPOSED",
            });
        }).toThrow();
    });

    it("does not allow equal start and end dates", () => {
        expect(() => {
            new Contract({
                id: "contract-1",

                personId: "player-1",
                organizationId: "organization-1",

                startDate: "2026-01-01",
                endDate: "2026-01-01",

                salary: 100000,

                status: "PROPOSED",
            });
        }).toThrow();
    });

    it("accepts a proposed contract", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "PROPOSED",
        });

        contract.accept();

        expect(contract.getStatus()).toBe("ACTIVE");
    });

    it("rejects a proposed contract", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "PROPOSED",
        });

        contract.reject();

        expect(contract.getStatus()).toBe("REJECTED");
    });

    it("marks an active contract as expiring", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "ACTIVE",
        });

        contract.markExpiring();

        expect(contract.getStatus()).toBe("EXPIRING");
    });

    it("terminates an active contract", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "ACTIVE",
        });

        contract.terminate();

        expect(contract.getStatus()).toBe(
            "TERMINATED"
        );
    });

    it("completes an expiring contract", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "EXPIRING",
        });

        contract.complete();

        expect(contract.getStatus()).toBe(
            "COMPLETED"
        );
    });

    it("does not allow rejecting an active contract", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "ACTIVE",
        });

        expect(() => {
            contract.reject();
        }).toThrow();

        expect(contract.getStatus()).toBe("ACTIVE");
    });

    it("does not allow accepting an already active contract", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "ACTIVE",
        });

        expect(() => {
            contract.accept();
        }).toThrow();

        expect(contract.getStatus()).toBe("ACTIVE");
    });

    it("does not allow completing an active contract directly", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "ACTIVE",
        });

        expect(() => {
            contract.complete();
        }).toThrow();

        expect(contract.getStatus()).toBe("ACTIVE");
    });

    it("converts the contract back to state", () => {
        const contract = new Contract({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "PROPOSED",
        });

        contract.accept();

        const state = contract.toState();

        expect(state).toEqual({
            id: "contract-1",

            personId: "player-1",
            organizationId: "organization-1",

            startDate: "2026-01-01",
            endDate: "2027-01-01",

            salary: 100000,

            status: "ACTIVE",
        });
    });
});