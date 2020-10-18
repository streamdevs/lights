export interface StorageService {
  get(path: string): Promise<any | undefined>;
  set(path: string, value: any): Promise<void>;
}
