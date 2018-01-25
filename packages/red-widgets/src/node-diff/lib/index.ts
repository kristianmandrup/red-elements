import {
  Context,
  EditableList
} from '../../common'

import { log } from 'util';
import { FlowsApi } from '@tecla5/red-runtime/src';
import { FlowsLoader } from './flows-loader';
import { DiffPanel } from './diff-panel';
import { DiffResolver } from './diff-resolver';
import { DiffGenerator } from './diff-generator';
import { DiffMerger } from './diff-merger';
import { NodesParser } from './nodes-parser';
import { DiffDisplayer } from './diff-displayer';

export class Diff extends Context {
  public currentDiff: any = {};
  public diffVisible: Boolean = false;
  public diffList: any
  public value: any

  protected flowsLoader: FlowsLoader = new FlowsLoader(this)
  protected diffPanel: DiffPanel = new DiffPanel(this)
  protected diffResolver: DiffResolver = new DiffResolver(this)
  protected diffGenerator: DiffGenerator = new DiffGenerator(this)
  protected diffMerger: DiffMerger = new DiffMerger(this)
  protected nodesParser: NodesParser = new NodesParser(this)
  protected diffDisplayer: DiffDisplayer = new DiffDisplayer(this)

  constructor() {
    super()
    const { RED } = this

    new EditableList()

    let {
      showRemoteDiff
    } = this.rebind([
        'showRemoteDiff'
      ])
    // var diffList;
    // RED.actions.add("core:show-current-diff",showLocalDiff);
    RED.actions.add("core:show-remote-diff", showRemoteDiff);
    // RED.keyboard.add("*","ctrl-shift-l","core:show-current-diff");
    RED.keyboard.add("*", "ctrl-shift-r", "core:show-remote-diff");
  }

  // API
  // return {
  //   getRemoteDiff: getRemoteDiff,
  //   showRemoteDiff: showRemoteDiff,
  //   mergeDiff: mergeDiff
  // }

  // use builder.diffPanel
  buildDiffPanel(container) {
    this.diffPanel.buildDiffPanel(container)
  }

  async getRemoteDiff() {
    return await this.loadFlows()
  }

  async loadFlows() {
    return await this.flowsLoader.loadFlows()
  }


  //  showLocalDiff() {
  //     var nns = RED.nodes.createCompleteNodeSet();
  //     var originalFlow = RED.nodes.originalFlow();
  //     var diff = generateDiff(originalFlow,nns);
  //     showDiff(diff);
  // }

  async showRemoteDiff(diff) {
    diff = diff || await this.getRemoteDiff();
    this.showDiff(diff)
  }

  /**
   * use NodesParser
   * @param nodeList
   */
  parseNodes(nodeList) {
    return this.nodesParser.parseNodes(nodeList)
  }

  /**
   * use DiffGenerator
   * @param currentNodes
   * @param newNodes
   */
  generateDiff(currentNodes, newNodes) {
    return this.diffGenerator.generateDiff(currentNodes, newNodes)
  }

  /**
   * use DiffResolver
   * @param localDiff
   * @param remoteDiff
   */
  resolveDiffs(localDiff: any, remoteDiff: any) {
    return this.diffResolver.resolveDiffs(localDiff, remoteDiff)
  }

  /**
   * TODO: use DiffDisplayer
   * Display nodes difference
   * @param diff {} Nodes differnce
   */
  showDiff(diff: any) {
    this.diffDisplayer.showDiff(diff)
  }

  /**
   * TODO: use DiffMerger
   * @params diff {} Nodes differnce
   */
  mergeDiff(diff: any) {
    this.diffMerger.mergeDiff(diff)
  }
}
