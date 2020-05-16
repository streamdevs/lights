import { v3 } from "node-hue-api";

export const updateLightStatus = async ({ on } = { on: false }) => {
  const {
    HUE_CLIENT_ID,
    HUE_CLIENT_SECRET,
    HUE_TOKEN,
    HUE_REFRESH_TOKEN,
  } = process.env;

  if (
    !HUE_CLIENT_ID ||
    !HUE_CLIENT_SECRET ||
    !HUE_TOKEN ||
    !HUE_REFRESH_TOKEN
  ) {
    throw new Error("Missing Philips Hue configuration");
  }

  const remote = v3.api.createRemote(HUE_CLIENT_ID, HUE_CLIENT_SECRET);

  const api = await remote.connectWithTokens(HUE_TOKEN, HUE_REFRESH_TOKEN);

  await Promise.all(
    (process.env.HUE_LIGHTS || "")
      .split(",")
      .map((id) => api.lights.setLightState(id, { on }))
  );
};
