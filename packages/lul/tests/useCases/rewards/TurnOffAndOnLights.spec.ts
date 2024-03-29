import { Light } from "../../../src/entities/Light";
import { FakeLightService } from "../../../src/services/light/FakeLightService";
import { TurnOffAndOnLights } from "../../../src/useCases/rewards/TurnOffAndOnLights";
import { wait } from "../../../src/utils/wait";

jest.mock("../../../src/utils/wait", () => ({
  wait: jest.fn(() => Promise.resolve()),
}));

describe("TurnOffAndOnLights", () => {
  describe("#perform", () => {
    it("turn off the lights, waits 10 seconds and turns all the lights on again", async () => {
      const light: Light = { service: "LIFX", id: "blablabla" };
      const lightService = new FakeLightService();

      const subject = new TurnOffAndOnLights(lightService);

      await subject.perform({ lights: [light] });

      expect(lightService.turnOn).toHaveBeenCalledWith(light);
      expect(wait).toHaveBeenCalledWith(10);
      expect(lightService.turnOff).toHaveBeenCalledWith(light);
    });
  });
});
