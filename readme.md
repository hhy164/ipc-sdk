# copilot-ipc-sdk

IPC 通信 SDK，用于 Electron 进程和 H5 页面之间的通信。

## 安装

```bash
npm install copilot-ipc-sdk
```

## 功能特性

- 🔄 双向通信：支持 Electron 进程和 H5 页面之间的双向通信
- 📡 事件系统：支持事件监听和发送
- 🔧 方法调用：支持异步方法调用和响应
- 🛡️ 类型安全：完整的 TypeScript 类型定义
- 🚀 轻量级：无外部依赖，体积小巧

## 快速开始

### H5 主进程 (Server)

```javascript
import { Server, H5Transport } from '@casstime/copilot-web-sdk';

// 初始化 IPC Server
const h5Transport = new H5Transport(window);
const ipc = new Server(h5Transport);

// 注册方法供 client 调用
ipc.handle('getUserInfo', async () => {
  return {
    name: '张三',
    phone: '13888888888',
    email: 'zhangsan@example.com'
  };
});

ipc.handle('getSystemInfo', async (info) => {
  return {
    platform: 'darwin',
    version: '1.0.0',
    arch: 'x64'
  };
});

// 发送事件到 client
ipc.emit('h5Ready', { version: '1.0.0' });
```

### Iframe 页面 (Client)

```javascript
import { Client, IframeTransport } from '@casstime/copilot-web-sdk';

// 初始化 IPC Client
const iframeTransport = new IframeTransport(window);
const ipc = new Client(iframeTransport);

// 监听 H5 事件
ipc.on('h5Event', (data) => {
  console.log('Received event from Electron:', data);
});

ipc.on('h5Ready', (data) => {
  console.log('H5 Ready event:', data);
});

// 调用 H5 方法
async function getUserData() {
  try {
    const userData = await ipc.invoke('getUserInfo');
    console.log('User data:', userData);
  } catch (error) {
    console.error('Failed to get user data:', error);
  }
}

// 调用H5方法携带 params
async function getSystemInfo() {
  try {
    const params = {
      info: "xxx"
    }
    const sysInfo = await ipc.invoke('getSystemInfo', params);
    console.log('System info:', sysInfo);
  } catch (error) {
    console.error('Failed to get system info:', error);
  }
}

```

## API 参考

### Server

#### 构造函数
```typescript
new Server(transport?: ITransport)
```

#### 方法

##### `handle(channel: string, handler: Function)`
注册方法供客户端调用。

```javascript
ipc.handle('add', (a, b) => a + b);
ipc.handle('getUserInfo', async () => {
  return { name: 'John', age: 30 };
});
```

##### `unhandle(channel: string)`
取消注册方法。

```javascript
ipc.unhandle('add');
```

##### `emit(event: string, data?: any)`
发送事件到客户端。

```javascript
ipc.emit('userUpdated', { userId: 123, name: 'John' });
```

### Client

#### 构造函数
```typescript
new Client(transport: ITransport)
```

#### 方法

##### `invoke(channel: string, ...args: any[]): Promise<any>`
调用服务器方法。

```javascript
const result = await ipc.invoke('add', 1, 2);
const userInfo = await ipc.invoke('getUserInfo');
```

##### `emit(event: string, data?: any)`
发送事件到服务器。

```javascript
ipc.emit('buttonClicked', { buttonId: 'submit' });
```

##### `on(event: string, listener: Function)`
监听事件。

```javascript
ipc.on('userUpdated', (data) => {
  console.log('User updated:', data);
});
```

##### `off(event: string, listener?: Function)`
移除事件监听。

```javascript
// 移除特定监听器
ipc.off('userUpdated', myListener);

// 移除所有监听器
ipc.off('userUpdated');
```

## 传输层

### IframeTransport

用于 Electron 环境中的通信。

```javascript
import { IframeTransport } from '@casstime/copilot-web-sdk';

const transport = new IframeTransport(window);
const client = new Client(transport);
```

### H5Transport

用于 H5 环境中的通信。

```javascript
import { H5Transport } from '@casstime/copilot-web-sdk';

const transport = new H5Transport();
const client = new Client(transport);
```

## 调试

项目提供了完整的调试页面，可以测试 Client 和 Server 之间的通信。

### 启动调试页面

1. 在浏览器中打开 `debug.html`
2. 点击"启动 Electron Server"
3. 在 H5 页面区域点击"启动 H5 Client"
4. 测试各种通信功能

### 调试功能

- ✅ 方法调用测试
- ✅ 事件通信测试
- ✅ 实时日志查看
- ✅ 错误处理测试

详细使用说明请参考 [DEBUG_README.md](./DEBUG_README.md)

## 开发

### 构建

```bash
# 构建项目
yarn build

# 测试构建
yarn build:test
```

### 发布

```bash
# 交互式发布（推荐）
yarn publish:interactive

# 直接发布
npm publish
```

### 开发环境

```bash
# 安装依赖
yarn install

# 启动开发模式
yarn dev
```

## 消息格式

### 请求消息
```typescript
{
  type: 'request',
  reqId: string,
  channel: string,
  params: any[]
}
```

### 响应消息
```typescript
{
  type: 'response',
  reqId: string,
  result?: any,
  error?: {
    code: number,
    message: string
  }
}
```

### 事件消息
```typescript
{
  type: 'event',
  reqId: string,
  event: string,
  data?: any
}
```

## 错误处理

### 方法调用错误

```javascript
try {
  const result = await ipc.invoke('nonExistentMethod');
} catch (error) {
  console.error('Method call failed:', error.message);
}
```

### 事件监听错误

```javascript
ipc.on('error', (error) => {
  console.error('IPC error:', error);
});
```

## 最佳实践

### 1. 错误处理

始终使用 try-catch 包装异步方法调用：

```javascript
async function safeInvoke(channel, ...args) {
  try {
    return await ipc.invoke(channel, ...args);
  } catch (error) {
    console.error(`Failed to invoke ${channel}:`, error);
    throw error;
  }
}
```

### 2. 事件清理

在组件卸载时清理事件监听器：

```javascript
useEffect(() => {
  const handleUserUpdate = (data) => {
    // 处理用户更新
  };
  
  ipc.on('userUpdated', handleUserUpdate);
  
  return () => {
    ipc.off('userUpdated', handleUserUpdate);
  };
}, []);
```

### 3. 类型安全

使用 TypeScript 定义接口：

```typescript
interface UserInfo {
  name: string;
  phone: string;
  email: string;
}

interface SystemInfo {
  platform: string;
  version: string;
  arch: string;
}

// 在 Server 中
ipc.handle('getUserInfo', async (): Promise<UserInfo> => {
  return {
    name: '张三',
    phone: '13888888888',
    email: 'zhangsan@example.com'
  };
});

// 在 Client 中
const userInfo: UserInfo = await ipc.invoke('getUserInfo');
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本
- 支持基本的 IPC 通信
- 提供 Client 和 Server 实现
- 支持事件系统和方法调用 