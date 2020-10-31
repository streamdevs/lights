import stc from "string-to-color";
import { ChangeLightColor } from "../../../src";
import { FakeLightService } from "../../../src/services/light/FakeLightService";
import { LightBuilder } from "../../builders/LightBuilder";
import { RewardBuilder } from "../../builders/RewardBuilder";

jest.mock("string-to-color", () => jest.fn(() => "#fefefe"));

describe("ChangeLightColor", () => {
  describe("#perform", () => {
    describe("without implementing 'RewardActionUseCase'", () => {
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

      it("calls the 'stc' function with the right message", async () => {
        const lightService = new FakeLightService();
        const light = LightBuilder.build({ service: "LIFX" });

        const subject = new ChangeLightColor(lightService);

        await subject.perform({ message: "test", lights: [light] });

        expect(stc).toHaveBeenCalledWith("test");
      });
    });

    describe("implementing 'RewardActionUseCase'", () => {
      it("uses the LightService to change the color", async () => {
        const lightService = new FakeLightService();
        const light = LightBuilder.build({ service: "LIFX" });
        const reward = RewardBuilder.build();

        const subject = new ChangeLightColor(lightService);

        await subject.perform({ reward, lights: [light] });

        expect(lightService.changeColor).toHaveBeenCalledWith(light, {
          color: expect.stringMatching(/^#[0-9a-f]{3,6}$/i),
          duration: 10,
        });
      });

      it("calls the 'stc' function with the right message", async () => {
        const lightService = new FakeLightService();
        const light = LightBuilder.build({ service: "LIFX" });
        const reward = RewardBuilder.build();

        const subject = new ChangeLightColor(lightService);

        await subject.perform({ reward, lights: [light] });

        expect(stc).toHaveBeenCalledWith(reward.message);
      });
    });
  });
});
