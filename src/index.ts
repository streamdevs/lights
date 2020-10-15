import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import { initTwitchPubSub } from "./twitch";

const init = async () => {
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
    {
      path: "/twitch/rewards",
      method: "POST",
      handler: async (request: Request, h: ResponseToolkit) => {
        const payload = request.payload;
        console.log(payload);

        return h.response().code(204);
      },
    },
  ]);

  await server.start();
  initTwitchPubSub();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
