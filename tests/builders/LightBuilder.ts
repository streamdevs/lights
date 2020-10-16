import { Sync } from "factory.ts";
import { random } from "faker";
import { Light } from "../../src/entities/Light";

export const LightBuilder = Sync.makeFactory<Light>({
  id: random.uuid(),
  service: random.arrayElement(["LIFX"]),
});
