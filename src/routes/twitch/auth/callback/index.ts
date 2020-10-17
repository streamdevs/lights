import { ServerRoute } from "@hapi/hapi";
import { routes as get } from "./get";

export const routes = (): ServerRoute[] => {
  return [...get()];
};
