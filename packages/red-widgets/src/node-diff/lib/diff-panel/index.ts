import { Diff } from '../index'
import { DiffPanelUtils } from './utils';
import { NodeDiffRow } from './diff-row';
import { NodePropertiesTable } from './properties-table';
import { NodeConflict } from './node-conflict';
import { PanelBuilder } from './builder';

import {
  Context,
  container,
  delegateTarget,
  delegateTo,
  delegator
} from '../_base'

export interface IDiffPanel {
  /**
     * build Diff Panel
     * @param container
     */
  buildDiffPanel(container)

  /**
   * create Node Icon
   * @param node
   * @param def
   */
  createNodeIcon(node, def)

  /**
  * create Node
  * @param node
  * @param def
  */
  createNode(node, def)

  /**
   * create Node Properties Table
   * @param def
   * @param node
   * @param localNodeObj
   * @param remoteNodeObj
   */
  createNodePropertiesTable(def, node, localNodeObj, remoteNodeObj)

  /**
   * create Node Conflict RadioBoxes
   * @param node
   * @param row
   * @param localDiv
   * @param remoteDiv
   * @param propertiesTable
   * @param hide
   * @param state
   */
  createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state)
}

/**
 *
 */
@delegator({
  container,
})
export class DiffPanel extends Context implements IDiffPanel {

  protected nodeConflict: NodeConflict //= new NodeConflict(this)
  protected propTable: NodePropertiesTable //= new NodePropertiesTable(this)
  protected diffRow: NodeDiffRow //= new NodeDiffRow(this)
  protected utils: DiffPanelUtils //= new DiffPanelUtils(this)
  protected builder: PanelBuilder //= new PanelBuilder(this)

  constructor(public diff: Diff) {
    super()
  }

  /**
   * build Diff Panel
   * @param container
   */
  @delegateTo('builder')
  buildDiffPanel(container) {
    //this.builder.buildDiffPanel(container)
  }

  /**
   * create Node Icon
   * @param node
   * @param def
   */
  @delegateTo('utils')
  createNodeIcon(node, def) {
    //this.utils.createNodeIcon(node, def)
  }

  /**
   * create Node
   * @param node
   * @param def
   */
  @delegateTo('utils')
  createNode(node, def) {
    //this.utils.createNode(node, def)
  }

  /**
   * create Node Properties Table
   * @param def
   * @param node
   * @param localNodeObj
   * @param remoteNodeObj
   */
  @delegateTo('propTable')
  createNodePropertiesTable(def, node, localNodeObj, remoteNodeObj) {
    //this.propTable.createNodePropertiesTable(def, node, localNodeObj, remoteNodeObj)
  }

  /**
   * create Node Conflict RadioBoxes
   * @param node
   * @param row
   * @param localDiv
   * @param remoteDiv
   * @param propertiesTable
   * @param hide
   * @param state
   */
  @delegateTo('nodeConflict')
  createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state) {
    //this.nodeConflict.createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state)
  }
}
