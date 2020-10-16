import { Light } from "node-hue-api/lib/api/Api";

export interface LightService {
  turnOn(light: Light): Promise<void>;
  turnOff(light: Light): Promise<void>;
}
