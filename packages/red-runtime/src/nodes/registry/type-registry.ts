/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

//var UglifyJS = require('uglify-js');
import * as util from 'util'

import {
  Node,
  INode
} from '../../node'

import {
  Settings
} from '../../settings'

import {
  Loader
} from './loader'

import {
  Events
} from '../../events'

import {
  Context
} from '../../context'

export interface IRegistry {
  load(): IRegistry
  getModule(id: string): string
  getNode(id: string): string
  saveNodeList(): Promise<any>
  loadNodeConfigs(): any
  addNodeSet(id: string, set, version: string)
  removeNode(id: string)
  removeModule(moduleName: string)
  getNodeInfo(typeOrId: string): INode
  getFullNodeInfo(typeOrId: string): INode
  getNodeList(filter: Function): INode[]
  getModuleList(): string[]
  getModuleInfo(moduleName: string): any // TODO: fix return type
  getCaller()
  inheritNode(constructor: Function)
  registerNodeConstructor(nodeSet: any, type: string, constructor: Function)

  /**
   * Gets all of the node template configs
   * @return all of the node templates in a single string
   */
  getAllNodeConfigs(lang)

  getNodeConfig(id: string, lang: string)


  get(type: string) // alias: getNodeConstructor (TODO: confirm with node-red!)
  getNodeConstructor(type: string)

  clear()
  getTypeId(type: string)
  enableNodeSet(typeOrId: string)
  disableNodeSet(typeOrId: string)
  cleanModuleList()
}

// Service: registry
export class Registry extends Context implements IRegistry {
  nodeConfigCache = null;
  moduleConfigs = {};
  moduleNodes = {};
  nodeTypeToId = {};
  nodeConstructors = {};
  nodeList = [];

  // service injection
  protected node: INode = new Node() // service
  protected settings: any = new Settings()
  protected loader: any = new Loader()
  protected events: any = new Events()

  constructor() {
    super()
  }

  // alias
  get(type: string) {
    return this.getNodeConstructor(type)
  }

  /**
   * Loads node configurations
   */
  load(): IRegistry {
    const {
      settings
    } = this
    let {
      moduleConfigs
    } = this
    const {
      loadNodeConfigs
    } = this.rebind([
        'loadNodeConfigs'
      ])

    if (settings.available()) {
      moduleConfigs = loadNodeConfigs();
    } else {
      moduleConfigs = {};
    }
    return this
  }

  /**
   * TODO: fix typing INode (and expand it with module!)
   * filter Node Info
   * @param n { INode } the node to filter info on
   */
  protected filterNodeInfo(n: INode): INode {
    const r: any = {
      id: n.id || n.module + '/' + n.name,
      name: n.name,
      types: n.types,
      enabled: n.enabled,
      local: n.local || false
    };
    if (n.hasOwnProperty('module')) {
      r.module = n.module;
    }
    if (n.hasOwnProperty('err')) {
      r.err = n.err.toString();
    }
    return r;
  }

  getModule(id: string): string {
    var parts = id.split('/');
    return parts.slice(0, parts.length - 1).join('/');
  }

  getNode(id: string): string {
    var parts = id.split('/');
    return parts[parts.length - 1];
  }

  async saveNodeList(): Promise<any> {
    const {
      moduleConfigs,
      settings
    } = this

    const {
      filterNodeInfo
    } = this.rebind([
        'filterNodeInfo'
      ])

    var moduleList = {};

    for (var module in moduleConfigs) {
      /* istanbul ignore else */
      if (moduleConfigs.hasOwnProperty(module)) {
        if (Object.keys(moduleConfigs[module].nodes).length > 0) {
          if (!moduleList[module]) {
            moduleList[module] = {
              name: module,
              version: moduleConfigs[module].version,
              local: moduleConfigs[module].local || false,
              nodes: {}
            };
          }
          var nodes = moduleConfigs[module].nodes;
          for (var node in nodes) {
            /* istanbul ignore else */
            if (nodes.hasOwnProperty(node)) {
              var config = nodes[node];
              var n = filterNodeInfo(config);
              delete n.err;
              delete n.file;
              delete n.id;
              n.file = config.file;
              moduleList[module].nodes[node] = n;
            }
          }
        }
      }
      return this
    }
    if (settings.available()) {
      return settings.set('nodes', moduleList);
    } else {
      return Promise.reject('Settings unavailable');
    }
  }

