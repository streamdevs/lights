import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { getConfiguration } from "../../../config";

export const routes = (): ServerRoute[] => {
  return [
    {
      method: "GET",
      path: "/twitch/auth",
      options: {
        handler: (_: Request, h: ResponseToolkit) => {
          const { clientId, scopes, redirectUri } = getConfiguration().twitch;

          return h.redirect(
            `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`
          );
        },
      },
    },
  ];
};
