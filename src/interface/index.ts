export interface IPCInVokeData {
  type: IIPCType; // 调用类型 
  channel: string; // 事件名
  requestId: string;
  args: any;
}

export interface IPCEventData {
  type: IIPCType;
  event: string;
  requestId: string;
  data: any;
}

export enum IIPCType {
  IPC_INVOKE = 'ipc_invoke',
  IPC_EVENT = 'ipc-event', // 用于emit
  IPC_REPLY = 'ipc_reply',
  IPC_ERROR = 'ipc_error',
}
