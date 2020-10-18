import { Firestore } from "@google-cloud/firestore";
import { isTestEnv } from "../../config";
import { FakeStorageService } from "./FakeStorageService";
import { FirestoreStorageService } from "./FirestoreStorageService";
import { StorageService } from "./StorageService";

export class StorageFactory {
  public static build(): StorageService {
    if (isTestEnv()) {
      return new FakeStorageService();
    }

    return new FirestoreStorageService(new Firestore());
  }
}
