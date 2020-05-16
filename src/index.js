const Hapi = require("@hapi/hapi");
const initTwitch = require("./twitch");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
  });

  server.route([
    {
      path: "/",
      method: "GET",
      handler: (_, h) => {
        return h.response("").code(200);
      },
    },
  ]);

  await server.start();
  initTwitch();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
