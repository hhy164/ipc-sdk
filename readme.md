## h5
```js
import IPCH5 from './dist/IPCH5.js';
const ipc = new IPCH5();
// 注册方法供iframe调用
ipc.handle('init',(params)=>{
  return {
    a:xxx,
    b:xxx
  }
})

// 抛出事件
ipc.emit('loaded',{
  name:'h5',
  versiont:'1.0'
})
```

## iframe
```js
const IPCIframe from './dist/IPCIframe.js';
const ipc = new IPCIframe(window);
const result = await ipc.invoke('init',{
  name:'iframe',
  version:'1.0.0'
})
// 事件监听
ipc.on('loaded',(params)=>{
  console.log(params)
})
```

## off功能取消事件监听
## invoke如果需要返回值，那么应该支持promise