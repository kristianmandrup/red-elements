import {
  Registry
} from '../../../..'
import { expectObj } from '../../../_infra/helpers';

function create() {
  return new Registry()
}

let registry
beforeEach(() => {
  registry = create()
})

test('Registry: create', () => {
  expectObj(registry)
})

// TODO: Add tests for all these

// load(): IRegistry
// getModule(id: string): string
// getNode(id: string): string
// saveNodeList(): Promise<any>
// loadNodeConfigs(): any
// addNodeSet(id: string, set, version: string)
// removeNode(id: string)
// removeModule(moduleName: string)
// getNodeInfo(typeOrId: string): INode
// getFullNodeInfo(typeOrId: string): INode
// getNodeList(filter: Function): INode[]
// getModuleList(): string[]
// getModuleInfo(moduleName: string): any // TODO: fix return type
// getCaller()
// inheritNode(constructor: Function)
// registerNodeConstructor(nodeSet: any, type: string, constructor: Function)
// getAllNodeConfigs(lang)
// getNodeConfig(id: string, lang: string)
// get(type: string) // alias: getNodeConstructor (TODO: confirm with node-red!)
// getNodeConstructor(type: string)
// clear()
// getTypeId(type: string)
// enableNodeSet(typeOrId: string)
// disableNodeSet(typeOrId: string)
// cleanModuleList()
