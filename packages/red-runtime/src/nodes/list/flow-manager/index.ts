import {
  INodes
} from '../'

import {
  Context
} from '../../../context'

import {
  IFlow,
  ISubflow,
  INode
} from '../../../interfaces'

const { log } = console

export interface IFlowManager {
  addSubflow(sf: ISubflow, createNewIds: boolean): INodes
  getSubflow(id: string): ISubflow
  removeSubflow(sf: string | ISubflow): INodes
  subflowContains(sfid: string, nodeid: string): boolean
  getAllFlowNodes(node: INode)
  flowVersion(version): string
  originalFlow(flow: IFlow)
}


export class FlowManager extends Context implements IFlowManager {
  constructor(public nodes: INodes) {
    super()
  }

  /**
   * Add a Subflow of nodes
   * @param sf { Subflow } subflow to add
   * @param createNewIds { boolean } whether to create new node IDs as well
   */
  addSubflow(sf: ISubflow, createNewIds: boolean): INodes {
    const {
      RED,
      subflows
    } = this.nodes

    this._validateNode(sf, 'sf', 'addSubflow')

    if (createNewIds) {
      var subflowNames = Object.keys(subflows).map(function (sfid: string) {
        return subflows[sfid].name;
      });

      subflowNames.sort();
      var copyNumber = 1;
      var subflowName = sf.name;
      subflowNames.forEach(function (name: string) {
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
      inputLabels: function (i: number) {
        return sf.inputLabels ? sf.inputLabels[i] : null
      },
      outputLabels: function (i: number) {
        return sf.outputLabels ? sf.outputLabels[i] : null
      },
      set: {
        module: "node-red"
      }
    });
    sf._def = RED.nodes.getType("subflow:" + sf.id);

    return this.nodes
  }

  /**
   * Get a subflow by ID
   * @param id { string } ID of subflow to get
   */
  getSubflow(id: string) {
    const { subflows } = this.nodes
    return subflows[id];
  }

  /**
   * Remove a subflow
   * @param sf { string | Subflow } subflow to remove
   */
  removeSubflow(sf: string | ISubflow): INodes {
    const { subflows, registry } = this.nodes

    const id: string = typeof sf === 'string' ? sf : sf.id

    delete this.nodes.subflows[id];
    registry.removeNodeType("subflow:" + id);
    return this.nodes
  }

  // TODO: split up function into smaller parts to make easier to track and test internals

  /**
   * Test if subflow contains a node with a specific ID
   * @param sfid { Subflow } subflow to test on
   * @param nodeid { string } node ID to test each node in flow for
   * @returns { boolean } whether subflow contains node with given ID
   */
  subflowContains(sfid: string, nodeid: string): boolean {
    this._validateStr(sfid, 'sfid', 'subflowContains')
    this._validateStr(nodeid, 'nodeid', 'subflowContains')

    const { nodes } = this.nodes
    log('subflowContains', {
      sfid,
      nodeid
    })

    // instantiate a helper class SubflowMatcher with sfid and nodeid and constructor params
    // move functions in here
    // test helper class SubflowMatcher on its own

    for (var i = 0; i < nodes.length; i++) {
      if (this._checkSubflowContains(sfid, nodeid, i)) {
        return true
      }
    }
    return false;
  }

  _checkSubflowContains(sfid: string, nodeid: string, i: number): boolean {
    const { nodes } = this.nodes
    const {
      subflowContains
    } = this.rebind([
        'subflowContains'
      ])

    var node = nodes[i];

    // TODO: further decompose into smaller functions to reduce complexity and avoid nested ifs
    if (node.z === sfid) {
      // https://developer.mozilla.org/th/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
      var m = /^subflow:(.+)$/.exec(node.type);
      log('match', {
        type: node.type,
        m
      })

      // make this a new protected function
      if (m) {
        log('node matching on ^subflow:(.+)$', {
          m,
          type: node.type,
        })

        // make this a new protected function
        if (m[1] === nodeid) {
          return true;
        } else {
          log('recurse node matching', {
            m1: m[1],
            nodeid
          })
          var result = this.subflowContains(m[1], nodeid);
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

  /**
   * Get all the flow nodes related to a node
   * @param node { Node } the node to find all flow nodes from
   * @returns { Node[] } all the flow nodes found for the node
   */
  getAllFlowNodes(node: INode): INode[] {
    const {
      links
    } = this.nodes

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

  // TODO: use getter/setter
  /**
   * get/set the flow version
   * @param version { string } version of flow
   * @returns { string } flow version
   */
  flowVersion(version): string {
    let {
      loadedFlowVersion
    } = this.nodes

    if (version !== undefined) {
      loadedFlowVersion = version;
    }
    this.setInstanceVars({ loadedFlowVersion }, this.nodes)
    return loadedFlowVersion;
  }

  /**
   * Return the original flow definition
   * @param flow { Flow } the flow
   */
  originalFlow(flow: IFlow) {
    let {
      initialLoad
    } = this.nodes
    if (flow === undefined) {
      return initialLoad;
    } else {
      initialLoad = flow;
      this.setInstanceVars({ initialLoad }, this.nodes)
    }
  }
}

