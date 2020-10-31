import { LightService } from "./LightService";

export class FakeLightService implements LightService {
  public turnOff = jest.fn();
  public turnOn = jest.fn();
  public changeColor = jest.fn();
  public disco = jest.fn();
}
