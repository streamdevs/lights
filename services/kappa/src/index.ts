import { initServer } from "./server";
import { initTwitchPubSub } from "./twitch";

const init = async () => {
  const server = initServer();

  await server.start();
  initTwitchPubSub();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
