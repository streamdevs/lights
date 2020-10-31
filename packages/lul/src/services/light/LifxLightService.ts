import { getConfiguration } from "../../config";
import { DriverFactory, HttpDriver } from "../../drivers";
import { Light } from "../../entities/Light";
import { wait } from "../../utils/wait";
import { LightService } from "./LightService";

interface ChangeColorOptions {
  color: string;
  duration?: number;
}

interface DiscoOptions {
  color: string;
  cycles: number;
  period: number;
  initialColor?: string;
}

export class LifxLightService implements LightService {
  public constructor(
    private driver: HttpDriver = DriverFactory.buildHttpDriver()
  ) {}

  public async disco(light: Light, options: DiscoOptions): Promise<void> {
    const { color, cycles, period, initialColor } = options;

    await this.driver.post(
      `https://api.lifx.com/v1/lights/id:${light.id}/effects/breathe`,
      {
        payload: {
          color,
          cycles,
          period,
          ...(initialColor && { from_color: initialColor }),
        },
        headers: {
          Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
        },
      }
    );
  }

  public async changeColor(
    light: Light,
    options: ChangeColorOptions
  ): Promise<void> {
    const { color, duration } = options;

    await this.callLifx(light, { color });

    if (duration) {
      await wait(duration);
      await this.callLifx(light, {
        color: {
          hue: 312.8027,
          saturation: 0,
          kelvin: 3720,
        },
      });
    }
  }

  public async turnOn(light: Light): Promise<void> {
    await this.callLifx(light, {
      power: "on",
      brightness: 1,
    });
  }

  public async turnOff(light: Light): Promise<void> {
    await this.callLifx(light, {
      power: "off",
    });
  }

  private async callLifx(light: Light, payload: any) {
    await this.driver.put(`https://api.lifx.com/v1/lights/${light.id}/state`, {
      payload,
      headers: {
        Authorization: `Bearer ${getConfiguration().lifx.accessToken}`,
      },
    });
  }
}
