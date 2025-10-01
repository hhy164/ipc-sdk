import { IIPCType, IPCEventData } from "./interface/index.js";
// 用于iframe页面处注册
class IPCClient {
  // 存储事件监听器
  private eventHandlers: Record<string, Function[]> = {}
  constructor(private win: Window) {
    this.win.addEventListener('message', (event: MessageEvent) => {
      this.handleMessage(event.data)
    })
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
    const params = {
      type: IIPCType.IPC_INVOKE,
      channel,
      args,
      requestId,
    }
    this.win.postMessage(params)
  }
  /**
   * 监听h5抛出的事件
   * @param event 事件名
   * @param listen 回调函数
   */
  on(event: string, listen: Function) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [listen];
      return;
    }
    this.eventHandlers[event].push(listen);
  }
  /**
   * 处理接收到的消息
   * @param event 
   */
  handleMessage(eventData: IPCEventData) {
    const { event, data, type } = eventData;
    if (type === IIPCType.IPC_EVENT) {
      if (this.eventHandlers[event]) {
        // 执行这个事件下的所有处理函数
        this.eventHandlers[event].forEach(handler => handler(data));
      }
    }
  }
  destroy() {
    this.eventHandlers = {};
  }
}

export default IPCClient;