  /**
   * TODO: return INodeConfig or similar
   */
  loadNodeConfigs(): any {
    const {
      settings
    } = this

    var configs = settings.get('nodes');

    if (!configs) {
      return {};
    } else if (configs['node-red']) {
      return configs;
    } else {
      // Migrate from the 0.9.1 format of settings
      var newConfigs = {};
      for (var id in configs) {
        /* istanbul ignore else */
        if (configs.hasOwnProperty(id)) {
          var nodeConfig = configs[id];
          var moduleName;
          var nodeSetName;

          if (nodeConfig.module) {
            moduleName = nodeConfig.module;
            nodeSetName = nodeConfig.name.split(':')[1];
          } else {
            moduleName = 'node-red';
            nodeSetName = nodeConfig.name.replace(/^\d+-/, '').replace(/\.js$/, '');
          }

          if (!newConfigs[moduleName]) {
            newConfigs[moduleName] = {
              name: moduleName,
              nodes: {}
            };
          }
          newConfigs[moduleName].nodes[nodeSetName] = {
            name: nodeSetName,
            types: nodeConfig.types,
            enabled: nodeConfig.enabled,
            module: moduleName
          };
        }
      }
      settings.set('nodes', newConfigs);
      return newConfigs;
    }
  }

  addNodeSet(id: string, set: any, version: string) {
    const {
      moduleNodes,
      settings,
      nodeTypeToId,
      moduleConfigs,
      nodeList
    } = this
    let {
      nodeConfigCache
    } = this

    if (!set.err) {
      set.types.forEach(function (t) {
        nodeTypeToId[t] = id;
      });
    }
    moduleNodes[set.module] = moduleNodes[set.module] || [];
    moduleNodes[set.module].push(set.name);

    if (!moduleConfigs[set.module]) {
      moduleConfigs[set.module] = {
        name: set.module,
        nodes: {}
      };
    }

    if (version) {
      moduleConfigs[set.module].version = version;
    }
    moduleConfigs[set.module].local = set.local;

    moduleConfigs[set.module].nodes[set.name] = set;
    nodeList.push(id);
    nodeConfigCache = null;
  }

  removeNode(id: string) {
    const {
      moduleNodes,
      settings,
      nodeTypeToId,
      moduleConfigs,
      nodeList,
      nodeConstructors
    } = this
    let {
      nodeConfigCache
    } = this
    const {
      getModule,
      getNode,
      filterNodeInfo
    } = this.rebind([
        'getModule',
        'getNode',
        'filterNodeInfo'
      ])

    var config = moduleConfigs[getModule(id)].nodes[getNode(id)];
    if (!config) {
      throw new Error('Unrecognised id: ' + id);
    }
    delete moduleConfigs[getModule(id)].nodes[getNode(id)];
    var i = nodeList.indexOf(id);
    if (i > -1) {
      nodeList.splice(i, 1);
    }
    config.types.forEach(function (t) {
      var typeId = nodeTypeToId[t];
      if (typeId === id) {
        delete nodeConstructors[t];
        delete nodeTypeToId[t];
      }
    });
    config.enabled = false;
    config.loaded = false;
    nodeConfigCache = null;

    this.setInstanceVars({
      nodeConfigCache
    })
    return filterNodeInfo(config);
  }

