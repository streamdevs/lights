import { Light } from "../../entities/Light";

export interface LightService {
  turnOn(light: Light): Promise<void>;
  turnOff(light: Light): Promise<void>;
  changeColor(light: Light, options: any): Promise<void>;
  disco(
    light: Light,
    options: {
      color: string;
      cycles: number;
      period: number;
      initialColor?: string;
    }
  ): Promise<void>;
}
