export interface HttpDriver {
  put(url: string, options: { payload?: any; headers?: any }): Promise<void>;
  post(url: string, options: { payload?: any; headers?: any }): Promise<void>;
}
