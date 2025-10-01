import { IIPCType, IPCEventData, IPCInVokeData } from "./interface/index.js";
// 用于h5页面注册
class IPCServer {
  // 存储注册的方法
  private handlers: Record<string, Function> = {};
  constructor(private win: Window) {
    this.messageHandler = this.messageHandler.bind(this)
    this.win.addEventListener('message', this.messageHandler)
  }

  uuid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  // 监听消息
  messageHandler(event: MessageEvent) {
    try {
      this.handleMessage(event.data);
    } catch (e) {
      console.error('IPC handler error for channel')
    }
  }

  /**
   * 清理资源，移除监听事件
   * 在不需要IPCServer实例时调用此方法
   */
  destroy() {
    this.win.removeEventListener('message', this.messageHandler)
    this.handlers = {}
  }

  /**
   * 注册方法供客户端调用
   * @param channel 事件名-提供给iframe测
   * @param handler 回调函数
   */
  handle(channel: string, handler: Function): void {
    this.handlers[channel] = handler;
  }
  /**
   * 处理接收到的消息
   * @param params 
   */
  private async handleMessage(params: IPCInVokeData) {
    const { channel, args } = params;
    switch (params.type) {
      case IIPCType.IPC_INVOKE:
        this.handlers[channel](...args);
        break;
      default:
        break;
    }
  }

  /**
   * 发送事件给iframe
   * @param event 事件名
   * @param data 参数
   */
  emit(event: string, data: any) {
    const message: IPCEventData = {
      type: IIPCType.IPC_EVENT,
      event,
      data,
      requestId: this.uuid()
    }
    this.win.parent.postMessage(message, '*')
  }
}

export default IPCServer;