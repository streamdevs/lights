import { Light } from "../../entities/Light";

export interface LightService {
  turnOn(light: Light): Promise<void>;
  turnOff(light: Light): Promise<void>;
}
