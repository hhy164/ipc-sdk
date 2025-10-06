# h5-iframe-ipc

<div align="center">

[![npm version](https://img.shields.io/npm/v/h5-iframe-ipc.svg)](https://www.npmjs.com/package/h5-iframe-ipc)
[![license](https://img.shields.io/npm/l/h5-iframe-ipc.svg)](https://github.com/hhy164/ipc-sdk/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/h5-iframe-ipc.svg)](https://www.npmjs.com/package/h5-iframe-ipc)

一个轻量级、类型安全的 H5 与 iframe 双向通信 SDK

</div>

## ✨ 特性

- 🚀 **轻量级**：零依赖，gzip 后仅 ~2KB
- 🔒 **类型安全**：完整的 TypeScript 类型定义
- 📡 **双向通信**：支持父页面 ↔ 子页面（H5）双向消息传递
- 🎯 **Promise 支持**：invoke 方法支持 Promise，轻松处理异步操作
- 📢 **事件系统**：内置事件监听和发射机制（on/off/emit）
- 🧹 **资源管理**：提供 destroy 方法，避免内存泄漏
- 🔧 **简单易用**：API 设计简洁直观，5 分钟快速上手

## 📦 安装

```bash
# npm
npm install h5-iframe-ipc

# yarn
yarn add h5-iframe-ipc

# pnpm
pnpm add h5-iframe-ipc
```

## 🚀 快速开始

### H5 子页面（在 iframe 内运行）

H5 页面使用 `IPCH5` 类，运行在 iframe 内部。

```javascript
import { IPCH5 } from 'h5-iframe-ipc';

// 创建 IPC 实例
const ipc = new IPCH5();

// 注册方法供父页面调用
ipc.handle('getUserInfo', (params) => {
  return {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
  };
});

// 监听来自父页面的事件
ipc.on('parentReady', (data) => {
  console.log('父页面已就绪:', data);
});

// 向父页面发送事件
ipc.emit('h5Loaded', {
  timestamp: Date.now(),
  version: '1.0.0'
});
```

### iframe 父页面（包含 iframe 标签）

父页面使用 `IPCIframe` 类，需要传入 iframe 的 contentWindow。

```javascript
import { IPCIframe } from 'h5-iframe-ipc';

// 获取 iframe 元素
const iframe = document.getElementById('myIframe');

// 创建 IPC 实例（传入 iframe 的 contentWindow）
const ipc = new IPCIframe(iframe.contentWindow);

// 调用 H5 注册的方法（支持 async/await）
async function fetchUserInfo() {
  try {
    const userInfo = await ipc.invoke('getUserInfo', {
      userId: '12345'
    });
    console.log('用户信息:', userInfo);
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
}

// 监听来自 H5 的事件
ipc.on('h5Loaded', (data) => {
  console.log('H5 页面已加载:', data);
});

// 向 H5 发送事件
ipc.emit('parentReady', {
  status: 'ready',
  version: '1.0.0'
});
```

## 📖 API 文档

### IPCH5

H5 子页面（运行在 iframe 内）使用的 IPC 实例。

#### 构造函数

```typescript
const ipc = new IPCH5();
```

无需传参，自动通过 `window.parent` 与父页面通信。

#### 方法

##### `handle(channel: string, callback: Function): void`

注册一个方法，供父页面通过 `invoke` 调用。

**参数：**
- `channel` - 方法通道名称
- `callback` - 回调函数，可以返回任意值或 Promise

**示例：**
```javascript
// 同步返回
ipc.handle('getConfig', (params) => {
  return { theme: 'dark', language: 'zh-CN' };
});

// 异步返回（Promise）
ipc.handle('fetchData', async (params) => {
  const response = await fetch('/api/data');
  return response.json();
});
```

##### `on(eventName: string, callback: Function): void`

监听来自父页面的事件。

**参数：**
- `eventName` - 事件名称
- `callback` - 事件处理函数

**示例：**
```javascript
ipc.on('themeChanged', (data) => {
  console.log('主题已切换:', data);
});
```

##### `off(eventName: string, callback?: Function): void`

移除事件监听。

**参数：**
- `eventName` - 事件名称
- `callback` - （可选）要移除的具体回调函数，不传则移除该事件的所有监听

**示例：**
```javascript
const handler = (data) => console.log(data);

// 添加监听
ipc.on('myEvent', handler);

// 移除特定监听
ipc.off('myEvent', handler);

// 移除该事件的所有监听
ipc.off('myEvent');
```

##### `emit(eventName: string, params: any): void`

向父页面发送事件。

**参数：**
- `eventName` - 事件名称
- `params` - 事件数据

**示例：**
```javascript
ipc.emit('userAction', {
  type: 'click',
  target: 'submitButton'
});
```

##### `destroy(): void`

销毁 IPC 实例，清理所有监听器和处理器。

**示例：**
```javascript
// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  ipc.destroy();
});
```

---

### IPCIframe

iframe 父页面使用的 IPC 实例。

#### 构造函数

```typescript
const iframe = document.getElementById('myIframe');
const ipc = new IPCIframe(iframe.contentWindow);
```

**参数：**
- `win` - iframe 的 contentWindow 对象

**示例：**
```javascript
// 方式一：通过 getElementById
const iframe = document.getElementById('myIframe');
const ipc = new IPCIframe(iframe.contentWindow);

// 方式二：通过 querySelector
const iframe = document.querySelector('#myIframe');
const ipc = new IPCIframe(iframe.contentWindow);

// 方式三：监听 iframe 加载后初始化
const iframe = document.getElementById('myIframe');
iframe.onload = () => {
  const ipc = new IPCIframe(iframe.contentWindow);
};
```

#### 方法

##### `invoke(channel: string, params: any): Promise<any>`

调用 H5 注册的方法，返回 Promise。

**参数：**
- `channel` - 方法通道名称
- `params` - 传递的参数

**返回：**
- `Promise<any>` - 返回 H5 处理函数的结果

**示例：**
```javascript
// 基本用法
const result = await ipc.invoke('getData', { id: 123 });

// 错误处理
try {
  const user = await ipc.invoke('getUserInfo', { userId: '456' });
  console.log(user);
} catch (error) {
  console.error('调用失败:', error);
}
```

##### `on(eventName: string, callback: Function): void`

监听来自 H5 的事件。

**参数：**
- `eventName` - 事件名称
- `callback` - 事件处理函数

**示例：**
```javascript
ipc.on('h5Ready', (data) => {
  console.log('H5 已就绪:', data);
});
```

##### `off(eventName: string, callback?: Function): void`

移除事件监听。

**参数：**
- `eventName` - 事件名称
- `callback` - （可选）要移除的具体回调函数

**示例：**
```javascript
const handler = (data) => console.log(data);

// 添加监听
ipc.on('update', handler);

// 移除特定监听
ipc.off('update', handler);

// 移除所有监听
ipc.off('update');
```

##### `emit(eventName: string, params: any): void`

向 H5 发送事件。

**参数：**
- `eventName` - 事件名称
- `params` - 事件数据

**示例：**
```javascript
ipc.emit('notification', {
  type: 'success',
  message: '操作成功'
});
```

##### `destroy(): void`

销毁 IPC 实例，清理所有监听器和待处理的 Promise。

**示例：**
```javascript
// 组件卸载时清理
componentWillUnmount() {
  ipc.destroy();
}
```

## 🎯 完整示例

### 场景：用户登录流程

#### H5 子页面（login.html - 运行在 iframe 内）

```javascript
import { IPCH5 } from 'h5-iframe-ipc';

class LoginPage {
  constructor() {
    this.ipc = new IPCH5();
    this.init();
  }

  init() {
    // 注册登录方法供父页面调用
    this.ipc.handle('login', async (credentials) => {
      const { username, password } = credentials;
      
      // 调用后端 API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('登录失败');
      }

      const result = await response.json();
      
      // 通知父页面登录成功
      this.ipc.emit('loginSuccess', result.user);
      
      return result;
    });

    // 注册获取配置方法
    this.ipc.handle('getLoginConfig', () => {
      return {
        enableSocialLogin: true,
        supportedProviders: ['wechat', 'alipay'],
        locale: 'zh-CN'
      };
    });

    // 监听父页面的主题变化
    this.ipc.on('themeChanged', (theme) => {
      console.log('主题已切换:', theme);
      this.applyTheme(theme);
    });

    // 监听初始数据
    this.ipc.on('initData', (data) => {
      console.log('接收到初始数据:', data);
      this.applyTheme(data.theme);
    });

    // 通知父页面 H5 已就绪
    this.ipc.emit('h5Ready', {
      version: '1.0.0',
      timestamp: Date.now()
    });
  }

  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
  }

  destroy() {
    this.ipc.destroy();
  }
}

// 创建实例
const loginPage = new LoginPage();

// 绑定表单提交
document.querySelector('#loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  
  // 可以在 H5 内部直接调用注册的方法，也可以等父页面调用
  try {
    const result = await loginPage.ipc.invoke('login', { username, password });
    console.log('登录成功:', result);
  } catch (error) {
    console.error('登录失败:', error);
  }
});
```

#### iframe 父页面（index.html - 包含 iframe）

```html
<!DOCTYPE html>
<html>
<head>
  <title>父页面</title>
</head>
<body>
  <!-- iframe 嵌入 H5 页面 -->
  <iframe id="loginIframe" src="login.html" width="100%" height="600px"></iframe>
  
  <script type="module">
    import { IPCIframe } from 'h5-iframe-ipc';

    class ParentPage {
      constructor() {
        this.iframe = document.getElementById('loginIframe');
        this.initIframe();
      }

      initIframe() {
        // 等待 iframe 加载完成
        this.iframe.onload = () => {
          // 创建 IPC 实例
          this.ipc = new IPCIframe(this.iframe.contentWindow);
          this.init();
        };
      }

      async init() {
        // 获取 H5 的配置
        const config = await this.ipc.invoke('getLoginConfig', {});
        console.log('H5 配置:', config);

        // 监听 H5 就绪事件
        this.ipc.on('h5Ready', (data) => {
          console.log('H5 已就绪:', data);
          
          // 向 H5 发送初始数据
          this.ipc.emit('initData', {
            theme: 'light',
            apiUrl: 'https://api.example.com'
          });
        });

        // 监听登录成功事件
        this.ipc.on('loginSuccess', (user) => {
          console.log('用户登录成功:', user);
          this.updateUserInfo(user);
        });

        // 可以从父页面主动调用 H5 的登录方法
        this.bindParentLoginButton();
      }

      bindParentLoginButton() {
        document.getElementById('parentLoginBtn')?.addEventListener('click', async () => {
          try {
            const result = await this.ipc.invoke('login', {
              username: 'testuser',
              password: 'password123'
            });
            console.log('通过父页面调用登录成功:', result);
          } catch (error) {
            console.error('登录失败:', error);
          }
        });
      }

      updateUserInfo(user) {
        // 更新父页面 UI
        document.getElementById('username').textContent = user.name;
      }

      changeTheme(theme) {
        // 通知 H5 切换主题
        this.ipc.emit('themeChanged', theme);
      }

      destroy() {
        this.ipc.destroy();
      }
    }

    // 创建实例
    const parentPage = new ParentPage();
  </script>
</body>
</html>
```

## 🔧 TypeScript 支持

本 SDK 使用 TypeScript 编写，提供完整的类型定义。

```typescript
import { IPCH5, IPCIframe, IPCType } from 'h5-iframe-ipc';

// H5 子页面
const h5Ipc: IPCH5 = new IPCH5();

// 自定义类型
interface UserInfo {
  name: string;
  age: number;
  email: string;
}

h5Ipc.handle('getUserInfo', async (): Promise<UserInfo> => {
  return {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
  };
});

// iframe 父页面
const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
const parentIpc: IPCIframe = new IPCIframe(iframe.contentWindow!);

// 调用时可以指定返回类型
const userInfo = await parentIpc.invoke<UserInfo>('getUserInfo', {});
console.log(userInfo.name); // TypeScript 会有类型提示
```

## ⚠️ 注意事项

### 1. iframe 加载时机

必须等待 iframe 加载完成后再创建 `IPCIframe` 实例：

```javascript
// ✅ 正确
const iframe = document.getElementById('myIframe');
iframe.onload = () => {
  const ipc = new IPCIframe(iframe.contentWindow);
};

// ❌ 错误 - iframe 可能还未加载完成
const iframe = document.getElementById('myIframe');
const ipc = new IPCIframe(iframe.contentWindow); // contentWindow 可能为 null
```

### 2. 内存泄漏

在组件或页面销毁时，务必调用 `destroy()` 方法清理资源：

```javascript
// React 示例
useEffect(() => {
  const iframe = document.getElementById('myIframe');
  let ipc;
  
  iframe.onload = () => {
    ipc = new IPCIframe(iframe.contentWindow);
  };
  
  return () => {
    ipc?.destroy(); // 清理
  };
}, []);

// Vue 3 示例
import { onMounted, onUnmounted } from 'vue';

let ipc = null;

onMounted(() => {
  const iframe = document.getElementById('myIframe');
  iframe.onload = () => {
    ipc = new IPCIframe(iframe.contentWindow);
  };
});

onUnmounted(() => {
  ipc?.destroy();
});
```

### 3. 错误处理

`invoke` 方法返回 Promise，务必处理可能的错误：

```javascript
try {
  const result = await ipc.invoke('someMethod', params);
  // 处理成功结果
} catch (error) {
  console.error('调用失败:', error);
  // 错误处理逻辑
}
```

### 4. 事件监听器管理

避免重复添加相同的监听器，必要时使用 `off` 方法移除：

```javascript
const handler = (data) => console.log(data);

// 添加前先移除（确保不会重复添加）
ipc.off('myEvent', handler);
ipc.on('myEvent', handler);
```

### 5. IPCIframe 构造函数参数

创建 `IPCIframe` 实例时，必须传入 iframe 的 contentWindow：

```javascript
// ✅ 正确
const iframe = document.getElementById('myIframe');
const ipc = new IPCIframe(iframe.contentWindow);

// ❌ 错误
const ipc = new IPCIframe(window); // 这是错误的
const ipc = new IPCIframe(window.parent); // 这也是错误的
```

### 6. 跨域安全（可选优化）

当前版本使用 `postMessage` 的 `'*'` 作为目标源，开发环境很方便，但生产环境建议指定具体域名以提高安全性。

## 🏗️ 架构说明

```
┌─────────────────────────────────────┐
│      iframe 父页面 (Parent)          │
│                                     │
│   import { IPCIframe }              │
│   const ipc = new IPCIframe(        │
│     iframe.contentWindow            │
│   )                                 │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  <iframe src="h5.html">     │   │
│   │                             │   │
│   │  H5 子页面 (Child)           │   │
│   │                             │   │
│   │  import { IPCH5 }           │   │
│   │  const ipc = new IPCH5()    │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘

通信流程：
父页面 → ipc.invoke() → H5.handle()
父页面 ← H5.emit() ← H5 子页面
父页面 → ipc.emit() → H5.on()
父页面 ← ipc.on() ← H5.emit()
```

## 🌐 浏览器兼容性

支持所有支持 `postMessage` API 的现代浏览器：

- ✅ Chrome / Edge (Chromium) >= 60
- ✅ Firefox >= 55
- ✅ Safari >= 11
- ✅ iOS Safari >= 11
- ✅ Android WebView >= 60

## 📚 相关文档

- [postMessage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
- [HTMLIFrameElement.contentWindow](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement/contentWindow)
- [iframe 通信最佳实践](https://web.dev/cross-window-communication/)

## 🐛 问题反馈

如果你发现任何问题或有改进建议，欢迎提交 Issue：

- [GitHub Issues](https://github.com/hhy164/ipc-sdk/issues)

## 🤝 贡献

欢迎提交 Pull Request！在提交之前，请确保：

1. 代码通过 TypeScript 编译
2. 遵循项目代码风格
3. 添加必要的注释

## 📄 许可证

[MIT](./LICENSE) © hehongyu

## 🔗 相关链接

- [npm 包地址](https://www.npmjs.com/package/h5-iframe-ipc)
- [GitHub 仓库](https://github.com/hhy164/ipc-sdk)
- [问题反馈](https://github.com/hhy164/ipc-sdk/issues)

---

如果这个项目对你有帮助，欢迎 ⭐ Star 支持一下！
