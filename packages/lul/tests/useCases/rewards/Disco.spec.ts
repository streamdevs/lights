import stc from "string-to-color";
import { FakeLightService } from "../../../src";
import { Disco } from "../../../src/useCases/rewards/Disco";
import { LightBuilder } from "../../builders/LightBuilder";
import { RewardBuilder } from "../../builders/RewardBuilder";

jest.mock("string-to-color", () => jest.fn(() => "#fefefe"));

describe("Disco", () => {
  describe("#perform", () => {
    it("uses the reward message to generate the color for the disco mode", async () => {
      const lightService = new FakeLightService();
      const subject = new Disco(lightService);
      const reward = RewardBuilder.build();
      const lights = LightBuilder.buildList(1);

      await subject.perform({ reward, lights });

      expect(stc).toHaveBeenCalledWith(reward.message);
    });

    it("uses the reward date to generate the initialColor for the disco mode", async () => {
      const lightService = new FakeLightService();
      const subject = new Disco(lightService);
      const reward = RewardBuilder.build();
      const lights = LightBuilder.buildList(1);

      await subject.perform({ reward, lights });

      expect(stc).toHaveBeenCalledWith(reward.date);
    });

    it("uses light service to start the disco mode", async () => {
      const lightService = new FakeLightService();
      const subject = new Disco(lightService);
      const reward = RewardBuilder.build();
      const lights = LightBuilder.buildList(1);

      await subject.perform({ reward, lights });

      expect(lightService.disco).toHaveBeenCalledWith(lights[0], {
        color: "#fefefe",
        initialColor: "#fefefe",
        cycles: 5,
        period: 20,
      });
    });
  });
});
