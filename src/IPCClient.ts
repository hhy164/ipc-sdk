
class IPCClient {
  private eventListeners: Record<string, Function[]> = {};
  private pendingRequests: Record<string, Function> = {};

  constructor(private transport: ITransport) {
  }
}