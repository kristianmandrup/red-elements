import {
  Context,
  $
} from '../context'

import {
  NodesRegistry
} from './registry'

export {
  NodesRegistry
}

interface Link {
  source: any,
  target: any
}

interface NodeDef {
  defaults: Object,
  credentials?: Object,
  category?: string
}

interface Node {
  id: string,
  name: string,
  info?: string,
  type: string,
  credentials?: any,
  in: any[],
  out: any[],
  inputs: number,
  outputs: number,
  inputLabels: string[],
  outputLabels: string[],
  _orig: any,
  _def: NodeDef,
  x: number,
  y: number,
  z: number
}

interface Subflow extends Node {
}


const { log } = console

export class Nodes extends Context {
  public registry = new NodesRegistry()
  public configNodes = {
    users: {}
  }
  public nodes = []
  public links = []
  public workspaces = {}
  public workspacesOrder = []
  public subflows = {}
  public n = null // {}
  public initialLoad = null // {}
  public loadedFlowVersion
  public defaultWorkspace = {}

  public setNodeList: Function
  public getNodeSet: Function
  public addNodeSet: Function
  public removeNodeSet: Function
  public enableNodeSet: Function
  public disableNodeSet: Function
  public registerType: Function
  public getType: Function

  constructor() {
    super()

    const {
      RED,
      registry,
      configNodes,
      nodes,
    } = this

    const {
      convertNode,
      importNodes
    } = this.rebind([
        'convertNode',
        'importNodes'
      ])

    this._validateObj(RED.events, 'RED.events', 'Nodes constructor')

    RED.events.on("registry:node-type-added", function (type) {
      var def = registry.getNodeType(type);
      var replaced = false;
      var replaceNodes = [];

      this._validateObj(RED.nodes, 'RED.nodes', 'Nodes events.on handler')

      RED.nodes.eachNode(function (n) {
        if (n.type === "unknown" && n.name === type) {
          replaceNodes.push(n);
        }
      });
      RED.nodes.eachConfig(function (n) {
        if (n.type === "unknown" && n.name === type) {
          replaceNodes.push(n);
        }
      });

      if (replaceNodes.length > 0) {
        var reimportList = [];
        replaceNodes.forEach(function (n) {
          if (configNodes.hasOwnProperty(n.id)) {
            delete configNodes[n.id];
          } else {
            nodes.splice(nodes.indexOf(n), 1);
          }
          reimportList.push(convertNode(n));
        });
        RED.view.redraw(true);
        var result = importNodes(reimportList, false);
        var newNodeMap = {};
        result[0].forEach(function (n) {
          newNodeMap[n.id] = n;
        });
        RED.nodes.eachLink(function (l) {
          if (newNodeMap.hasOwnProperty(l.source.id)) {
            l.source = newNodeMap[l.source.id];
          }
          if (newNodeMap.hasOwnProperty(l.target.id)) {
            l.target = newNodeMap[l.target.id];
          }
        });
        RED.view.redraw(true);
      }
    });
  }

  configDelegates() {
    const {
      registry
    } = this

    this.setNodeList = registry.setNodeList
    this.getNodeSet = registry.getNodeSet
    this.addNodeSet = registry.addNodeSet
    this.removeNodeSet = registry.removeNodeSet
    this.enableNodeSet = registry.enableNodeSet
    this.disableNodeSet = registry.disableNodeSet
    this.registerType = registry.registerNodeType
    this.getType = registry.getNodeType
  }

  getID() {
    return (1 + Math.random() * 4294967295).toString(16);
  }

  addNode(n) {
    const {
      RED
    } = this

    this._validateNode(n, 'n', 'addNode')
    this._validateNodeDef(n._def, 'n._def', 'addNode')

    if (n.type.indexOf("subflow") !== 0) {
      n["_"] = n._def._;
    } else {
      n["_"] = RED._;
    }
    if (n._def.category == "config") {
      this.configNodes[n.id] = n;
    } else {
      n.ports = [];
      if (n.wires && (n.wires.length > n.outputs)) {
        n.outputs = n.wires.length;
      }
      if (n.outputs) {
        for (var i = 0; i < n.outputs; i++) {
          n.ports.push(i);
        }
      }
      n.dirty = true;
      this.updateConfigNodeUsers(n);
      if (n._def.category == "subflows" && typeof n.i === "undefined") {
        var nextId = 0;
        RED.nodes.eachNode(function (node) {
          nextId = Math.max(nextId, node.i || 0);
        });
        n.i = nextId + 1;
      }
      this.nodes.push(n);
    }
    RED.events.emit('nodes:add', n);
  }

  addLink(link: Link) {
    this._validateLink(link, 'link', 'addLink')
    this.links.push(link);
  }

  getNode(id: string) {
    if (id in this.configNodes) {
      return this.configNodes[id];
    } else {
      for (var n in this.nodes) {
        if (this.nodes[n].id == id) {
          return this.nodes[n];
        }
      }
    }
    return null;
  }

