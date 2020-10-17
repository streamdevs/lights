import { ServerRoute } from "@hapi/hapi";
import { routes as get } from "./get";
import { routes as twitch } from "./twitch";

export const routes = (): ServerRoute[] => {
  return [...twitch(), ...get()];
};
