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
class IPCServer {
    constructor(win) {
        this.win = win;
        // 存储注册的方法
        this.handlers = {};
        // 监听消息
        this.win.addEventListener('message', (event) => {
            console.log(event, 'event');
            try {
                this.handleMessage(event.data);
            }
            catch (e) {
                console.error('IPC handler error for channel');
            }
        });
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
}
export default IPCServer;
