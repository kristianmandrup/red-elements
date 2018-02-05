export interface INodeDiff {
  buildDiffPanel(container)
  getRemoteDiff(): Promise<any>
  loadFlows(): Promise<any>
  //  showLocalDiff() {
  //     var nns = RED.nodes.createCompleteNodeSet();
  //     var originalFlow = RED.nodes.originalFlow();
  //     var diff = generateDiff(originalFlow,nns);
  //     showDiff(diff);
  // }

  showRemoteDiff(diff): Promise<any>
  /**
   * use NodesParser
   * @param nodeList
   */
  parseNodes(nodeList)
  /**
   * use DiffGenerator
   * @param currentNodes
   * @param newNodes
   */
  generateDiff(currentNodes, newNodes)
  /**
   * use DiffResolver
   * @param localDiff
   * @param remoteDiff
   */
  resolveDiffs(localDiff: any, remoteDiff: any)
  /**
   * TODO: use DiffDisplayer
   * Display nodes difference
   * @param diff {} Nodes differnce
   */
  showDiff(diff: any)
  /**
   * TODO: use DiffMerger
   * @params diff {} Nodes differnce
   */
  mergeDiff(diff: any)
}
