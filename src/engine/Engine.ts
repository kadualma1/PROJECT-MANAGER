import { SeededRandom } from "./random/SeededRandom.js";
import type { EngineState } from "./save/EngineState.js";

export class Engine {
  private state: EngineState;
  private rng: SeededRandom;

  constructor(state: EngineState) {
    this.state = state;

    this.rng = new SeededRandom(state.save.seed);
    this.rng.setState(state.save.rngState);
  }

  getState(): EngineState {
    return this.state;
  }

  getRandom(): SeededRandom {
    return this.rng;
  }

  syncRandomState(): void {
    this.state.save.rngState = this.rng.getState();
  }
}