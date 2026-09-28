import { SeededRandom } from "./random/SeededRandom.js";
import type { EngineState } from "./save/EngineState.js";
import { validateEngineState } from "./validation/EngineStateValidator.js";

export class Engine {
  private state: EngineState;
  private rng: SeededRandom;

  constructor(state: EngineState) {
    validateEngineState(state);

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

  validateState(): void {
    validateEngineState(this.state);
  }

  syncRandomState(): void {
    this.state.save.rngState = this.rng.getState();
  }
}
