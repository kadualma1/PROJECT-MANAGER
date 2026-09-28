export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    if (!Number.isInteger(seed)) {
      throw new Error("Seed must be an integer");
    }

    this.state = seed >>> 0;
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;

    let value = this.state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error("nextInt bounds must be integers");
    }

    if (max < min) {
      throw new Error("nextInt max must be greater than or equal to min");
    }

    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  getState(): number {
    return this.state;
  }

  setState(state: number): void {
    if (!Number.isInteger(state) || state < 0 || state > 0xffffffff) {
      throw new Error("RNG state must be an unsigned 32-bit integer");
    }

    this.state = state >>> 0;
  }
}
