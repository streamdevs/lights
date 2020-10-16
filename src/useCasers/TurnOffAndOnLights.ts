import { Light } from "../entities/Light";
import { LightService } from "../services/light/LightService";
import { wait } from "../utils/wait";

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
