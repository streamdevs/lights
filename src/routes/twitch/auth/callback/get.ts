import { Firestore } from "@google-cloud/firestore";
import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { object, string } from "@hapi/joi";
import { getConfiguration } from "../../../../config";
import { NodeFetchHttpDriver } from "../../../../drivers/NodeFetchHttpDriver";
import { FirestoreStorageService } from "../../../../services/storage/FirestoreStorageService";

export const routes = (): ServerRoute[] => {
  return [
    {
      method: "GET",
      path: "/twitch/auth/callback",
      options: {
        handler: async (request: Request, h: ResponseToolkit) => {
          const {
            clientId,
            clientSecret,
            redirectUri,
          } = getConfiguration().twitch;
          const { code } = request.query;

          const {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
          } = await new NodeFetchHttpDriver().post(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`,
            {}
          );

          await new FirestoreStorageService(
            new Firestore()
          ).set("services/twitch", { accessToken, refreshToken, expiresIn });

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
