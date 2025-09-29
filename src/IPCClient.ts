// 用于iframe页面处注册
class IPCClient {
  constructor(private win: Window) {

  }
  uuid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  /**
   * 调用h5提供的方法
   * @param channel 事件名
   * @param args 参数
   * @returns 
   */
  invoke(channel: string, ...args: any[]) {
    const requestId = this.uuid();
    this.win.postMessage({
      type: 'ipc_invoke',
      channel,
      args,
      requestId,
    })
  }
}

export default IPCClient;