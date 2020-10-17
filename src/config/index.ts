export const getConfiguration = () => {
  return {
    project: {
      id: process.env.GOOGLE_CLOUD_PROJECT || "fake-project-id",
      service: process.env.APP_GOOGLE_CLOUD_SERVICE || "fake-service-id",
    },
    tasks: {
      queue: process.env.APP_GOOGLE_CLOUD_QUEUE || "fake-queue",
      location: process.env.APP_GOOGLE_CLOUD_QUEUE_LOCATION || "fake-location",
    },
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID || "fake-twitch-client-id",
      clientSecret:
        process.env.TWITCH_CLIENT_SECRET || "fake-twitch-client-secret",
      channelId: process.env.TWITCH_CHANNEL_ID || "fake-twitch-channel-id",
      redirectUri:
        process.env.TWITCH_REDIRECT_URI || "fake-twitch-redirect-uri",
      scopes: process.env.TWITCH_SCOPES || "fake-twitch-scopes",
    },
    lifx: {
      accessToken: process.env.LIFX_ACCESS_TOKEN || "fake-lifx-token",
    },
  };
};
