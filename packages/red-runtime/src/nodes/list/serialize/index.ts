import {
  Nodes
} from '../nodes'

import {
  Importer
} from './importer'

import {
  Exporter
} from './exporter'

interface IImmporter {
  importNodes: Function
}

interface IExporter {
  createExportableNodeSet: Function
  createCompleteNodeSet: Function
}

export class Serializer {
  public importer: IImmporter
  public exporter: IExporter

  /**
   *
   * @param nodes
   *
   * TODO: use @injectable decorator for importer and exporter
   */
  constructor(public nodes: Nodes) {
    this.importer = new Importer(this.nodes)
    this.exporter = new Exporter(this.nodes)
  }

  // use Importer
  importNodes(newNodesObj: string, createNewIds: boolean, createMissingWorkspace: boolean) {
    return this.importer.importNodes(newNodesObj, createNewIds, createMissingWorkspace)
  }

  // use Exporter
  createExportableNodeSet(set: Node[], exportedSubflows: object, exportedConfigNodes: object) {
    this.exporter.createExportableNodeSet(set, exportedSubflows, exportedConfigNodes)
  }

  // use Exporter
  createCompleteNodeSet(exportCredentials: boolean) {
    this.exporter.createCompleteNodeSet(exportCredentials)
  }

}
