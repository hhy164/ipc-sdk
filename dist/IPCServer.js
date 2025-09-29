class IPCServer {
    constructor() {
        // 存储注册的方法
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
}
export default IPCServer;
