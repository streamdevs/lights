import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import { NodeFetchHttpDriver } from "./drivers/NodeFetchHttpDriver";
import { Light } from "./entities/Light";
import { Reward } from "./entities/Reward";
import { LifxLightService } from "./services/light/LifxLightService";
import { initTwitchPubSub } from "./twitch";
import { TurnOffAndOnLights } from "./useCases/TurnOffAndOnLights";

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
        const { reward } = request.payload as { reward: Reward };
        console.log(reward);

        switch (reward.id) {
          case "3cc420c0-2198-4cd8-9a07-c68f489c50be":
            const lights: Light[] = (process.env.LIFX_LIGHTS || "")
              .split(",")
              .map((id) => ({ id, service: "LIFX" }));
            await new TurnOffAndOnLights().perform({ lights });
            break;
        }

        return h.response().code(204);
      },
    },
  ]);

  await server.start();
  // initTwitchPubSub();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
