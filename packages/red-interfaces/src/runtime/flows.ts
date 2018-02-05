export interface IFlows {
  load(): Promise<any>
  setFlows(_config: any, type: string, muteLog: boolean): Promise<any>
  loadFlows(): Promise<any> // TODO: returns IFlow??
  getNode(id: string): INode
  eachNode(cb: Function)
  getFlows(): IFlow[]

  startFlows(type: string, diff: any, muteLog: boolean): Promise<any>
  stopFlows(type: string, diff: any, muteLog: boolean): Promise<any>
  addFlow(flow: IFlow): Promise<any>
  checkTypeInUse(id: string): void
}
