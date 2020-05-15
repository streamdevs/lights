const v3 = require("node-hue-api").v3;

const updateLightStatus = async ({ on } = { on: false }) => {
  const remote = v3.api.createRemote(
    process.env.HUE_CLIENT_ID,
    process.env.HUE_CLIENT_SECRET
  );

  const api = await remote.connectWithTokens(
    process.env.HUE_TOKEN,
    process.env.HUE_REFRESH_TOKEN
  );

  await Promise.all([
    api.lights.setLightState(5, { on }),
    api.lights.setLightState(6, { on }),
    api.lights.setLightState(9, { on }),
  ]);
};

module.exports = updateLightStatus;
