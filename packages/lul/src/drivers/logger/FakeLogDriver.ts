import { LogDriver } from "./LogDriver";

export class FakeLogDriver implements LogDriver {
  public log = jest.fn();
  public error = jest.fn();
}
