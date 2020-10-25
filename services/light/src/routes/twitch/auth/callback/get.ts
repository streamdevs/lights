import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { object, string } from "@hapi/joi";
import { TwitchAuthCallback } from "@streamdevs/lights-lul";

export const routes = (): ServerRoute[] => {
  return [
    {
      method: "GET",
      path: "/twitch/auth/callback",
      options: {
        handler: async (request: Request, h: ResponseToolkit) => {
          const { code } = request.query;

          await new TwitchAuthCallback().perform({ code: code.toString() });

          return h.response().code(200);
        },
        validate: {
          query: object({
            code: string().required(),
          }).options({ stripUnknown: true }),
        },
      },
    },
  ];
};
