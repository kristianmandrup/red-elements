import {
  Nodes
} from '../'

import {
  Context
} from '../../../context'

import {
  Node,
  NodeDef
} from '../../interfaces'

export interface IImporter {
  importNodes(newNodesObj: string, createNewIds: boolean, createMissingWorkspace: boolean)
}

/**
 * Import nodes from a serialized format (String, JSON etc.)
 *
 * TODO:
 * Perhaps introduce additional helper classes for complex parts of Import flow
 */
export class Importer extends Context {
  constructor(public nodes: Nodes) {
    super()
  }

  _parse(newNodesObj: string): Node[] {
    const {
      RED
    } = this.nodes

    if (newNodesObj === "") {
      return []
    }
    try {
      return JSON.parse(newNodesObj);
    } catch (err) {
      var e = new Error(RED._("clipboard.invalidFlow", {
        message: err.message
      }));
      e['code'] = "NODE_RED";
      throw e;
    }
  }


  protected _normalize(newNodesObj: any): Node[] {
    let newNodes = typeof newNodesObj === 'string' ? this._parse(newNodesObj) : newNodesObj
    return !$.isArray(newNodes) ? [newNodes] : newNodes
  }

  protected _findUnknownTypes(newNodes: Node[]) {
    const {
      nodes
    } = this
    const {
      RED,
      registry,
    } = nodes

    let nodeZmap = {};
    let n: Node;
    let unknownTypes = [];
    for (let i = 0; i < newNodes.length; i++) {
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
    return { unknownTypes, nodeZmap }
  }

  _notifyUnknownTypes(unknownTypes: any[]) {
    const {
      RED
    } = this.nodes

    if (unknownTypes.length > 0) {
      var typeList = "<ul><li>" + unknownTypes.join("</li><li>") + "</li></ul>";
      var type = "type" + (unknownTypes.length > 1 ? "s" : "");
      RED.notify("<strong>" + RED._("clipboard.importUnrecognised", {
        count: unknownTypes.length
      }) + "</strong>" + typeList, "error", false, 10000);
    }
  }

  protected _validateSubflows(newNodes: Node[]) {
    const {
      nodes,
      RED,
    } = this

    const {
      registry,
    } = nodes

    const {
      subflowContains,
      getSubflow,
    } = this.rebind([
        'subflowContains',
        'getSubflow',
      ], nodes)

    var activeWorkspace = RED.workspaces.active();
    //TODO: check the z of the subflow instance and check _that_ if it exists
    var activeSubflow = getSubflow(activeWorkspace);
    for (let i = 0; i < newNodes.length; i++) {
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
    return {
      activeWorkspace,
      activeSubflow
    }
  }

  _findTabsAndSubflowTemplates(newNodes: Node[], nodeZmap, createNewIds: boolean) {
    const {
      nodes,
      RED
    } = this

    let {
      initialLoad,
      defaultWorkspace,
      workspaces,
      configNodes
    } = nodes

    const {
      subflowContains,
      getSubflow,
      addWorkspace,
      addSubflow,
      checkForMatchingSubflow,
      getID,
      compareNodes,
      addNode,
      addLink
    } = this.rebind([
        'addWorkspace',
        'addSubflow',
        'getID',
      ], nodes)

    var new_workspaces = [];
    var workspace_map = {};
    var new_subflows = [];
    var subflow_map = {};
    var subflow_blacklist = {};
    var nid;

    let n
    // Find all tabs and subflow templates
    for (let i = 0; i < newNodes.length; i++) {
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
        addWorkspace(n);
        RED.workspaces.add(n);
        new_workspaces.push(n);
      } else if (n.type === "subflow") {
        var matchingSubflow = checkForMatchingSubflow(n, nodeZmap[n.id]);
        if (matchingSubflow) {
          subflow_blacklist[n.id] = matchingSubflow;
        } else {
          subflow_map[n.id] = n;
          if (createNewIds) {
            nid = getID();
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
            input.id = getID();
          });
          n.out.forEach((output, i) => {
            output.type = "subflow";
            output.direction = "out";
            output.z = n.id;
            output.i = i;
            output.id = getID();
          });
          new_subflows.push(n);
          addSubflow(n, createNewIds);
        }
      }
    }
    return {
      subflow_blacklist,
      subflow_map,
      new_workspaces,
      workspace_map,
      new_subflows
    }
  }

