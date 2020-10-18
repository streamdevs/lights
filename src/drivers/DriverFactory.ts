import { isTestEnv } from "../config";
import { FakeHttpDriver } from "./FakeHttpDriver";
import { HttpDriver } from "./HttpDriver";
import { NodeFetchHttpDriver } from "./NodeFetchHttpDriver";

export class DriverFactory {
  public static build(): HttpDriver {
    if (isTestEnv()) {
      return new FakeHttpDriver();
    }

    return new NodeFetchHttpDriver();
  }
}
