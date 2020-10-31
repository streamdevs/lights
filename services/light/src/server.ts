import { ErrorReporting } from "@google-cloud/error-reporting";
import { Server } from "@hapi/hapi";
import Joi from "@hapi/joi";
import { isTestEnv } from "@streamdevs/lights-lul";
import { routes } from "./routes";

export const initServer = () => {
  const server = new Server({
    port: process.env.PORT || 3000,
  });

  server.validator(Joi);
  server.route(routes());

  if (!isTestEnv()) {
    server.register(new ErrorReporting().hapi);
  }

  return server;
};
