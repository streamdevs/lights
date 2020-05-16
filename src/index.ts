import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { initTwitchPubSub } from "./twitch";
import { setup } from "./setup";

const init = async () => {
  const server = new Server({
    port: process.env.PORT || 3000,
  });

  await setup();

  server.route([
    {
      path: "/",
      method: "GET",
      handler: (_: Request, h: ResponseToolkit) => {
        return h.response("").code(200);
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
