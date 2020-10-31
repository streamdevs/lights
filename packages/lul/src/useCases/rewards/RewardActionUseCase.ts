import { Light, Reward } from "../../entities";

export interface RewardActionUseCase {
  perform(options: { reward: Reward; lights: Light[] }): Promise<void>;
}
