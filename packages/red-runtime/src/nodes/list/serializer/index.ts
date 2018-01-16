import {
  Context,
} from '../../../context'

import {
  INodes
} from '../'

import {
  Importer,
  IImporter
} from './importer'

import {
  Exporter,
  IExporter
} from './exporter'

import {
  INode
} from '../../../interfaces'

export interface ISerializer {
  importNodes(newNodesObj: string, createNewIds?: boolean, createMissingWorkspace?: boolean)
  createExportableNodeSet(set: INode[], exportedSubflows: object, exportedConfigNodes: object)
  createCompleteNodeSet(exportCredentials: boolean)
}


export class Serializer extends Context {
  public importer: IImporter
  public exporter: IExporter

  /**
   *
   * @param nodes
   *
   * TODO: use @injectable decorator for importer and exporter
   */
  constructor(public nodes: INodes) {
    super()
    this.importer = new Importer(this.nodes)
    this.exporter = new Exporter(this.nodes)
  }

  /**
   * Converts the current node selection to an exportable JSON Object
   * @param set { Node[] } set of nodes to export
   * @param exportedSubflows { object } map of subflows by ID to be exported
   * @param exportedConfigNodes { object } map of config nodes by ID to be exported
   */
  createExportableNodeSet(set: INode[], exportedSubflows: object, exportedConfigNodes: object) {
    return this.exporter.createExportableNodeSet(set, exportedSubflows, exportedConfigNodes)
  }

  /**
   * Create a complete node set for export
   * @param exportCredentials { boolean } whether credentials should also be exported
   */
  createCompleteNodeSet(exportCredentials: boolean) {
    return this.exporter.createCompleteNodeSet(exportCredentials)
  }


  /**
   * Import nodes from a string (JSON serialization) reprepresentation
   * @param newNodesObj { Node } the node definitions to import
   * @param createNewIds { boolean } create IDs of imported nodes if not in import definitions
   * @param createMissingWorkspace { boolean } create missing workspace if no such workspace exists
   */
  importNodes(newNodesObj: string, createNewIds?: boolean, createMissingWorkspace?: boolean) {
    return this.importer.importNodes(newNodesObj, createNewIds, createMissingWorkspace)
  }
}
