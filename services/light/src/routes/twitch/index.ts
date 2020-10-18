import { ServerRoute } from "@hapi/hapi";
import { routes as rewards } from "./rewards";
import { routes as auth } from "./auth";

export const routes = (): ServerRoute[] => {
  return [...rewards(), ...auth()];
};
