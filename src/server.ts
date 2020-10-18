import { Server } from "@hapi/hapi";
import Joi from "@hapi/joi";
import { routes } from "./routes";

export const initServer = () => {
  const server = new Server({
    port: process.env.PORT || 3000,
  });

  server.validator(Joi);
  server.route(routes());

  return server;
};
