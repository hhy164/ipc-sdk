import { IPCType } from "./interface/index";
export class IPCIframe {
  private pendingHandlers: Record<string, { resolve: Function, reject: Function }> = {}
  private eventHandlers: Record<string, Function[]> = {}
  constructor(private win: Window) {
    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener('message', this.handleMessage);
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage);
    this.pendingHandlers = {}
  }

  // 获取唯一ID
  getId() {
    return `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
  }

  // 调用H5注册的方法
  invoke(channel: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = this.getId();
      this.pendingHandlers[requestId] = { resolve, reject };
      this.win.postMessage({
        type: IPCType.INVOKE_REQUEST,
        params,
        channel,
        requestId
      }, '*')
    })
  }

  // 处理获取到的消息
  handleMessage(event: any) {
    if (event.source !== this.win) return;
    const { type } = event.data;
    switch (type) {
      case IPCType.INVOKE_RESPONSE:
        const { requestId, result, error } = event.data;
        if (error) {
          this.pendingHandlers[requestId].reject(error)
        } else {
          this.pendingHandlers[requestId].resolve(result);
        }
        break;
      case IPCType.EMIT_H5:
        const { params, eventName } = event.data;
        const fnArr = this.eventHandlers[eventName] || [];
        for (const item of fnArr) {
          item(params);
        }
        break;
      default:
        break;
    }
  }

  // 监听事件
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

  // 抛出事件
  emit(eventName: string, params?: any) {
    this.win.postMessage({
      type: IPCType.EMIT_IFRAME,
      eventName,
      params
    }, '*')
  }
}