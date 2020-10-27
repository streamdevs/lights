import { LogDriver } from "./LogDriver";

export class ConsoleLogDriver implements LogDriver {
  public log = console.log;
  public error = console.error;
}
