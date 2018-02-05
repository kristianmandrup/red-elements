export interface IFlow {
  id: string
  label: string
  nodes: any[] // INode[] ??
  subflows: any[] // ISubflow[] or IFlow[]
  configs: any[]

  activeNodes: any
  subflowInstanceNodes: any
  catchNodeMap: any
  statusNodeMap: any

  start(diff)
  stop(stopList)
  update(_global, _flow)
  getNode(id)
  getActiveNodes()
}
