import { Reward } from "../../entities";
import { RewardAction } from "../../entities/RewardAction";
import { StorageService } from "../../services";

interface PerformOptions {
  reward: Reward;
}

export class RewardRedeemer {
  public constructor(private storageService: StorageService) {}

  public async perform({ reward }: PerformOptions) {
    const rewardAction: RewardAction = await this.storageService.get(
      `/rewards/${reward.id}`
    );

    if (rewardAction === undefined) {
      return await this.storageService.set(`/rewards/${reward.id}`, {
        reward,
        action: "",
        lights: [],
      });
    }

    const { action, lights } = rewardAction;

    if (!action) {
      return;
    }

    const { default: Action } = await import(`./${action}.ts`);
    await new Action().perform({ reward, lights });
  }
}