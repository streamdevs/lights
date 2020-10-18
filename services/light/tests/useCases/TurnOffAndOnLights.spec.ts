import { Light } from "../../src/entities/Light";
import { TurnOffAndOnLights } from "../../src/useCases/TurnOffAndOnLights";
import { wait } from "../../src/utils/wait";

jest.mock("../../src/utils/wait", () => ({
  wait: jest.fn(() => Promise.resolve()),
}));

describe("TurnOffAndOnLights", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  describe("#perform", () => {
    it("turn off the lights, waits 10 seconds and turns all the lights on again", async () => {
      const light: Light = { service: "LIFX", id: "blablabla" };
      const lightService = { turnOn: jest.fn(), turnOff: jest.fn() };

      const subject = new TurnOffAndOnLights(lightService);

      await subject.perform({ lights: [light] });

      expect(lightService.turnOn).toHaveBeenCalledWith(light);
      expect(wait).toHaveBeenCalledWith(10);
      expect(lightService.turnOff).toHaveBeenCalledWith(light);
    });
  });
});
