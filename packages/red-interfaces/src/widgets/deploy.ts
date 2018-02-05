export interface IDeploy {
  deploymentType: string
  deployInflight: boolean
  currentDiff: any
  lastDeployAttemptTime: Date


  /**
   * Configure Deploy
   */
  configure(options)

  /**
   * change Deployment Type
   */
  changeDeploymentType(type)

  /**
   * save Flows (async)
   */
  saveFlows(skipValidation, force): Promise<any>

  /**
   * deploy Nodes (async)
   */
  deployNodes(nodes): Promise<any>

  /**
   * get Node Info
   */
  getNodeInfo(node)
  /**
   * Resolve deploy conflict
   *
   * TODO: handle error if any element required is not found on page
   *
   * @param currentNodes
   * @param activeDeploy
   */
  resolveConflict(currentNodes, activeDeploy)
}