  removeNode(id: string) {
    const {
      RED,
      configNodes,
      nodes,
      links,
      registry,
      n
    } = this

    const {
      getNode,
      removeNode
    } = this.rebind([
        'getNode',
        'removeNode'
      ])

    this._validateStr(id, 'id', 'removeNode')

    var removedLinks = [];
    var removedNodes = [];
    var node;
    if (id in configNodes) {
      node = configNodes[id];
      delete configNodes[id];
      RED.events.emit('nodes:remove', node);
      RED.workspaces.refresh();
    } else {
      node = getNode(id);
      if (!node) {
        this.logWarning(`node ${id} to remove not found in node collection`, {
          id,
          nodes: this.nodes
        })
        return {}
      }
      nodes.splice(nodes.indexOf(node), 1);
      removedLinks = links.filter(function (l) {
        return (l.source === node) || (l.target === node);
      });
      removedLinks.forEach(function (l) {
        links.splice(links.indexOf(l), 1);
      });
      var updatedConfigNode = false;
      for (var d in node._def.defaults) {
        if (node._def.defaults.hasOwnProperty(d)) {
          var property = node._def.defaults[d];
          if (property.type) {
            var type = registry.getNodeType(property.type);
            if (type && type.category == "config") {
              var configNode = configNodes[node[d]];
              if (configNode) {
                updatedConfigNode = true;
                if (configNode._def.exclusive) {
                  removeNode(node[d]);
                  removedNodes.push(configNode);
                } else {
                  var users = configNode.users;
                  users.splice(users.indexOf(node), 1);
                }
              }
            }
          }
        }
      }
      if (updatedConfigNode) {
        RED.workspaces.refresh();
      }
      RED.events.emit('nodes:remove', node);
    }
    if (node && node._def.onremove) {
      node._def.onremove.call(n);
    }
    return {
      links: removedLinks,
      nodes: removedNodes
    };
  }

  removeLink(l) {
    const { links } = this
    var index = links.indexOf(l);
    if (index != -1) {
      links.splice(index, 1);
    }
  }

  addWorkspace(ws) {
    const {
      RED,
      workspaces,
      workspacesOrder
    } = this

    workspaces[ws.id] = ws;
    ws._def = RED.nodes.getType('tab');
    workspacesOrder.push(ws.id);
  }

  getWorkspace(id) {
    const {
      workspaces,
    } = this

    return workspaces[id];
  }

  removeWorkspace(id) {
    const {
      RED,
      nodes,
      configNodes,
      workspacesOrder,
    } = this

    const {
      removeNode
    } = this.rebind([
        'removeNode'
      ])

    delete this.workspaces[id];
    this.workspacesOrder.splice(workspacesOrder.indexOf(id), 1);

    // TODO: Fix - instance vars?
    var removedNodes = [];
    var removedLinks = [];
    var n;
    var node;

    for (n = 0; n < nodes.length; n++) {
      node = nodes[n];
      if (node.z == id) {
        removedNodes.push(node);
      }
    }
    for (n in configNodes) {
      if (configNodes.hasOwnProperty(n)) {
        node = configNodes[n];
        if (node.z == id) {
          removedNodes.push(node);
        }
      }
    }
    for (n = 0; n < removedNodes.length; n++) {
      var result = removeNode(removedNodes[n].id);
      removedLinks = removedLinks.concat(result.links);
    }
    return {
      nodes: removedNodes,
      links: removedLinks
    };
  }

  addSubflow(sf: Subflow, createNewIds: boolean) {
    const {
      RED,
      subflows
    } = this

    this._validateNode(sf, 'sf', 'addSubflow')

    if (createNewIds) {
      var subflowNames = Object.keys(subflows).map(function (sfid) {
        return subflows[sfid].name;
      });

      subflowNames.sort();
      var copyNumber = 1;
      var subflowName = sf.name;
      subflowNames.forEach(function (name) {
        if (subflowName == name) {
          copyNumber++;
          subflowName = sf.name + " (" + copyNumber + ")";
        }
      });
      sf.name = subflowName;
    }
    subflows[sf.id] = sf;
    RED.nodes.registerType("subflow:" + sf.id, {
      defaults: {
        name: {
          value: ""
        }
      },
      info: sf.info,
      icon: "subflow.png",
      category: "subflows",
      inputs: sf.in.length,
      outputs: sf.out.length,
      color: "#da9",
      label: function () {
        return this.name || RED.nodes.subflow(sf.id).name
      },
      labelStyle: function () {
        return this.name ? "node_label_italic" : "";
      },
      paletteLabel: function () {
        return RED.nodes.subflow(sf.id).name
      },
      inputLabels: function (i) {
        return sf.inputLabels ? sf.inputLabels[i] : null
      },
      outputLabels: function (i) {
        return sf.outputLabels ? sf.outputLabels[i] : null
      },
      set: {
        module: "node-red"
      }
    });
    sf._def = RED.nodes.getType("subflow:" + sf.id);
  }

  getSubflow(id) {
    const { subflows } = this
    return subflows[id];
  }

  removeSubflow(sf: string | Subflow) {
    const { subflows, registry } = this

    const id: string = typeof sf === 'string' ? sf : sf.id

    delete this.subflows[id];
    registry.removeNodeType("subflow:" + id);
  }

