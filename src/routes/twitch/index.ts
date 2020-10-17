import { ServerRoute } from "@hapi/hapi";
import { routes as rewards } from "./rewards";

export const routes = (): ServerRoute[] => {
  return [...rewards()];
};