  removeModule(moduleName: string) {
    const {
      moduleNodes,
      settings,
      moduleConfigs
    } = this
    const {
      removeNode,
      saveNodeList,
    } = this.rebind([
        'removeNode',
        'saveNodeList',
      ])

    if (!settings.available()) {
      throw new Error('Settings unavailable');
    }
    var nodes = moduleNodes[moduleName];
    if (!nodes) {
      throw new Error('Unrecognised module: ' + moduleName);
    }
    var infoList = [];
    for (var i = 0; i < nodes.length; i++) {
      infoList.push(removeNode(moduleName + '/' + nodes[i]));
    }
    delete moduleNodes[moduleName];
    delete moduleConfigs[moduleName];
    saveNodeList();
    return infoList;
  }

  getNodeInfo(typeOrId: string): INode {
    const {
      nodeTypeToId,
      moduleConfigs
    } = this
    const {
      getModule,
      getNode,
      filterNodeInfo,
    } = this.rebind([
        'getModule',
        'getNode',
        'filterNodeInfo',
      ])

    var id = typeOrId;
    if (nodeTypeToId.hasOwnProperty(typeOrId)) {
      id = nodeTypeToId[typeOrId];
    }
    /* istanbul ignore else */
    if (id) {
      var module = moduleConfigs[getModule(id)];
      if (module) {
        var config = module.nodes[getNode(id)];
        if (config) {
          var info = filterNodeInfo(config);
          if (config.hasOwnProperty('loaded')) {
            info.loaded = config.loaded;
          }
          info.version = module.version;
          return info;
        }
      }
    }
    return null;
  }

  getFullNodeInfo(typeOrId: string): INode {
    const {
      nodeTypeToId,
      moduleConfigs
    } = this
    const {
      getModule,
      getNode,
    } = this.rebind([
        'getModule',
        'getNode',
      ])

    // Used by index.enableNodeSet so that .file can be retrieved to pass
    // to loader.loadNodeSet
    var id = typeOrId;
    if (nodeTypeToId.hasOwnProperty(typeOrId)) {
      id = nodeTypeToId[typeOrId];
    }
    /* istanbul ignore else */
    if (id) {
      var module = moduleConfigs[getModule(id)];
      if (module) {
        return module.nodes[getNode(id)];
      }
    }
    return null;
  }

  getNodeList(filter: Function): INode[] {
    const {
      moduleConfigs
    } = this
    const {
      filterNodeInfo,
    } = this.rebind([
        'filterNodeInfo'
      ])

    var list = [];
    for (var module in moduleConfigs) {
      /* istanbul ignore else */
      if (moduleConfigs.hasOwnProperty(module)) {
        var nodes = moduleConfigs[module].nodes;
        for (var node in nodes) {
          /* istanbul ignore else */
          if (nodes.hasOwnProperty(node)) {
            var nodeInfo = filterNodeInfo(nodes[node]);
            nodeInfo.version = moduleConfigs[module].version;
            if (!filter || filter(nodes[node])) {
              list.push(nodeInfo);
            }
          }
        }
      }
    }
    return list;
  }

  /**
   * TODO: Fix return type - use interface
   */
  getModuleList(): any {
    //var list = [];
    //for (var module in moduleNodes) {
    //    /* istanbul ignore else */
    //    if (moduleNodes.hasOwnProperty(module)) {
    //        list.push(registry.getModuleInfo(module));
    //    }
    //}
    //return list;
    return this.moduleConfigs;
  }

  /**
   * TODO: add proper return interface
   * @param module
   */
  getModuleInfo(moduleName: string): any {
    const {
      moduleConfigs,
      moduleNodes
    } = this
    const {
      filterNodeInfo,
    } = this.rebind([
        'filterNodeInfo'
      ])

    if (moduleNodes[moduleName]) {
      var nodes = moduleNodes[moduleName];
      var m = {
        name: moduleName,
        version: moduleConfigs[moduleName].version,
        local: moduleConfigs[moduleName].local,
        nodes: []
      };
      for (var i = 0; i < nodes.length; ++i) {
        var nodeInfo = filterNodeInfo(moduleConfigs[moduleName].nodes[nodes[i]]);
        nodeInfo.version = m.version;
        m.nodes.push(nodeInfo);
      }
      return m;
    } else {
      return null;
    }
  }

