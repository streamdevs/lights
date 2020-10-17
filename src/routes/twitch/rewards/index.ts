import { ServerRoute } from "@hapi/hapi";
import { routes as post } from "./post";

export const routes = (): ServerRoute[] => {
  return [...post()];
};
