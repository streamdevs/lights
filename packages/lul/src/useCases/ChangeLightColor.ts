import { string } from "@hapi/joi";
import { Light } from "../entities/Light";
import { LightService } from "../services/light/LightService";
import stc from "string-to-color";
import { LifxLightService } from "../services/light/LifxLightService";

interface PerformOptions {
  message: string;
  lights: Light[];
}

export class ChangeLightColor {
  public constructor(
    private lightService: LightService = new LifxLightService()
  ) {}

  public async perform({ message, lights }: PerformOptions) {
    const color = stc(message);

    await Promise.all(
      lights.map((light) => {
        this.lightService.changeColor(light, { color, duration: 10 });
      })
    );
  }
}
