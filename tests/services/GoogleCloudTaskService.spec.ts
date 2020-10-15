import { v2 } from "@google-cloud/tasks";
import { GoogleCloudTaskService } from "../../src/services/task/GoogleCloudTaskService";
import { RewardBuilder } from "../builders/RewardBuilder";

const testBuilder = () => {
  const client = ({
    queuePath: jest.fn(),
    createTask: jest.fn().mockResolvedValue([
      {
        name: "task-name",
        creationTime: "2020-10-15",
        scheduleTime: "2020-10-15",
      },
    ]),
  } as unknown) as v2.CloudTasksClient;
  const subject = new GoogleCloudTaskService(client, {
    log: () => {},
  } as Console);

  return { subject, client };
};

describe("GoogleCloudTaskService", () => {
  describe("#create", () => {
    it("calls the Google Cloud Task SDK with the expected configuration", async () => {
      const { subject, client } = testBuilder();
      const reward = RewardBuilder.build();

      await subject.create({
        name: "blabla",
        path: "/twitch/rewards",
        payload: {
          reward,
        },
      });

      expect(client.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          task: {
            name: expect.stringContaining("blabla"),
            appEngineHttpRequest: {
              httpMethod: "POST",
              relativeUri: "/twitch/rewards",
              body: Buffer.from(JSON.stringify({ reward })).toString("base64"),
              headers: { ["Content-Type"]: "application/json" },
              appEngineRouting: { service: "fake-service-id" },
            },
          },
        })
      );
    });
  });
});
