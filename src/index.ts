import { Server } from "@hapi/hapi";
import { routes } from "./routes";
import { initTwitchPubSub } from "./twitch";

const init = async () => {
  const server = new Server({
    port: process.env.PORT || 3000,
  });

  server.route(routes());

  await server.start();
  initTwitchPubSub();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
