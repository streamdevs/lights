import { Firestore } from "@google-cloud/firestore";
import { StorageService } from "./StorageService";

export class FirestoreStorageService implements StorageService {
  public constructor(private client: Firestore) {}

  public async get(path: string): Promise<any | undefined> {
    const document = await this.client.doc(path).get();
    return document.data();
  }

  public async set(path: string, value: any): Promise<void> {
    await this.client.doc(path).set(value);
  }
}
