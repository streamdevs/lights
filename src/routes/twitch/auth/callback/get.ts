import { Firestore } from "@google-cloud/firestore";
import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { object, string } from "@hapi/joi";
import { DateTime } from "luxon";
import { getConfiguration } from "../../../../config";
import { NodeFetchHttpDriver } from "../../../../drivers/NodeFetchHttpDriver";
import { FirestoreStorageService } from "../../../../services/storage/FirestoreStorageService";
import { TwitchAuthCallback } from "../../../../useCases/auth/TwitchAuthCallback";

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
