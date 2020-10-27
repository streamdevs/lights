import { HttpDriver } from "./HttpDriver";
import fetch from "node-fetch";
import { DriverFactory } from "../DriverFactory";
import { LogDriver } from "../logger/LogDriver";

export class NodeFetchHttpDriver implements HttpDriver {
  public constructor(
    private logger: LogDriver = DriverFactory.buildLogDriver()
  ) {}

  public async put(
    url: string,
    options: { payload?: any; headers?: any }
  ): Promise<void> {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(options.payload),
      headers: { "Content-Type": "application/json", ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`${response.status} - ${await response.text()}`);
    }
  }

  public async post(
    url: string,
    options: { payload?: any; headers?: any }
  ): Promise<any> {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(options.payload),
      headers: { "Content-Type": "application/json", ...options.headers },
    });

    if (!response.ok) {
      const error = new Error(`${response.status} - ${await response.text()}`);
      this.logger.error(error);
      throw error;
    }

    try {
      return await response.clone().json();
    } catch (e) {
      return await response.clone().text();
    }
  }
}
