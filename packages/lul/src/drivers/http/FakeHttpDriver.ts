import { HttpDriver } from "./HttpDriver";

export class FakeHttpDriver implements HttpDriver {
  public post = jest.fn();
  public put = jest.fn();
}
