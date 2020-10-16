export interface HttpDriver {
  put(url: string, options: { payload?: any; headers?: any }): Promise<void>;
}
