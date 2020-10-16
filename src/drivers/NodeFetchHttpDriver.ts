import { HttpDriver } from "./HttpDriver";
import fetch from "node-fetch";

export class NodeFetchHttpDriver implements HttpDriver {
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
}
