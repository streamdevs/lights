import { getConfiguration } from "../../config";
import { HttpDriver } from "../../drivers/HttpDriver";
import { NodeFetchHttpDriver } from "../../drivers/NodeFetchHttpDriver";
import { LightService } from "./LightService";

export class LifxLightService implements LightService {
  public constructor(private driver: HttpDriver = new NodeFetchHttpDriver()) {}

  public async turnOn(light: any): Promise<void> {
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

  public async turnOff(light: any): Promise<void> {
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
