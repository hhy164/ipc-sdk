var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IIPCType } from "./interface/index.js";
// 用于h5页面注册
class IPCServer {
    constructor(win) {
        this.win = win;
        // 存储注册的方法
        this.handlers = {};
        this.messageHandler = this.messageHandler.bind(this);
        this.win.addEventListener('message', this.messageHandler);
    }
    uuid() {
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    // 监听消息
    messageHandler(event) {
        try {
            this.handleMessage(event.data);
        }
        catch (e) {
            console.error('IPC handler error for channel');
        }
    }
    /**
     * 清理资源，移除监听事件
     * 在不需要IPCServer实例时调用此方法
     */
    destroy() {
        this.win.removeEventListener('message', this.messageHandler);
        this.handlers = {};
    }
    /**
     * 注册方法供客户端调用
     * @param channel 事件名-提供给iframe测
     * @param handler 回调函数
     */
    handle(channel, handler) {
        this.handlers[channel] = handler;
    }
    /**
     * 处理接收到的消息
     * @param params
     */
    handleMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { channel, args } = params;
            switch (params.type) {
                case IIPCType.IPC_INVOKE:
                    this.handlers[channel](...args);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * 发送事件给iframe
     * @param event 事件名
     * @param data 参数
     */
    emit(event, data) {
        const message = {
            type: IIPCType.IPC_EVENT,
            event,
            data,
            requestId: this.uuid()
        };
        this.win.parent.postMessage(message, '*');
    }
}
export default IPCServer;
