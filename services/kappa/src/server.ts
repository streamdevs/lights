import { ErrorReporting } from "@google-cloud/error-reporting";
import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import { isTestEnv } from "@streamdevs/lights-lul";

export const initServer = async () => {
  const server = new Server({
    port: process.env.PORT || 3000,
  });

  server.route([
    {
      path: "/",
      method: "GET",
      handler: async (_: Request, h: ResponseToolkit) => {
        return h.response("").code(200);
      },
    },
  ]);

  if (!isTestEnv()) {
    await server.register(new ErrorReporting().hapi);
  }

  return server;
};
