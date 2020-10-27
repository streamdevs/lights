export abstract class LogDriver {
  public abstract log(message: object): void;
  public abstract error(message: Error): void;
}
