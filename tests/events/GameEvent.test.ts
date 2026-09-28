import { describe, expect, it } from "vitest";

import { GameEvent } from "../../src/engine/events/GameEvent.js";

describe("GameEvent", () => {
    it("creates an open informational event", () => {
        const event = new GameEvent({
            id: "event-1",
            saveId: "save-1",
            date: "2026-01-01",
            category: "SYSTEM",
            title: "Season begins",
            description: "The new season is beginning.",
            requiresDecision: false,
            status: "OPEN",
        });

        expect(event.getStatus()).toBe("OPEN");
        expect(event.getResolution()).toBe(undefined);
    });

    it("resolves an informational event without a resolution payload", () => {
        const event = new GameEvent({
            id: "event-1",
            saveId: "save-1",
            date: "2026-01-01",
            category: "SYSTEM",
            title: "Season begins",
            description: "The new season is beginning.",
            requiresDecision: false,
            status: "OPEN",
        });

        event.resolve();

        expect(event.getStatus()).toBe("RESOLVED");
    });

    it("resolves a decision event with a resolution", () => {
        const event = new GameEvent({
            id: "event-1",
            saveId: "save-1",
            date: "2026-01-01",
            category: "BOARD",
            title: "Contract decision",
            description: "The board requests a decision.",
            requiresDecision: true,
            status: "OPEN",
        });

        event.resolve("APPROVED");

        expect(event.getStatus()).toBe("RESOLVED");
        expect(event.getResolution()).toBe("APPROVED");
    });

    it("does not resolve a decision event without a resolution", () => {
        const event = new GameEvent({
            id: "event-1",
            saveId: "save-1",
            date: "2026-01-01",
            category: "BOARD",
            title: "Contract decision",
            description: "The board requests a decision.",
            requiresDecision: true,
            status: "OPEN",
        });

        expect(() => {
            event.resolve();
        }).toThrow();

        expect(event.getStatus()).toBe("OPEN");
    });

    it("does not allow resolving an event twice", () => {
        const event = new GameEvent({
            id: "event-1",
            saveId: "save-1",
            date: "2026-01-01",
            category: "SYSTEM",
            title: "Season begins",
            description: "The new season is beginning.",
            requiresDecision: false,
            status: "OPEN",
        });

        event.resolve();

        expect(() => {
            event.resolve();
        }).toThrow();
    });

    it("does not allow an open event with a resolution", () => {
        expect(() => {
            new GameEvent({
                id: "event-1",
                saveId: "save-1",
                date: "2026-01-01",
                category: "BOARD",
                title: "Decision",
                description: "Description",
                requiresDecision: true,
                status: "OPEN",
                resolution: "APPROVED",
            });
        }).toThrow();
    });

    it("requires a resolution for an already resolved decision event", () => {
        expect(() => {
            new GameEvent({
                id: "event-1",
                saveId: "save-1",
                date: "2026-01-01",
                category: "BOARD",
                title: "Decision",
                description: "Description",
                requiresDecision: true,
                status: "RESOLVED",
            });
        }).toThrow();
    });

    it("converts the event back to state", () => {
        const event = new GameEvent({
            id: "event-1",
            saveId: "save-1",
            date: "2026-01-01",
            category: "BOARD",
            title: "Decision",
            description: "Description",
            requiresDecision: true,
            status: "OPEN",
        });

        event.resolve("APPROVED");

        expect(event.toState()).toEqual({
            id: "event-1",
            saveId: "save-1",
            date: "2026-01-01",
            category: "BOARD",
            title: "Decision",
            description: "Description",
            requiresDecision: true,
            status: "RESOLVED",
            resolution: "APPROVED",
        });
    });
});
