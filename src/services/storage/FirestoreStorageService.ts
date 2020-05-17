import { Firestore } from "@google-cloud/firestore";

export class FirestoreStorageService {
  public constructor(private client: Firestore) {}

  public async getDocument(path: string): Promise<any | undefined> {
    const document = await this.client.doc(path).get();
    return document.data();
  }
}
