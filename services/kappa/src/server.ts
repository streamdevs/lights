import { Request, ResponseToolkit, Server } from "@hapi/hapi";

export const initServer = () => {
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

  return server;
};