  getCaller() {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    const stack: any = err.stack;
    Error.prepareStackTrace = orig;
    stack.shift();
    stack.shift();
    return stack[0].getFileName();
  }

  inheritNode(constructor: Function) {
    if (Object.getPrototypeOf(constructor.prototype) === Object.prototype) {
      util.inherits(constructor, Node);
    } else {
      var proto = constructor.prototype;
      while (Object.getPrototypeOf(proto) !== Object.prototype) {
        proto = Object.getPrototypeOf(proto);
      }
      //TODO: This is a partial implementation of util.inherits >= node v5.0.0
      //      which should be changed when support for node < v5.0.0 is dropped
      //      see: https://github.com/nodejs/node/pull/3455
      proto.constructor.super_ = Node;
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(proto, Node.prototype);
      } else {
        // hack for node v0.10
        proto.__proto__ = Node.prototype;
      }
    }
  }

  registerNodeConstructor(nodeSet: any, type: string, constructor: Function) {
    const {
      nodeConstructors,
      events
    } = this
    const {
      inheritNode,
      getFullNodeInfo
    } = this.rebind([
        'inheritNode',
        'getFullNodeInfo'
      ])

    if (nodeConstructors.hasOwnProperty(type)) {
      throw new Error(type + ' already registered');
    }
    //TODO: Ensure type is known - but doing so will break some tests
    //      that don't have a way to register a node template ahead
    //      of registering the constructor
    if (!(constructor.prototype instanceof Node)) {
      inheritNode(constructor);
    }

    var nodeSetInfo = getFullNodeInfo(nodeSet);
    if (nodeSetInfo) {
      if (nodeSetInfo.types.indexOf(type) === -1) {
        // A type is being registered for a known set, but for some reason
        // we didn't spot it when parsing the HTML file.
        // Registered a type is the definitive action - not the presence
        // of an edit template. Ensure it is on the list of known types.
        nodeSetInfo.types.push(type);
      }
    }

    nodeConstructors[type] = constructor;
    events.emit('type-registered', type);
  }

  getAllNodeConfigs(lang) {
    const {
      nodeList,
      moduleConfigs,
      loader
    } = this
    let {
      nodeConfigCache
    } = this
    const {
      getModule,
      getNode
    } = this.rebind([
        'getModule',
        'getNode'
      ])

    if (!nodeConfigCache) {
      var result = '';
      var script = '';
      for (var i = 0; i < nodeList.length; i++) {
        var id = nodeList[i];
        var config = moduleConfigs[getModule(id)].nodes[getNode(id)];
        if (config.enabled && !config.err) {
          result += config.config;
          result += loader.getNodeHelp(config, lang || 'en-US') || '';
          //script += config.script;
        }
      }
      //if (script.length > 0) {
      //    result += '<script type='text/javascript'>';
      //    result += UglifyJS.minify(script, {fromString: true}).code;
      //    result += '</script>';
      //}
      nodeConfigCache = result;
    }

    this.setInstanceVars({
      nodeConfigCache
    })

    return nodeConfigCache;
  }

  getNodeConfig(id: string, lang: string) {
    const {
      moduleConfigs,
      loader
    } = this
    const {
      getModule,
      getNode
    } = this.rebind([
        'getModule',
        'getNode'
      ])


    var config = moduleConfigs[getModule(id)];
    if (!config) {
      return null;
    }
    config = config.nodes[getNode(id)];
    if (config) {
      var result = config.config;
      result += loader.getNodeHelp(config, lang || 'en-US')

      //if (config.script) {
      //    result += '<script type='text/javascript'>'+config.script+'</script>';
      //}
      return result;
    } else {
      return null;
    }
  }

  getNodeConstructor(type: string) {
    const {
      nodeTypeToId,
      moduleConfigs,
      nodeConstructors
    } = this
    const {
      getModule,
      getNode
    } = this.rebind([
        'getModule',
        'getNode'
      ])

    var id = nodeTypeToId[type];

    var config;
    if (typeof id === 'undefined') {
      config = undefined;
    } else {
      config = moduleConfigs[getModule(id)].nodes[getNode(id)];
    }

    if (!config || (config.enabled && !config.err)) {
      return nodeConstructors[type];
    }
    return null;
  }

  clear() {
    this.nodeConfigCache = null;
    this.moduleConfigs = {};
    this.nodeList = [];
    this.nodeConstructors = {};
    this.nodeTypeToId = {};
  }

  getTypeId(type: string) {
    const {
      nodeTypeToId,
    } = this

    if (nodeTypeToId.hasOwnProperty(type)) {
      return nodeTypeToId[type];
    } else {
      return null;
    }
  }

  enableNodeSet(typeOrId: string) {
    const {
      settings,
      nodeTypeToId,
      moduleConfigs
    } = this
    const {
      getModule,
      getNode,
      saveNodeList,
      filterNodeInfo
    } = this.rebind([
        'getModule',
        'getNode',
        'saveNodeList',
        'filterNodeInfo'
      ])

    if (!settings.available()) {
      throw new Error('Settings unavailable');
    }

    var id = typeOrId;
    if (nodeTypeToId.hasOwnProperty(typeOrId)) {
      id = nodeTypeToId[typeOrId];
    }
    var config;
    try {
      config = moduleConfigs[getModule(id)].nodes[getNode(id)];
      delete config.err;
      config.enabled = true;

      // SET
      this.nodeConfigCache = null;

      return saveNodeList().then(() => {
        return filterNodeInfo(config);
      });
    } catch (err) {
      throw new Error('Unrecognised id: ' + typeOrId);
    }
  }

  disableNodeSet(typeOrId: string) {
    const {
      settings,
      nodeTypeToId,
      moduleConfigs
    } = this
    const {
      getModule,
      getNode,
      saveNodeList,
      filterNodeInfo
    } = this.rebind([
        'getModule',
        'getNode',
        'saveNodeList',
        'filterNodeInfo'
      ])

    if (!settings.available()) {
      throw new Error('Settings unavailable');
    }
    var id = typeOrId;
    if (nodeTypeToId.hasOwnProperty(typeOrId)) {
      id = nodeTypeToId[typeOrId];
    }
    var config;
    try {
      config = moduleConfigs[getModule(id)].nodes[getNode(id)];
      // TODO: persist setting
      config.enabled = false;

      // SET
      this.nodeConfigCache = null;
      return saveNodeList().then(function () {
        return filterNodeInfo(config);
      });
    } catch (err) {
      throw new Error('Unrecognised id: ' + id);
    }
  }

  cleanModuleList() {
    const {
      moduleConfigs,
      moduleNodes
    } = this
    const {
      removeNode,
      saveNodeList
    } = this.rebind([
        'removeNode',
        'saveNodeList'
      ])

    var removed = false;
    for (var mod in moduleConfigs) {
      /* istanbul ignore else */
      if (moduleConfigs.hasOwnProperty(mod)) {
        var nodes = moduleConfigs[mod].nodes;
        var node;
        if (mod == 'node-red') {
          // For core nodes, look for nodes that are enabled, !loaded and !errored
          for (node in nodes) {
            /* istanbul ignore else */
            if (nodes.hasOwnProperty(node)) {
              var n = nodes[node];
              if (n.enabled && !n.err && !n.loaded) {
                removeNode(mod + '/' + node);
                removed = true;
              }
            }
          }
        } else {
          if (moduleConfigs[mod] && !moduleNodes[mod]) {
            // For node modules, look for missing ones
            for (node in nodes) {
              /* istanbul ignore else */
              if (nodes.hasOwnProperty(node)) {
                removeNode(mod + '/' + node);
                removed = true;
              }
            }
            delete moduleConfigs[mod];
          }
        }
      }
    }
    if (removed) {
      saveNodeList();
    }
  }
}






