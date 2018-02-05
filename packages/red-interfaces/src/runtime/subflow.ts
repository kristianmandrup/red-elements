export interface ISubflow extends INode {
  refresh(bool: boolean)
  removeOutput(removedSubflowOutputs: any[])
  removeInput()
  removeSubflow(...args)
}
