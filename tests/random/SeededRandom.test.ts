import { describe, expect, it } from "vitest";
import { SeededRandom } from "../../src/engine/random/SeededRandom.js";

describe("SeededRandom", () => {
  it("produces the same sequence with the same seed", () => {
    const rngA = new SeededRandom(12345);
    const rngB = new SeededRandom(12345);

    expect(rngA.next()).toBe(rngB.next());
    expect(rngA.next()).toBe(rngB.next());
    expect(rngA.next()).toBe(rngB.next());
  });

  it("produces different sequences with different seeds", () => {
    const rngA = new SeededRandom(12345);
    const rngB = new SeededRandom(54321);

    expect(rngA.next()).not.toBe(rngB.next());
  });

  it("generates integers inside the requested range", () => {
    const rng = new SeededRandom(12345);

    for (let i = 0; i < 100; i++) {
      const value = rng.nextInt(1, 10);

      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("can restore its previous state", () => {
    const rng = new SeededRandom(12345);

    rng.next();
    rng.next();

    const savedState = rng.getState();

    const expected = rng.next();

    rng.setState(savedState);

    const restored = rng.next();

    expect(restored).toBe(expected);
  });
});