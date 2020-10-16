import { Light } from "../entities/Light";
import { wait } from "../utils/wait";

interface LightService {
  turnOn: (light: Light) => Promise<void>;
  turnOff: (light: Light) => Promise<void>;
}

interface PerformOptions {
  lights: Light[];
}

export class TurnOffAndOnLights {
  public constructor(private lightService: LightService) {}

  public async perform({ lights }: PerformOptions) {
    await Promise.all(lights.map(this.lightService.turnOn));

    await wait(10);

    await Promise.all(lights.map(this.lightService.turnOff));
  }
}
