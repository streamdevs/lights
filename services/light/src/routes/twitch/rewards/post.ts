import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Reward, RewardRedeemer } from "@streamdevs/lights-lul";

export const routes = (): ServerRoute[] => {
  return [
    {
      path: "/twitch/rewards",
      method: "POST",
      handler: async (request: Request, h: ResponseToolkit) => {
        const { reward } = request.payload as { reward: Reward };
        console.log(JSON.stringify(reward));

        await new RewardRedeemer().perform({ reward });

        return h.response().code(204);
      },
    },
  ];
};
