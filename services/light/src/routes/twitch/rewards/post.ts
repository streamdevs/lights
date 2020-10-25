import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Light } from "@streamdevs/lights-lul";
import { Reward } from "@streamdevs/lights-lul";
import { ChangeLightColor } from "@streamdevs/lights-lul";
import { TurnOffAndOnLights } from "@streamdevs/lights-lul";

export const routes = (): ServerRoute[] => {
  return [
    {
      path: "/twitch/rewards",
      method: "POST",
      handler: async (request: Request, h: ResponseToolkit) => {
        const { reward } = request.payload as { reward: Reward };
        console.log(JSON.stringify(reward));

        const lights: Light[] = (process.env.LIFX_LIGHTS || "")
          .split(",")
          .map((id) => ({ id, service: "LIFX" }));

        switch (reward.id) {
          case "3cc420c0-2198-4cd8-9a07-c68f489c50be":
            await new TurnOffAndOnLights().perform({ lights });
            break;
          case "d6909487-7ad1-4a95-a423-169cf465fb6d":
            await new ChangeLightColor().perform({
              lights,
              message: reward.message,
            });
            break;
        }

        return h.response().code(204);
      },
    },
  ];
};