  // TODO: split up function into smaller parts to make easier to track and test internals
  subflowContains(sfid: string, nodeid: string) {
    this._validateStr(sfid, 'sfid', 'subflowContains')
    this._validateStr(nodeid, 'nodeid', 'subflowContains')

    const { nodes } = this
    const {
      subflowContains
    } = this.rebind([
        'subflowContains'
      ])

    log('subflowContains', {
      nodes,
      sfid,
      nodeid
    })

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.z === sfid) {
        // https://developer.mozilla.org/th/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
        var m = /^subflow:(.+)$/.exec(node.type);
        log('match', {
          type: node.type,
          m
        })
        if (m) {
          log('node matching on ^subflow:(.+)$', {
            m,
            type: node.type,
          })
          if (m[1] === nodeid) {
            return true;
          } else {
            log('recurse node matching', {
              m1: m[1],
              nodeid
            })
            var result = subflowContains(m[1], nodeid);
            if (result) {
              return true;
            }
          }
        } else {
          log('node not matching on ^subflow:(.+)$', {
            m,
            type: node.type,
          })
        }
      } else {
        log('node not matching on .z', {
          sfid,
          z: node.z,
        })
      }
    }
    return false;
  }

  getAllFlowNodes(node: Node) {
    const {
      links
    } = this

    this._validateNode(node, 'node', 'getAllFlowNodes')

    var visited = {};
    visited[node.id] = true;
    var nns = [node];
    var stack = [node];
    while (stack.length !== 0) {
      var n = stack.shift();
      var childLinks = links.filter(function (d) {
        return (d.source === n) || (d.target === n);
      });
      for (var i = 0; i < childLinks.length; i++) {
        var child = (childLinks[i].source === n) ? childLinks[i].target : childLinks[i].source;
        var id = child.id;
        if (!id) {
          id = child.direction + ":" + child.i;
        }
        if (!visited[id]) {
          visited[id] = true;
          nns.push(child);
          stack.push(child);
        }
      }
    }
    return nns;
  }

  convertWorkspace(n) {
    var node = {
      id: null,
      type: null
    };

    node.id = n.id;
    node.type = n.type;
    for (var d in n._def.defaults) {
      if (n._def.defaults.hasOwnProperty(d)) {
        node[d] = n[d];
      }
    }
    return node;
  }
  /**
   * Converts a node to an exportable JSON Object
   **/
  convertNode(n: Node, exportCreds: boolean) {
    const {
      links
    } = this

    this._validateNode(n, 'n', 'convertNode')
    this._validateNodeDef(n._def, 'n._def', 'convertNode')

    if (n.type === 'tab') {
      return this.convertWorkspace(n);
    }
    exportCreds = exportCreds || false;

    // TODO: use interface or type instead!
    var node = {
      id: null,
      type: null,
      x: null,
      y: null,
      z: null,
      wires: null,
      credentials: null,
      inputLabels: null,
      outputLabels: null
    };

    node.id = n.id;
    node.type = n.type;
    node.z = n.z;

    if (node.type == "unknown") {
      for (var p in n._orig) {
        if (n._orig.hasOwnProperty(p)) {
          node[p] = n._orig[p];
        }
      }
    } else {
      for (var d in n._def.defaults) {
        if (n._def.defaults.hasOwnProperty(d)) {
          node[d] = n[d];
        }
      }
      if (exportCreds && n.credentials) {
        var credentialSet = {};
        node.credentials = {};
        for (var cred in n._def.credentials) {
          if (n._def.credentials.hasOwnProperty(cred)) {
            if (n._def.credentials[cred].type == 'password') {
              if (!n.credentials._ ||
                n.credentials["has_" + cred] != n.credentials._["has_" + cred] ||
                (n.credentials["has_" + cred] && n.credentials[cred])) {
                credentialSet[cred] = n.credentials[cred];
              }
            } else if (n.credentials[cred] != null && (!n.credentials._ || n.credentials[cred] != n.credentials._[cred])) {
              credentialSet[cred] = n.credentials[cred];
            }
          }
        }
        if (Object.keys(credentialSet).length > 0) {
          node.credentials = credentialSet;
        }
      }
    }
    if (n._def.category != "config") {
      node.x = n.x;
      node.y = n.y;
      node.wires = [];
      for (var i = 0; i < n.outputs; i++) {
        node.wires.push([]);
      }
      var wires = links.filter(function (d) {
        return d.source === n;
      });
      for (var j = 0; j < wires.length; j++) {
        var w = wires[j];
        if (w.target.type != "subflow") {
          node.wires[w.sourcePort].push(w.target.id);
        }
      }

      if (n.inputs > 0 && n.inputLabels && !/^\s*$/.test(n.inputLabels.join(""))) {
        node.inputLabels = n.inputLabels.slice();
      }
      if (n.outputs > 0 && n.outputLabels && !/^\s*$/.test(n.outputLabels.join(""))) {
        node.outputLabels = n.outputLabels.slice();
      }
    }
    return node;
  }

  convertSubflow(n: Node) {
    this._validateNode(n, 'n', 'convertSubflow')

    var node: any = {
    };
    node.id = n.id;
    node.type = n.type;
    node.name = n.name;
    node.info = n.info;
    node.in = [];
    node.out = [];

    this._validateArray(n.in, 'n.in', 'convertSubflow')
    this._validateArray(n.out, 'n.out', 'convertSubflow')

    n.in.forEach((p) => {
      var nIn = {
        x: p.x,
        y: p.y,
        wires: []
      };
      var wires = this.links.filter((d) => {
        return d.source === p
      });
      for (var i = 0; i < wires.length; i++) {
        var w = wires[i];
        if (w.target.type != "subflow") {
          nIn.wires.push({
            id: w.target.id
          })
        }
      }
      node.in.push(nIn);
    });
    n.out.forEach((p, c) => {
      var nOut = {
        x: p.x,
        y: p.y,
        wires: []
      };
      var wires = this.links.filter(function (d) {
        return d.target === p
      });
      for (var i = 0; i < wires.length; i++) {
        if (wires[i].source.type != "subflow") {
          nOut.wires.push({
            id: wires[i].source.id,
            port: wires[i].sourcePort
          })
        } else {
          nOut.wires.push({
            id: n.id,
            port: 0
          })
        }
      }
      node.out.push(nOut);
    });

    if (node.in.length > 0 && n.inputLabels && !/^\s*$/.test(n.inputLabels.join(""))) {
      node.inputLabels = n.inputLabels.slice();
    }
    if (node.out.length > 0 && n.outputLabels && !/^\s*$/.test(n.outputLabels.join(""))) {
      node.outputLabels = n.outputLabels.slice();
    }


    return node;
  }
  /**
   * Converts the current node selection to an exportable JSON Object
   **/
  createExportableNodeSet(set, exportedSubflows, exportedConfigNodes) {
    const {
      RED,
      registry,
      configNodes,
    } = this
    const {
      getSubflow,
      createExportableNodeSet,
      convertSubflow,

    } = this.rebind([
        'getSubflow',
        'createExportableNodeSet',
        'convertSubflow'
      ])

    const $nodes = this

    var nns = [];
    exportedConfigNodes = exportedConfigNodes || {};
    exportedSubflows = exportedSubflows || {};
    for (var n = 0; n < set.length; n++) {
      var node = set[n];

      this._validateNode(node, 'node', 'createExportableNodeSet', 'iterate node set')
      this._validateStr(node.type, 'node.type', 'createExportableNodeSet', 'iterate node set')

      if (node.type.substring(0, 8) == "subflow:") {
        var subflowId = node.type.substring(8);
        if (!exportedSubflows[subflowId]) {
          exportedSubflows[subflowId] = true;
          var subflow = getSubflow(subflowId);
          var subflowSet = [subflow];
          RED.nodes.eachNode(function (n) {

            $nodes._validateNode(n, 'n', 'iterate RED nodes')

            if (n.z == subflowId) {
              subflowSet.push(n);
            }
          });
          var exportableSubflow = createExportableNodeSet(subflowSet, exportedSubflows, exportedConfigNodes);
          nns = exportableSubflow.concat(nns);
        }
      }
      if (node.type != "subflow") {
        var convertedNode = RED.nodes.convertNode(node);
        for (var d in node._def.defaults) {
          if (node._def.defaults[d].type && node[d] in configNodes) {
            var confNode = configNodes[node[d]];
            var exportable = registry.getNodeType(node._def.defaults[d].type).exportable;
            if ((exportable == null || exportable)) {
              if (!(node[d] in exportedConfigNodes)) {
                exportedConfigNodes[node[d]] = true;
                set.push(confNode);
              }
            } else {
              convertedNode[d] = "";
            }
          }
        }
        nns.push(convertedNode);
      } else {
        var convertedSubflow = convertSubflow(node);
        nns.push(convertedSubflow);
      }
    }
    return nns;
  }

  createCompleteNodeSet(exportCredentials) {
    const {
      workspacesOrder,
      workspaces,
      subflows,
      nodes,
      configNodes
    } = this

    const {
      convertWorkspace,
      convertSubflow,
      convertNode
    } = this.rebind([
        'convertWorkspace',
        'convertSubflow',
        'convertNode'
      ])

    if (exportCredentials === undefined) {
      exportCredentials = true;
    }
    var nns = [];
    for (let i = 0; i < workspacesOrder.length; i++) {
      if (workspaces[workspacesOrder[i]].type == "tab") {
        nns.push(convertWorkspace(workspaces[workspacesOrder[i]]));
      }
    }
    for (let flowId in subflows) {
      if (subflows.hasOwnProperty(flowId)) {
        nns.push(convertSubflow(subflows[flowId]));
      }
    }
    for (let nodeId in configNodes) {
      if (configNodes.hasOwnProperty(nodeId)) {
        const configNode = configNodes[nodeId]
        log({
          nodeId,
          configNode,
          configNodes
        })
        this._validateNode(configNode, 'configNode', 'createCompleteNodeSet', 'iterate configNodes')

        nns.push(convertNode(configNode, exportCredentials));
      }
    }
    for (let nodeId = 0; nodeId < nodes.length; nodeId++) {
      var node = nodes[nodeId];
      this._validateNode(node, 'node', 'createCompleteNodeSet', 'iterate nodes')

      nns.push(convertNode(node, exportCredentials));
    }
    return nns;
  }

  checkForMatchingSubflow(subflow, subflowNodes) {
    const {
      RED
    } = this
    const {
      createExportableNodeSet
    } = this.rebind([
        'createExportableNodeSet'
      ])

    this._validateNode(subflow, 'subflow', 'checkForMatchingSubflow')
    this._validateArray(subflowNodes, 'subflowNodes', 'checkForMatchingSubflow')

    var i;
    var match = null;
    try {
      RED.nodes.eachSubflow((sf) => {
        this._validateNode(sf, 'sf', 'checkForMatchingSubflow', 'iterate subflow nodes')

        log('eachSubflow', {
          sf
        })

        if (sf.name != subflow.name ||
          sf.info != subflow.info ||
          sf.in.length != subflow.in.length ||
          sf.out.length != subflow.out.length) {
          return;
        }
        var sfNodes = RED.nodes.filterNodes({
          z: sf.id
        });

        log({
          sfNodes
        })

        if (sfNodes.length != subflowNodes.length) {
          return;
        }

        var subflowNodeSet = [subflow].concat(subflowNodes);
        var sfNodeSet = [sf].concat(sfNodes);

        log({
          subflowNodeSet,
          sfNodeSet
        })

        var exportableSubflowNodes = JSON.stringify(subflowNodeSet);
        var exportableSFNodes = JSON.stringify(createExportableNodeSet(sfNodeSet));
        var nodeMap = {};
        for (i = 0; i < sfNodes.length; i++) {
          exportableSubflowNodes = exportableSubflowNodes.replace(new RegExp("\"" + subflowNodes[i].id + "\"", "g"), '"' + sfNodes[i].id + '"');
        }
        exportableSubflowNodes = exportableSubflowNodes.replace(new RegExp("\"" + subflow.id + "\"", "g"), '"' + sf.id + '"');

        log('compare', {
          exportableSubflowNodes,
          exportableSFNodes
        })

        if (exportableSubflowNodes !== exportableSFNodes) {
          return;
        }
        log('found match', {
          sf
        })

        match = sf;
        throw new Error();
      });
    } catch (err) {
      console.log(err.stack);
    }
    return match;
  }

  compareNodes(nodeA, nodeB, idMustMatch) {
    if (idMustMatch && nodeA.id != nodeB.id) {
      return false;
    }
    if (nodeA.type != nodeB.type) {
      return false;
    }
    var def = nodeA._def;
    for (var d in def.defaults) {
      if (def.defaults.hasOwnProperty(d)) {
        var vA = nodeA[d];
        var vB = nodeB[d];
        if (typeof vA !== typeof vB) {
          return false;
        }
        if (vA === null || typeof vA === "string" || typeof vA === "number") {
          if (vA !== vB) {
            return false;
          }
        } else {
          if (JSON.stringify(vA) !== JSON.stringify(vB)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  importNodes(newNodesObj, createNewIds, createMissingWorkspace) {
    const {
      RED,
      registry,
    } = this
    let {
      initialLoad,
      defaultWorkspace,
      workspaces,
      configNodes
    } = this

    const {
      subflowContains,
      getID,
      getSubflow,
    } = this.rebind([
        'subflowContains',
        'getID',
        'getSubflow'
      ])

    var i;
    var n;
    var newNodes;
    var nodeZmap = {};
    if (typeof newNodesObj === "string") {
      if (newNodesObj === "") {
        return;
      }
      try {
        newNodes = JSON.parse(newNodesObj);
      } catch (err) {
        var e = new Error(RED._("clipboard.invalidFlow", {
          message: err.message
        }));
        e['code'] = "NODE_RED";
        throw e;
      }
    } else {
      newNodes = newNodesObj;
    }

    if (!$.isArray(newNodes)) {
      newNodes = [newNodes];
    }
    if (!initialLoad) {
      initialLoad = JSON.parse(JSON.stringify(newNodes));
    }
    var unknownTypes = [];
    for (i = 0; i < newNodes.length; i++) {
      n = newNodes[i];
      this._validateNode(n, 'n', 'importNodes', 'iterate newNodes')

      // TODO: remove workspace in next release+1
      if (n.type != "workspace" &&
        n.type != "tab" &&
        n.type != "subflow" &&
        !registry.getNodeType(n.type) &&
        n.type.substring(0, 8) != "subflow:" &&
        unknownTypes.indexOf(n.type) == -1) {
        unknownTypes.push(n.type);
      }
      if (n.z) {
        nodeZmap[n.z] = nodeZmap[n.z] || [];
        nodeZmap[n.z].push(n);
      }

    }
    if (unknownTypes.length > 0) {
      var typeList = "<ul><li>" + unknownTypes.join("</li><li>") + "</li></ul>";
      var type = "type" + (unknownTypes.length > 1 ? "s" : "");
      RED.notify("<strong>" + RED._("clipboard.importUnrecognised", {
        count: unknownTypes.length
      }) + "</strong>" + typeList, "error", false, 10000);
    }

    var activeWorkspace = RED.workspaces.active();
    //TODO: check the z of the subflow instance and check _that_ if it exists
    var activeSubflow = getSubflow(activeWorkspace);
    for (i = 0; i < newNodes.length; i++) {
      var m = /^subflow:(.+)$/.exec(newNodes[i].type);
      if (m) {
        var subflowId = m[1];
        var parent = getSubflow(newNodes[i].z || activeWorkspace);
        if (parent) {
          var err;
          if (subflowId === parent.id) {
            err = new Error(RED._("notification.errors.cannotAddSubflowToItself"));
          }
          if (subflowContains(subflowId, parent.id)) {
            err = new Error(RED._("notification.errors.cannotAddCircularReference"));
          }
          if (err) {
            // TODO: standardise error codes
            err.code = "NODE_RED";
            throw err;
          }
        }
      }
    }

    var new_workspaces = [];
    var workspace_map = {};
    var new_subflows = [];
    var subflow_map = {};
    var subflow_blacklist = {};
    var node_map = {};
    var new_nodes = [];
    var new_links = [];
    var nid;
    var def;
    var configNode;
    var missingWorkspace = null;
    var d;

    // Find all tabs and subflow templates
    for (i = 0; i < newNodes.length; i++) {
      n = newNodes[i];

      this._validateNode(n, 'n', 'importNodes', 'iterate newNodes: tabs and subflows')

      // TODO: remove workspace in next release+1
      if (n.type === "workspace" || n.type === "tab") {
        if (n.type === "workspace") {
          n.type = "tab";
        }
        if (defaultWorkspace == null) {
          defaultWorkspace = n;
        }
        if (createNewIds) {
          nid = getID();
          workspace_map[n.id] = nid;
          n.id = nid;
        }
        this.addWorkspace(n);
        RED.workspaces.add(n);
        new_workspaces.push(n);
      } else if (n.type === "subflow") {
        var matchingSubflow = this.checkForMatchingSubflow(n, nodeZmap[n.id]);
        if (matchingSubflow) {
          subflow_blacklist[n.id] = matchingSubflow;
        } else {
          subflow_map[n.id] = n;
          if (createNewIds) {
            nid = this.getID();
            n.id = nid;
          }

          this._validateArray(n.in, 'n.in', 'importNodes', 'iterate newNodes: tabs and subflows')
          this._validateArray(n.out, 'n.out', 'importNodes', 'iterate newNodes: tabs and subflows')

          // TODO: handle createNewIds - map old to new subflow ids
          n.in.forEach((input, i) => {
            input.type = "subflow";
            input.direction = "in";
            input.z = n.id;
            input.i = i;
            input.id = this.getID();
          });
          n.out.forEach((output, i) => {
            output.type = "subflow";
            output.direction = "out";
            output.z = n.id;
            output.i = i;
            output.id = this.getID();
          });
          new_subflows.push(n);
          this.addSubflow(n, createNewIds);
        }
      }
    }

    // Add a tab if there isn't one there already
    if (defaultWorkspace == null) {
      defaultWorkspace = {
        type: "tab",
        id: this.getID(),
        disabled: false,
        info: "",
        label: RED._('workspace.defaultName', {
          number: 1
        })
      };
      this.addWorkspace(defaultWorkspace);
      RED.workspaces.add(defaultWorkspace);
      new_workspaces.push(defaultWorkspace);
      activeWorkspace = RED.workspaces.active();
    }

    // Find all config nodes and add them
    for (let i = 0; i < newNodes.length; i++) {
      n = newNodes[i];
      def = registry.getNodeType(n.type);
      if (def && def.category == "config") {
        var existingConfigNode = null;
        if (createNewIds) {
          if (n.z) {
            if (subflow_blacklist[n.z]) {
              continue;
            } else if (subflow_map[n.z]) {
              n.z = subflow_map[n.z].id;
            } else {
              n.z = workspace_map[n.z];
              if (!workspaces[n.z]) {
                if (createMissingWorkspace) {
                  if (missingWorkspace === null) {
                    missingWorkspace = RED.workspaces.add(null, true);
                    new_workspaces.push(missingWorkspace);
                  }
                  n.z = missingWorkspace.id;
                } else {
                  n.z = activeWorkspace;
                }
              }
            }
          }
          existingConfigNode = RED.nodes.node(n.id);
          if (existingConfigNode) {
            if (n.z && existingConfigNode.z !== n.z) {
              existingConfigNode = null;
              // Check the config nodes on n.z
              for (let cn in configNodes) {
                if (configNodes.hasOwnProperty(cn)) {
                  if (configNodes[cn].z === n.z && this.compareNodes(configNodes[cn], n, false)) {
                    existingConfigNode = configNodes[cn];
                    node_map[n.id] = configNodes[cn];
                    break;
                  }
                }
              }
            }
          }

        }

        if (!existingConfigNode) { //} || !compareNodes(existingConfigNode,n,true) || existingConfigNode._def.exclusive || existingConfigNode.z !== n.z) {
          configNode = {
            id: n.id,
            z: n.z,
            type: n.type,
            users: [],
            _config: {}
          };
          for (d in def.defaults) {
            if (def.defaults.hasOwnProperty(d)) {
              configNode[d] = n[d];
              configNode._config[d] = JSON.stringify(n[d]);
            }
          }
          if (def.hasOwnProperty('credentials') && n.hasOwnProperty('credentials')) {
            configNode.credentials = {};
            for (d in def.credentials) {
              if (def.credentials.hasOwnProperty(d) && n.credentials.hasOwnProperty(d)) {
                configNode.credentials[d] = n.credentials[d];
              }
            }
          }
          configNode.label = def.label;
          configNode._def = def;
          if (createNewIds) {
            configNode.id = this.getID();
          }
          node_map[n.id] = configNode;
          new_nodes.push(configNode);
          RED.nodes.add(configNode);
        }
      }
    }

    // Find regular flow nodes and subflow instances
    for (i = 0; i < newNodes.length; i++) {
      n = newNodes[i];
      // TODO: remove workspace in next release+1
      if (n.type !== "workspace" && n.type !== "tab" && n.type !== "subflow") {
        def = registry.getNodeType(n.type);
        if (!def || def.category != "config") {
          var node: any = {
            id: null,
            _def: null,
            x: n.x,
            y: n.y,
            z: n.z,
            type: 0,
            wires: n.wires,
            inputLabels: n.inputLabels,
            outputLabels: n.outputLabels,
            changed: false,
            _config: {}
          };
          if (createNewIds) {
            if (subflow_blacklist[n.z]) {
              continue;
            } else if (subflow_map[node.z]) {
              node.z = subflow_map[node.z].id;
            } else {
              node.z = workspace_map[node.z];
              if (!workspaces[node.z]) {
                if (createMissingWorkspace) {
                  if (missingWorkspace === null) {
                    missingWorkspace = RED.workspaces.add(null, true);
                    new_workspaces.push(missingWorkspace);
                  }
                  node.z = missingWorkspace.id;
                } else {
                  node.z = activeWorkspace;
                }
              }
            }
            node.id = this.getID();
          } else {
            node.id = n.id;
            if (node.z == null || (!workspaces[node.z] && !subflow_map[node.z])) {
              if (createMissingWorkspace) {
                if (missingWorkspace === null) {
                  missingWorkspace = RED.workspaces.add(null, true);
                  new_workspaces.push(missingWorkspace);
                }
                node.z = missingWorkspace.id;
              } else {
                node.z = activeWorkspace;
              }
            }
          }
          node.type = n.type;
          node._def = def;
          if (n.type.substring(0, 7) === "subflow") {
            var parentId = n.type.split(":")[1];
            var subflow = subflow_blacklist[parentId] || subflow_map[parentId] || getSubflow(parentId);
            if (createNewIds) {
              parentId = subflow.id;
              node.type = "subflow:" + parentId;
              node._def = registry.getNodeType(node.type);
              delete node.i;
            }
            node.name = n.name;
            node.outputs = subflow.out.length;
            node.inputs = subflow.in.length;
          } else {
            if (!node._def) {
              if (node.x && node.y) {
                node._def = {
                  color: "#fee",
                  defaults: {},
                  label: "unknown: " + n.type,
                  labelStyle: "node_label_italic",
                  outputs: n.outputs || n.wires.length,
                  set: registry.getNodeSet("node-red/unknown")
                }
              } else {
                node._def = {
                  category: "config",
                  set: registry.getNodeSet("node-red/unknown")
                };
                node.users = [];
              }
              var orig = {};
              for (var p in n) {
                if (n.hasOwnProperty(p) && p != "x" && p != "y" && p != "z" && p != "id" && p != "wires") {
                  orig[p] = n[p];
                }
              }
              node._orig = orig;
              node.name = n.type;
              node.type = "unknown";
            }
            if (node._def.category != "config") {
              node.inputs = n.inputs || node._def.inputs;
              node.outputs = n.outputs || node._def.outputs;
              for (d in node._def.defaults) {
                if (node._def.defaults.hasOwnProperty(d)) {
                  node[d] = n[d];
                  node._config[d] = JSON.stringify(n[d]);
                }
              }
              node._config.x = node.x;
              node._config.y = node.y;
              if (node._def.hasOwnProperty('credentials') && n.hasOwnProperty('credentials')) {
                node.credentials = {};
                for (d in node._def.credentials) {
                  if (node._def.credentials.hasOwnProperty(d) && n.credentials.hasOwnProperty(d)) {
                    node.credentials[d] = n.credentials[d];
                  }
                }
              }
            }
          }
          this.addNode(node);
          RED.editor.validateNode(node);
          node_map[n.id] = node;
          if (node._def.category != "config") {
            new_nodes.push(node);
          }
        }
      }
    }
    // TODO: make this a part of the node definition so it doesn't have to
    //       be hardcoded here
    var nodeTypeArrayReferences = {
      "catch": "scope",
      "status": "scope",
      "link in": "links",
      "link out": "links"
    }

    // Remap all wires and config node references
    for (i = 0; i < new_nodes.length; i++) {
      n = new_nodes[i];
      if (n.wires) {
        for (var w1 = 0; w1 < n.wires.length; w1++) {
          var wires = (n.wires[w1] instanceof Array) ? n.wires[w1] : [n.wires[w1]];
          for (var w2 = 0; w2 < wires.length; w2++) {
            if (node_map.hasOwnProperty(wires[w2])) {
              if (n.z === node_map[wires[w2]].z) {
                var link = {
                  source: n,
                  sourcePort: w1,
                  target: node_map[wires[w2]]
                };
                this.addLink(link);
                new_links.push(link);
              } else {
                console.log("Warning: dropping link that crosses tabs:", n.id, "->", node_map[wires[w2]].id);
              }
            }
          }
        }
        delete n.wires;
      }
      for (var d3 in n._def.defaults) {
        if (n._def.defaults.hasOwnProperty(d3)) {
          if (n._def.defaults[d3].type && node_map[n[d3]]) {
            n[d3] = node_map[n[d3]].id;
            configNode = RED.nodes.node(n[d3]);
            if (configNode && configNode.users.indexOf(n) === -1) {
              configNode.users.push(n);
            }
          } else if (nodeTypeArrayReferences.hasOwnProperty(n.type) && nodeTypeArrayReferences[n.type] === d3 && n[d3] !== undefined && n[d3] !== null) {
            for (var j = 0; j < n[d3].length; j++) {
              if (node_map[n[d3][j]]) {
                n[d3][j] = node_map[n[d3][j]].id;
              }
            }

          }
        }
      }
      // If importing into a subflow, ensure an outbound-link doesn't
      // get added
      if (activeSubflow && /^link /.test(n.type) && n.links) {
        n.links = n.links.filter(function (id) {
          var otherNode = RED.nodes.node(id);
          return (otherNode && otherNode.z === activeWorkspace)
        });
      }

      // With all properties now remapped to point at valid nodes,
      // we can validate the node
      RED.editor.validateNode(n);
    }
    for (i = 0; i < new_subflows.length; i++) {
      n = new_subflows[i];

      this._validateArray(n.in, 'n.in', 'importNodes', 'iterate new_subflows')
      this._validateArray(n.out, 'n.out', 'importNodes', 'iterate new_subflows')

      n.in.forEach(function (input) {
        input.wires.forEach(function (wire) {
          var link = {
            source: input,
            sourcePort: 0,
            target: node_map[wire.id]
          };
          this.addLink(link);
          new_links.push(link);
        });
        delete input.wires;
      });
      n.out.forEach((output) => {
        output.wires.forEach((wire) => {
          var link;
          if (subflow_map[wire.id] && subflow_map[wire.id].id == n.id) {
            link = {
              source: n.in[wire.port],
              sourcePort: wire.port,
              target: output
            };
          } else {
            link = {
              source: node_map[wire.id] || subflow_map[wire.id],
              sourcePort: wire.port,
              target: output
            };
          }
          this.addLink(link);
          new_links.push(link);
        });
        delete output.wires;
      });
    }

    RED.workspaces.refresh();
    return [new_nodes, new_links, new_workspaces, new_subflows, missingWorkspace];
  }

  // TODO: supports filter.z|type
  filterNodes(filter) {
    const {
      nodes
    } = this

    var result = [];

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];

      this._validateNode(node, 'node', 'filterNodes', 'iterate nodes')

      if (filter.hasOwnProperty("z") && node.z !== filter.z) {
        continue;
      }
      if (filter.hasOwnProperty("type") && node.type !== filter.type) {
        continue;
      }
      result.push(node);
    }
    return result;
  }

  filterLinks(filter) {
    const {
      links
    } = this

    var result = [];

    for (var n = 0; n < links.length; n++) {
      var link = links[n];

      this._validateLink(link, 'link', 'filterNodes', { links })

      if (filter.source) {
        if (filter.source.hasOwnProperty("id") && link.source.id !== filter.source.id) {
          continue;
        }
        if (filter.source.hasOwnProperty("z") && link.source.z !== filter.source.z) {
          continue;
        }
      }
      if (filter.target) {
        if (filter.target.hasOwnProperty("id") && link.target.id !== filter.target.id) {
          continue;
        }
        if (filter.target.hasOwnProperty("z") && link.target.z !== filter.target.z) {
          continue;
        }
      }
      if (filter.hasOwnProperty("sourcePort") && link.sourcePort !== filter.sourcePort) {
        continue;
      }
      result.push(link);
    }
    return result;
  }

  // Update any config nodes referenced by the provided node to ensure their 'users' list is correct
  updateConfigNodeUsers(n: Node) {
    const {
      registry,
      configNodes
    } = this

    this._validateNode(n, 'n', 'updateConfigNodeUsers')
    this._validateNodeDef(n._def, 'n._def', 'updateConfigNodeUsers')

    const keys = Object.keys(n._def.defaults)
    if (keys.length === 0) {
      this.logWarning('no defaults registered for node def', {
        _def: n._def,
        n
      })
    }

    for (var d in n._def.defaults) {
      if (n._def.defaults.hasOwnProperty(d)) {
        log({
          d,
          n,
          _def: n._def,
          defaults: n._def.defaults,
        })

        var property = n._def.defaults[d];

        if (property.type) {
          var type = registry.getNodeType(property.type);
          log('type property', {
            type,
            property
          })

          if (type && type.category == "config") {
            var defPropId = n[d]
            if (defPropId) {
              var configNode = configNodes[defPropId];
              if (configNode) {
                if (configNode.users.indexOf(n) === -1) {
                  configNode.users.push(n);
                } else {
                  this.logWarning('user already registered in configNode.users', {
                    n,
                    users: configNode.users
                  })
                }
              } else {
                this.logWarning('missing configNode')
              }
            } else {
              this.logWarning(`missing default property: ${defPropId} in configNodes`, {
                n,
                d,
                configNodes,
                defPropId
              })
            }
          } else {
            this.logWarning('node type not a config category', {
              category: type.category,
              property
            })
          }
        } else {
          this.logWarning('missing property type', {
            property
          })
        }
      }
    }
  }

  flowVersion(version) {
    let {
      loadedFlowVersion
    } = this

    if (version !== undefined) {
      loadedFlowVersion = version;
    }
    this.setInstanceVars({ loadedFlowVersion })
    return loadedFlowVersion;
  }

  clear() {
    let {
      RED,
      defaultWorkspace,
      subflows,
      workspaces
    } = this

    var subflowIds = Object.keys(subflows);
    subflowIds.forEach((id) => {
      RED.subflow.removeSubflow(id)
    });
    var workspaceIds = Object.keys(workspaces);
    workspaceIds.forEach((id) => {
      RED.workspaces.remove(workspaces[id]);
    });

    defaultWorkspace = null;

    RED.nodes.dirty(true);

    log('RED refresh')

    RED.view.redraw(true);
    RED.palette.refresh();
    RED.workspaces.refresh();
    RED.sidebar.config.refresh();

    var node_defs = {};
    var nodes = [];
    var configNodes = {};
    var links = [];
    workspaces = {};
    var workspacesOrder = [];
    subflows = {};
    var loadedFlowVersion = null;

    this.setInstanceVars({
      node_defs,
      nodes,
      configNodes,
      links,
      workspaces,
      workspacesOrder,
      subflows,
      loadedFlowVersion
    })

    return this
  }

  getWorkspaceOrder() {
    return this.workspacesOrder
  }

  setWorkspaceOrder(order) {
    this._validateArray(order, 'order', 'setWorkspaceOrder')
    this.workspacesOrder = order;
    return this
  }

  eachNode(cb) {
    for (var n = 0; n < this.nodes.length; n++) {
      cb(this.nodes[n]);
    }
  }

  eachLink(cb) {
    for (var l = 0; l < this.links.length; l++) {
      cb(this.links[l]);
    }
  }

  eachConfig(cb) {
    for (var id in this.configNodes) {
      if (this.configNodes.hasOwnProperty(id)) {
        cb(this.configNodes[id]);
      }
    }
  }

  eachSubflow(cb) {
    for (var id in this.subflows) {
      if (this.subflows.hasOwnProperty(id)) {
        cb(this.subflows[id]);
      }
    }
  }

  eachWorkspace(cb) {
    for (var i = 0; i < this.workspacesOrder.length; i++) {
      cb(this.workspaces[this.workspacesOrder[i]]);
    }
  }

  originalFlow(flow) {
    let {
      initialLoad
    } = this
    if (flow === undefined) {
      return initialLoad;
    } else {
      initialLoad = flow;
    }
  }

  dirty(d) {
    const {
      setDirty,
      dirty
    } = this.rebind([
        'setDirty'
      ])

    if (d == null) {
      return dirty;
    } else {
      setDirty(d);
    }
  }
}
