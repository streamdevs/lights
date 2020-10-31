import { Light } from "./Light";
import { Reward } from "./Reward";

export interface RewardAction {
  reward: Reward;
  action: string;
  lights: Light[];
}
