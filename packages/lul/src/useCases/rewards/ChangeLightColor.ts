import stc from "string-to-color";
import { Reward } from "../../entities";
import { Light } from "../../entities/Light";
import { LifxLightService } from "../../services/light/LifxLightService";
import { LightService } from "../../services/light/LightService";
import { RewardActionUseCase } from "./RewardActionUseCase";

interface PerformOptions {
  reward: Reward;
  lights: Light[];
}

export class ChangeLightColor implements RewardActionUseCase {
  public constructor(
    private lightService: LightService = new LifxLightService()
  ) {}

  public async perform({ reward, lights }: PerformOptions) {
    const color = stc(reward.message);

    await Promise.all(
      lights.map((light) => {
        this.lightService.changeColor(light, { color, duration: 10 });
      })
    );
  }
}

export default ChangeLightColor;
