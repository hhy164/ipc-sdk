import { IIPCType, IPCInVokeData } from "./interface/index.js";

class IPCServer {
  // 存储注册的方法
  private handlers: Record<string, Function> = {};
  constructor(private win: Window) {
    // 监听消息
    this.win.addEventListener('message', (event) => {
      console.log(event, 'event')
      try {
        this.handleMessage(event.data);
      } catch (e) {
        console.error('IPC handler error for channel')
      }
    })
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
}

export default IPCServer;