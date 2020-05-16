import { v3 } from "node-hue-api";
import { Firestore } from "@google-cloud/firestore";
import Api from "node-hue-api/lib/api/Api";

let api: Api;

export const getPhilipsHueApi = async (): Promise<Api> => {
  if (api) {
    return api;
  }

  const { HUE_CLIENT_ID, HUE_CLIENT_SECRET } = process.env;

  if (!HUE_CLIENT_ID || !HUE_CLIENT_SECRET) {
    throw new Error("Missing Philips Hue env configuration");
  }
  const remote = v3.api.createRemote(HUE_CLIENT_ID, HUE_CLIENT_SECRET);

  const client = new Firestore();
  const document = await client.doc("integration/hue").get();
  const data = document.data();

  if (!data) {
    throw new Error("Unable to load Twitch configuration from Firestore");
  }
  const { access_token, refresh_token } = data;

  api = await remote.connectWithTokens(access_token, refresh_token);

  return api;
};

export const updateLightStatus = async ({ on } = { on: false }) => {
  const api = await getPhilipsHueApi();

  await Promise.all(
    (process.env.HUE_LIGHTS || "")
      .split(",")
      .map((id) => api.lights.setLightState(id, { on }))
  );
};

export const refreshHueTokens = async (): Promise<void> => {
  const client = new Firestore();
  const document = await client.doc("integration/hue").get();
  const { access_token_expire_at } = document.data() || {};

  if (!access_token_expire_at || Date.now() < access_token_expire_at) {
    console.log("INFO: skip hue token refresh");
    return;
  }

  console.log("INFO: refreshing new hue tokens");
  const api = await getPhilipsHueApi();
  const {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt,
    accessTokenExpiresAt,
  } = await api.remote.refreshTokens();

  await client.doc("integration/hue").set({
    access_token: accessToken,
    access_token_expire_at: accessTokenExpiresAt,
    refresh_token: refreshToken,
    refresh_token_expires_at: refreshTokenExpiresAt,
  });
};
