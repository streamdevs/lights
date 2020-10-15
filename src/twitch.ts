import { Firestore } from "@google-cloud/firestore";
import { CloudTasksClient } from "@google-cloud/tasks";
import { google } from "@google-cloud/tasks/build/protos/protos";
import { ApiClient } from "twitch";
import {
  AccessToken,
  RefreshableAuthProvider,
  StaticAuthProvider,
} from "twitch-auth";
import { PubSubClient } from "twitch-pubsub-client";
import { getConfiguration } from "./config";
import { FirestoreStorageService } from "./services/storage/FirestoreStorageService";
import { GoogleCloudTaskService } from "./services/task/GoogleCloudTaskService";

const {
  twitch: { clientId, clientSecret, channelId },
  project: { id: projectId, service },
  tasks: { queue, location },
} = getConfiguration();

export const initTwitchPubSub = async () => {
  const storageService = new FirestoreStorageService(new Firestore());

  const { accessToken, refreshToken, isExpired } = await storageService.get(
    "services/twitch"
  );

  if (isExpired) {
    throw new Error("[Twitch] Token expired");
  }

  const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, accessToken),
    {
      clientSecret,
      refreshToken,
      onRefresh: async (token: AccessToken) => {
        await storageService.set("services/twitch", {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiryDate: token.expiryDate,
          isExpired: token.isExpired,
        });
      },
    }
  );
  const apiClient = new ApiClient({ authProvider });

  const pubSubClient = new PubSubClient();
  await pubSubClient.registerUserListener(apiClient);

  const listener = await pubSubClient.onRedemption(channelId, async (event) => {
    const payload = {
      reward: {
        id: event.rewardId,
        name: event.rewardName,
        date: event.redemptionDate,
      },
    };

    await new GoogleCloudTaskService().create({
      name: event.id,
      path: "/twitch/rewards",
      payload,
    });
  });

  process.on("unhandledRejection", () => {
    listener.remove();
  });
};
