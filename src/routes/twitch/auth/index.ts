import { ServerRoute } from "@hapi/hapi";
import { routes as get } from "./get";
import { routes as callback } from "./callback";

export const routes = (): ServerRoute[] => {
  return [...get(), ...callback()];
};