  _addTab(new_workspaces, activeWorkspace) {
    const {
      nodes,
      RED
    } = this

    let {
      defaultWorkspace,
    } = nodes

    const {
      addWorkspace,
      getID,
    } = this.rebind([
        'addWorkspace',
        'getID',
      ], nodes)

    if (defaultWorkspace == null) {
      defaultWorkspace = {
        type: "tab",
        id: getID(),
        disabled: false,
        info: "",
        label: RED._('workspace.defaultName', {
          number: 1
        })
      };
      addWorkspace(defaultWorkspace);
      RED.workspaces.add(defaultWorkspace);

      // side effects!
      new_workspaces.push(defaultWorkspace);
      activeWorkspace = RED.workspaces.active();

      // return {
      //   new_workspaces,
      //   activeWorkspace
      // }
    }
  }

  _findAndUpdateConfigNodes(newNodes: any, createNewIds: boolean, createMissingWorkspace: boolean, config: any) {
    const {
      nodes
    } = this

    const {
      subflow_blacklist,
      subflow_map,
      workspace_map,
      workspaces,
      new_workspaces,
      activeWorkspace,
      configNodes,
      new_nodes
    } = config

    let n, def
    let missingWorkspace = null
    let configNode;
    let node_map = {};

    const {
      registry,
      RED
    } = nodes

    const {
      getID,
      compareNodes
    } = this.rebind([
        'getID',
        'compareNodes'
      ], nodes)

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
                  if (configNodes[cn].z === n.z && compareNodes(configNodes[cn], n, false)) {
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
          for (let d in def.defaults) {
            if (def.defaults.hasOwnProperty(d)) {
              configNode[d] = n[d];
              configNode._config[d] = JSON.stringify(n[d]);
            }
          }
          if (def.hasOwnProperty('credentials') && n.hasOwnProperty('credentials')) {
            configNode.credentials = {};
            for (let d in def.credentials) {
              if (def.credentials.hasOwnProperty(d) && n.credentials.hasOwnProperty(d)) {
                configNode.credentials[d] = n.credentials[d];
              }
            }
          }
          configNode.label = def.label;
          configNode._def = def;
          if (createNewIds) {
            configNode.id = getID();
          }
          node_map[n.id] = configNode;
          new_nodes.push(configNode);
          RED.nodes.add(configNode);
        }
      }
    }
    return {
      missingWorkspace,
      node_map,
      new_nodes
    }
  }

  // TODO: fix side effect
  // Note: updates missingWorkspace as side effect
  /**
   * Find regular flow nodes and subflow instances
   * @param newNodes { Node[] }
  */
  _findRegularNodesAndSubflows(newNodes: Node[], createNewIds: boolean, createMissingWorkspace: boolean, config: any) {
    let n: Node
    let def: NodeDef

    let {
      subflow_blacklist,
      subflow_map,
      workspace_map,
      workspaces,
      missingWorkspace,
      new_workspaces,
      activeWorkspace,
      node_map,
      new_nodes
    } = config

    const {
      nodes,
      RED
    } = this

    const {
      registry
    } = nodes

    const {
      getID,
      addNode,
      getSubflow
    } = this.rebind([
        'getID',
        'addNode',
        'getSubflow'
      ], nodes)

    for (let i = 0; i < newNodes.length; i++) {
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
            node.id = getID();
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
              for (let d in node._def.defaults) {
                if (node._def.defaults.hasOwnProperty(d)) {
                  node[d] = n[d];
                  node._config[d] = JSON.stringify(n[d]);
                }
              }
              node._config.x = node.x;
              node._config.y = node.y;
              if (node._def.hasOwnProperty('credentials') && n.hasOwnProperty('credentials')) {
                node.credentials = {};
                for (let d in node._def.credentials) {
                  if (node._def.credentials.hasOwnProperty(d) && n.credentials.hasOwnProperty(d)) {
                    node.credentials[d] = n.credentials[d];
                  }
                }
              }
            }
          }
          addNode(node);
          RED.editor.validateNode(node);
          node_map[n.id] = node;
          if (node._def.category != "config") {
            new_nodes.push(node);
          }
        }
      }
    }
    return {
      missingWorkspace
    }
  }

  /**
   * Remaps node wires and config node references
   * @param new_nodes { Node[] } the new nodes to be rewired
   * @param config { Object } related collections to be used for processing/updating
   * @returns void
   */
  _remapWiresAndConfigNodeRefs(new_nodes: Node[], config: any) {
    const {
      RED,
      nodes
    } = this

    let {
      node_map,
      new_links,
      activeSubflow,
      activeWorkspace
    } = config

    const {
      addLink
    } = this.rebind([
        'addLink'
      ], nodes)

    // TODO: make this a part of the node definition so it doesn't have to
    //       be hardcoded here
    var nodeTypeArrayReferences = {
      "catch": "scope",
      "status": "scope",
      "link in": "links",
      "link out": "links"
    }

    let n, configNode
    // Remap all wires and config node references
    for (let i = 0; i < new_nodes.length; i++) {
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
                addLink(link);
                new_links.push(link);
              } else {
                console.log("Warning: dropping link that crosses tabs:", n.id, "->", node_map[wires[w2]].id);
              }
            }
          }
        }
        delete n.wires;
      }
      for (let d3 in n._def.defaults) {
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
  }

  /**
   * Process new subflows
   * Updates the node output and input wires and configures and adds new links
   *
   * @param new_subflows { Node[] } the new subflows to be processed
   * @param config { Object } subflow related colletions
   * @returns void
   */
  _processNewSubflows(new_subflows: Node[], config: any): void {
    const {
      nodes
    } = this

    let {
      node_map,
      new_links,
      subflow_map
    } = config

    const {
      addLink
    } = this.rebind([
        'addLink'
      ], nodes)

    let n
    for (let i = 0; i < new_subflows.length; i++) {
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
          addLink(link);
          new_links.push(link);
        });
        delete output.wires;
      });
    }
  }

  /**
   * Import nodes from a string (JSON serialization) reprepresentation
   * - normalize nodes
   * - find unknown Node types
   * - notify user about unknown types found
   * - validate subflows
   * - find tabs and subflow templates
   * - add tab for subflow if not present
   * - find and update config nodes
   * - find regular nodes and subflows
   * - remap wires and config node refs
   * - process/update nodes using new subflows
   *
   * @param newNodesObj { Node } the node definitions to import
   * @param createNewIds { boolean } create IDs of imported nodes if not in import definitions
   * @param createMissingWorkspace { boolean } create missing workspace if no such workspace exists
   *
   * @returns { [new_nodes, new_links, new_workspaces, new_subflows, missingWorkspace] }
   *
   * TODO: should return an object NodesImport rather than a list!
   */
  importNodes(newNodesObj: any, createNewIds: boolean, createMissingWorkspace: boolean): any[] {
    const {
      nodes
    } = this
    const {
      RED,
      registry,
    } = nodes

    let {
      initialLoad,
      defaultWorkspace,
      workspaces,
      configNodes
    } = nodes

    const {
      subflowContains,
      getSubflow,
      addWorkspace,
      addSubflow,
      checkForMatchingSubflow,
      getID,
      compareNodes,
      addNode,
      addLink
    } = this.rebind([
        'subflowContains',
        'getSubflow',
        'addWorkspace',
        'addSubflow',
        'checkForMatchingSubflow',
        'getID',
        'compareNodes',
        'addNode',
        'addLink'
      ], nodes)

    var n;

    const newNodes = this._normalize(newNodesObj)
    initialLoad = !initialLoad ? JSON.parse(JSON.stringify(newNodes)) : initialLoad

    let { unknownTypes, nodeZmap } = this._findUnknownTypes(newNodes)
    this._notifyUnknownTypes(unknownTypes)
    let { activeWorkspace, activeSubflow } = this._validateSubflows(newNodes)

    var new_links = [];
    var nid;
    var def;
    var configNode;

    let {
      subflow_blacklist,
      subflow_map,
      new_workspaces,
      workspace_map,
      new_subflows
    } = this._findTabsAndSubflowTemplates(newNodes, nodeZmap, createNewIds)

    // Add a tab if there isn't one there already
    // WARNING: will update the arguments as side effects
    // TODO: Fix
    this._addTab(new_workspaces, activeWorkspace)

    let {
      missingWorkspace,
      new_nodes,
      node_map
    } = this._findAndUpdateConfigNodes(newNodes, createNewIds, createMissingWorkspace, {
        subflow_blacklist,
        subflow_map,
        workspace_map,
        workspaces,
        new_workspaces,
        activeWorkspace,
        configNodes
      })

    let result = this._findRegularNodesAndSubflows(newNodes, createNewIds, createMissingWorkspace, {
      subflow_blacklist,
      subflow_map,
      workspace_map,
      workspaces,
      missingWorkspace,
      new_workspaces,
      activeWorkspace,
      node_map,
      new_nodes
    })
    missingWorkspace = result.missingWorkspace

    // remap all wires
    this._remapWiresAndConfigNodeRefs(newNodes, {
      node_map,
      new_links,
      configNode,
      activeSubflow,
      activeWorkspace
    })

    this._processNewSubflows(new_subflows, {
      node_map,
      new_links,
      subflow_map
    })

    RED.workspaces.refresh();
    // TODO: return an object not a list!
    return [new_nodes, new_links, new_workspaces, new_subflows, missingWorkspace];
  }
}

