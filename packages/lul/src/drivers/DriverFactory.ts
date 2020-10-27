import { isTestEnv } from "../config";
import { HttpDriver, NodeFetchHttpDriver } from "./http";
import { FakeHttpDriver } from "./http/FakeHttpDriver";
import { ConsoleLogDriver, FakeLogDriver, LogDriver } from "./logger";

export class DriverFactory {
  public static buildHttpDriver(): HttpDriver {
    if (isTestEnv()) {
      return new FakeHttpDriver();
    }

    return new NodeFetchHttpDriver();
  }

  public static buildLogDriver(): LogDriver {
    if (isTestEnv()) {
      return new FakeLogDriver();
    }

    return new ConsoleLogDriver();
  }
}
