import { Firestore } from "@google-cloud/firestore";
import { ApiClient } from "twitch";
import {
  AccessToken,
  RefreshableAuthProvider,
  StaticAuthProvider,
} from "twitch-auth";
import { PubSubClient } from "twitch-pubsub-client";
import { getConfiguration } from "@streamdevs/lights-lul";
import { FirestoreStorageService } from "@streamdevs/lights-lul";
import { GoogleCloudTaskService } from "@streamdevs/lights-lul";

const {
  twitch: { clientId, clientSecret, channelId },
} = getConfiguration();

export const initTwitchPubSub = async () => {
  const storageService = new FirestoreStorageService(new Firestore());

  const { accessToken, refreshToken, expiryDate } = await storageService.get(
    "services/twitch"
  );

  const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, accessToken),
    {
      clientSecret,
      refreshToken,
      expiry: expiryDate.toDate(),
      onRefresh: async (token: AccessToken) => {
        console.log("[Twitch] Token refreshed");

        await storageService.set("services/twitch", {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiryDate: token.expiryDate,
        });
      },
    }
  );
  const apiClient = new ApiClient({ authProvider });

  const pubSubClient = new PubSubClient();
  await pubSubClient.registerUserListener(apiClient);

  const listener = await pubSubClient.onRedemption(channelId, async (event) => {
    console.log(JSON.stringify({ event }));

    const payload = {
      reward: {
        id: event.rewardId,
        name: event.rewardName,
        date: event.redemptionDate,
        message: event.message,
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
