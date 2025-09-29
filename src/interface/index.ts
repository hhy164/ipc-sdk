export interface ITransport {
  send(data: IPCData): void;
  onMessage(callback: (data: IPCData) => void): void;
}

export interface IPCData {

}