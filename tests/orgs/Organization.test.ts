import { describe, expect, it } from "vitest";

import { Organization } from "../../src/engine/orgs/Organization.js";

describe("Organization", () => {
    it("creates a valid organization", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: [],
            });

        expect(organization.id).toBe(
            "organization-1"
        );

        expect(
            organization.getName()
        ).toBe("Red Wolves");
    });

    it("does not allow negative metrics", () => {
        expect(() => {
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: -1,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: [],
            });
        }).toThrow();
    });

    it("adds a team", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: [],
            });

        organization.addTeam("team-1");

        expect(
            organization.hasTeam("team-1")
        ).toBe(true);
    });

    it("does not allow duplicate teams", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: ["team-1"],
            });

        expect(() => {
            organization.addTeam("team-1");
        }).toThrow();
    });

    it("removes a team", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: ["team-1"],
            });

        organization.removeTeam("team-1");

        expect(
            organization.hasTeam("team-1")
        ).toBe(false);
    });

    it("renames the organization", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: [],
            });

        organization.rename(
            "Iron Wolves",
            "IW"
        );

        expect(
            organization.getName()
        ).toBe("Iron Wolves");

        expect(
            organization.getShortName()
        ).toBe("IW");
    });

    it("updates organization metrics", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: [],
            });

        organization.setReputation(70);
        organization.setWealth(2000000);
        organization.setInfrastructure(60);

        expect(
            organization.getReputation()
        ).toBe(70);

        expect(
            organization.getWealth()
        ).toBe(2000000);

        expect(
            organization.getInfrastructure()
        ).toBe(60);
    });

    it("returns a copy of team ids", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: ["team-1"],
            });

        const teamIds =
            organization.getTeamIds();

        teamIds.push("team-2");

        expect(
            organization.hasTeam("team-2")
        ).toBe(false);
    });

    it("converts the organization back to state", () => {
        const organization =
            new Organization({
                id: "organization-1",

                name: "Red Wolves",
                shortName: "RW",

                reputation: 50,
                wealth: 1000000,
                infrastructure: 40,

                teamIds: ["team-1"],
            });

        expect(
            organization.toState()
        ).toEqual({
            id: "organization-1",

            name: "Red Wolves",
            shortName: "RW",

            reputation: 50,
            wealth: 1000000,
            infrastructure: 40,

            teamIds: ["team-1"],
        });
    });
});