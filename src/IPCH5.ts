import { IPCType } from "./interface/index";
export class IPCH5 {
  private handlers: Record<string, Function> = {}
  private eventHandlers: Record<string, Function[]> = {}
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
      case IPCType.EMIT_IFRAME:
        const { params: data, eventName } = event.data;
        const fnArr = this.eventHandlers[eventName] || [];
        for (const item of fnArr) {
          item(data);
        }
        break;
      default:
        break;
    }
  }

  // 抛出事件
  emit(eventName: string, params: any) {
    window.parent.postMessage({
      type: IPCType.EMIT_H5,
      eventName,
      params
    }, '*')
  }

  // 监听消息
  on(eventName: string, callback: Function) {
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].push(callback)
    } else {
      this.eventHandlers[eventName] = [callback]
    }
  }

  // 移除监听事件
  off(eventName: string, callback?: Function) {
    if (callback) {
      this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(item => item !== callback);
    } else {
      this.eventHandlers[eventName] = [];
    }
  }
}