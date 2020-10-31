import { ChangeLightColor } from "../../../src";
import { FakeLightService } from "../../../src/services/light/FakeLightService";
import { LightBuilder } from "../../builders/LightBuilder";

describe("ChangeLightColor", () => {
  describe("#perform", () => {
    it("uses the LightService to change the color", async () => {
      const lightService = new FakeLightService();
      const light = LightBuilder.build({ service: "LIFX" });
      const subject = new ChangeLightColor(lightService);

      await subject.perform({ message: "message", lights: [light] });

      expect(lightService.changeColor).toHaveBeenCalledWith(light, {
        color: expect.stringMatching(/^#[0-9a-f]{3,6}$/i),
        duration: 10,
      });
    });
  });
});
