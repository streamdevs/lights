import stc from "string-to-color";
import { Reward, Light } from "../../entities";
import { LifxLightService, LightService } from "../../services";
import { RewardActionUseCase } from "./RewardActionUseCase";

type PerformOptions = {
  reward: Reward;
  lights: Light[];
};

export class Disco implements RewardActionUseCase {
  public constructor(
    private lightService: LightService = new LifxLightService()
  ) {}

  public async perform({ reward, lights }: PerformOptions): Promise<void> {
    const color = stc(reward.message);
    const initialColor = stc(reward.date);

    await Promise.all(
      lights.map((light) =>
        this.lightService.disco(light, {
          color,
          initialColor,
          cycles: 10,
          period: 20,
        })
      )
    );
  }
}

export default Disco;
