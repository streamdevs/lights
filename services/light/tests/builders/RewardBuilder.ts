import * as Factory from "factory.ts";
import { Reward } from "../../src/entities/Reward";
import { random, date } from "faker";

export const RewardBuilder = Factory.Sync.makeFactory<Reward>({
  id: random.uuid(),
  date: date.past(),
  name: random.word(),
  message: random.words(),
});
