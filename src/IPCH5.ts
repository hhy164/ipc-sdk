import { IPCType } from "./interface/index.js";
export class IPCH5 {
  private handlers: Record<string, Function> = {}
  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener('message', this.handleMessage)
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage);
    this.handlers = {}
  }

  // 注册方法
  handle(channel: string, callback: Function) {
    this.handlers[channel] = callback;
  }

  // 监听消息的处理
  async handleMessage(event: any) {
    const { type } = event.data
    switch (type) {
      case IPCType.INVOKE_REQUEST:
        const { channel, params, requestId } = event.data;
        try {
          const result = await this.handlers[channel](params);
          window.parent.postMessage({
            type: IPCType.INVOKE_RESPONSE,
            result,
            requestId
          }, '*')
        } catch (e) {
          window.parent.postMessage({
            type: IPCType.INVOKE_RESPONSE,
            requestId,
            error: JSON.stringify(e),
          }, '*')
        }
        break;
      default:
        break;
    }
  }
}