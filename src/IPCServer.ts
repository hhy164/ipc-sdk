class IPCServer {
  // 存储注册的方法
  private handlers: Record<string, Function> = {};
  constructor() {

  }
  /**
   * 注册方法供客户端调用
   * @param channel 事件名-提供给iframe测
   * @param handler 回调函数
   */
  handle(channel: string, handler: Function): void {
    this.handlers[channel] = handler;
  }
}

export default IPCServer;