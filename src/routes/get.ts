import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";

export const routes = (): ServerRoute[] => {
  return [
    {
      path: "/",
      method: "GET",
      handler: async (_: Request, h: ResponseToolkit) => {
        return h.response("").code(200);
      },
    },
  ];
};
