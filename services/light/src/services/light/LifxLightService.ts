import { getConfiguration } from "../../config";
import { HttpDriver } from "../../drivers/HttpDriver";
import { NodeFetchHttpDriver } from "../../drivers/NodeFetchHttpDriver";
import { Light } from "../../entities/Light";
import { LightService } from "./LightService";

interface ChangeColorOptions {
  color: string;
  duration?: number;
}

export class LifxLightService implements LightService {
  public constructor(private driver: HttpDriver = new NodeFetchHttpDriver()) {}

  public async changeColor(
    light: Light,
    options: ChangeColorOptions
  ): Promise<void> {
    const { color, duration } = options;

    await this.driver.put(`https://api.lifx.com/v1/lights/${light.id}/state`, {
      payload: {
        color,
        ...(duration && { duration }),
      },
      headers: {
        Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
      },
    });
  }

  public async turnOn(light: Light): Promise<void> {
    await this.driver.put(`https://api.lifx.com/v1/lights/${light.id}/state`, {
      payload: {
        power: "on",
        brightness: 1,
      },
      headers: {
        Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
      },
    });
  }

  public async turnOff(light: Light): Promise<void> {
    await this.driver.put(`https://api.lifx.com/v1/lights/${light.id}/state`, {
      payload: {
        power: "off",
      },
      headers: {
        Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
      },
    });
  }
}
