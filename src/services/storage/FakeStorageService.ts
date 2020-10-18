import { StorageService } from "./StorageService";

export class FakeStorageService implements StorageService {
  public get = jest.fn();
  public set = jest.fn();
}
