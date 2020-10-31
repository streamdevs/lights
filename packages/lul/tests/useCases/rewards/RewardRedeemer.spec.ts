import { Firestore, Timestamp } from "@google-cloud/firestore";
import { FirestoreStorageService } from "../../../src";
import { FakeAction } from "@streamdevs/lights-lul";
import { RewardRedeemer } from "../../../src/useCases/rewards/RewardRedeemer";
import { LightBuilder } from "../../builders/LightBuilder";
import { RewardBuilder } from "../../builders/RewardBuilder";

const testBuilder = (firestore: Firestore) => {
  const storageService = new FirestoreStorageService(firestore);
  const subject = new RewardRedeemer(storageService);

  return { subject, storageService };
};

describe("RewardRedeemer", () => {
  describe("#perform", () => {
    let firestore: Firestore;

    beforeAll(async () => {
      firestore = new Firestore({
        port: 8080,
        projectId: "example",
        host: "localhost",
        ssl: false,
      });
    });

    afterAll(async () => {
      await firestore.terminate();
    });

    it("stores unknown rewards in the db", async () => {
      const { subject, storageService } = testBuilder(firestore);
      const reward = RewardBuilder.build();

      await subject.perform({ reward });

      expect(await storageService.get(`/rewards/${reward.id}`)).toEqual({
        reward: {
          ...reward,
          date: Timestamp.fromDate(reward.date),
        },
        action: "",
        lights: [],
      });
    });

    it("doesn't update known rewards in the db", async () => {
      const { subject, storageService } = testBuilder(firestore);
      const reward = RewardBuilder.build();
      await storageService.set(`/rewards/${reward.id}`, {
        reward,
        action: "FakeAction",
      });

      await subject.perform({ reward });

      expect(await storageService.get(`/rewards/${reward.id}`)).toEqual({
        reward: {
          ...reward,
          date: Timestamp.fromDate(reward.date),
        },
        action: "FakeAction",
      });
    });

    it("calls the reward action with the reward and lights information", async () => {
      const { subject, storageService } = testBuilder(firestore);
      const reward = RewardBuilder.build();
      const lights = LightBuilder.buildList(1);
      const spy = jest.spyOn(FakeAction.prototype, "perform");
      await storageService.set(`/rewards/${reward.id}`, {
        reward,
        action: "FakeAction",
        lights,
      });

      await subject.perform({ reward });

      expect(spy).toHaveBeenCalledWith({ reward, lights });
    });

    it("skips rewards without action", async () => {
      const { subject, storageService } = testBuilder(firestore);
      const reward = RewardBuilder.build();
      await storageService.set(`/rewards/${reward.id}`, {
        reward,
        action: "",
      });

      await subject.perform({ reward });
    });
  });
});
