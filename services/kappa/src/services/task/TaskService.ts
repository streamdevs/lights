export interface TaskService<Payload> {
  create(options: {
    name: string;
    path: string;
    payload: Payload;
  }): Promise<void>;
}
