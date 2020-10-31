import { Light } from "../../entities/Light";
import { LifxLightService } from "../../services/light/LifxLightService";
import { LightService } from "../../services/light/LightService";
import { wait } from "../../utils/wait";

interface PerformOptions {
  lights: Light[];
}

export class TurnOffAndOnLights {
  public constructor(
    private lightService: LightService = new LifxLightService()
  ) {}

  public async perform({ lights }: PerformOptions) {
    await Promise.all(lights.map((light) => this.lightService.turnOff(light)));

    await wait(10);

    await Promise.all(lights.map((light) => this.lightService.turnOn(light)));
  }
}
