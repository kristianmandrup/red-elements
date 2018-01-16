import {
  Context
} from '../../../context'

import {
  INodes,
  Nodes
} from '../'

import {
  INode,
  ISubflow,
  IWorkspace,
  ILink
} from '../../../interfaces'

export interface IConverter {
  convertWorkspace(n: INode): IWorkspace
  convertNode(n: INode, exportCreds: boolean): INode
  convertSubflow(n: INode): ISubflow
}

export class Converter extends Context {
  constructor(public nodes: INodes) {
    super()
  }

  /**
   * Convert a node to a workspace
   * @param n { Node } the node to convert
   */
  convertWorkspace(n: INode): IWorkspace {
    var node: IWorkspace = {
      name: null,
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
   * @param n { Node } the node to convert
   * @param exportCreds { boolean } if node (user) credentials should also be exported
   **/
  convertNode(n: INode, exportCreds: boolean): INode {
    const {
      links
    } = this.nodes

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
      var wires = links.filter(function (d: ILink) {
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

  /**
   * Convert a node to a Subflow
   * @param n { Node } node to convert
   */
  convertSubflow(n: INode): ISubflow {
    const {
      links
    } = this.nodes

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
      var wires = links.filter((d) => {
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
      var wires = links.filter(function (d: ILink) {
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
}
