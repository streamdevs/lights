import { CloudTasksClient, v2 } from "@google-cloud/tasks";
import { google } from "@google-cloud/tasks/build/protos/protos";
import { getConfiguration } from "../../config";
import { TaskService } from "./TaskService";

type TaskPath = "/twitch/rewards";

type TaskPayload = RewardTaskPayload;

interface RewardTaskPayload {
  reward: {
    id: string;
    name: string;
    date: Date;
  };
}

interface CreateOptions {
  name: string;
  path: TaskPath;
  payload: TaskPayload;
}

export class GoogleCloudTaskService implements TaskService<TaskPayload> {
  public constructor(
    private client: v2.CloudTasksClient = new CloudTasksClient(),
    private logger: Console = console
  ) {}

  public async create({ path, name, payload }: CreateOptions) {
    const {
      tasks: { queue, location },
      project: { id: projectId, service },
    } = getConfiguration();

    const parent = this.client.queuePath(projectId, location, queue);

    const task: google.cloud.tasks.v2.ITask = {
      name: `projects/${projectId}/locations/${location}/queues/${queue}/tasks/${name}`,
      appEngineHttpRequest: {
        httpMethod: "POST",
        relativeUri: path,
        body: Buffer.from(JSON.stringify(payload)).toString("base64"),
        headers: { ["Content-Type"]: "application/json" },
        appEngineRouting: { service },
      },
    };

    this.logger.log("Sending task:");
    this.logger.log(task);

    // Send create task request.
    const request = { parent, task };
    const [response] = await this.client.createTask(request);
    this.logger.log(`Created task ${response.name}`);
  }
}
