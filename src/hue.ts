import { v3 } from "node-hue-api";
import { Firestore } from "@google-cloud/firestore";

export const updateLightStatus = async ({ on } = { on: false }) => {
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

  const api = await remote.connectWithTokens(access_token, refresh_token);

  await Promise.all(
    (process.env.HUE_LIGHTS || "")
      .split(",")
      .map((id) => api.lights.setLightState(id, { on }))
  );
};
