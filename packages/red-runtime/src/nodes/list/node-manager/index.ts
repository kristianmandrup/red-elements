import {
  Nodes,
  INodes
} from '../'

import {
  Context
} from '../../../context'

// TODO: import from red-interfaces, central interface hub
import {
  INode,
  IWorkspaces,
  IEvents
} from '../../../interfaces'

import {
  lazyInject,
} from '../../../_container';

// TODO: move $TYPES to red-base
import {
  $TYPES
} from '@tecla5/red-base'

const { log } = console

export interface INodeManager {
  addNode(n: INode): INodes
  getNode(id: string): INode
  removeNode(id: string): any
  updateConfigNodeUsers(n: INode)
}

export class NodeManager extends Context {
  @lazyInject($TYPES.all.workspaces) $workspaces: IWorkspaces
  @lazyInject($TYPES.all.nodes) $nodes: INodes
  @lazyInject($TYPES.all.nodes) $events: IEvents

  constructor(public nodes: INodes) {
    super()
  }

  updateConfigNodeUsers(n: INode) {
    this._updateConfigNodeUsers(n);
  }

  /**
   * Add a node
   * @param n { Node } the node to add
   */
  addNode(n: INode): INodes {
    const {
      nodes,
      RED,
      configNodes
    } = this.nodes

    const {
      _updateConfigNodeUsers
    } = this.rebind([
        '_updateConfigNodeUsers'
      ], this)

    this._validateNode(n, 'n', 'addNode')
    this._validateNodeDef(n._def, 'n._def', 'addNode')

    if (n.type.indexOf("subflow") !== 0) {
      n["_"] = n._def._;
    } else {
      n["_"] = RED._;
    }
    if (n._def.category == "config") {
      configNodes[n.id] = n;
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
      _updateConfigNodeUsers(n);
      if (n._def.category == "subflows" && typeof n.i === "undefined") {
        var nextId = 0;
        RED.nodes.eachNode(function (node: INode) {
          nextId = Math.max(nextId, node.i || 0);
        });
        n.i = nextId + 1;
      }
      nodes.push(n);
    }
    RED.events.emit('nodes:add', n);

    return this.nodes
  }

  /**
   * Find and return a node by ID
   * @param id {string} id of node to find
   */
  getNode(id: string): INode | null {
    const {
      nodes,
      configNodes
    } = this.nodes

    if (id in configNodes) {
      return configNodes[id];
    } else {
      for (var n in nodes) {
        if (nodes[n].id == id) {
          return nodes[n];
        }
      }
    }
    return null;
  }

  /**
   * Remove a node from the canvas by ID
   * @param id {string} id of node to remove
   */
  removeNode(id: string): any {
    const {
      RED,
      configNodes,
      nodes,
      links,
      registry,
      n
    } = this.nodes

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

  // Update any config nodes referenced by the provided node to ensure their 'users' list is correct
  /**
   * Update configured users with the user of a given node
   * @param n { Node } update config users of node
   */
  protected _updateConfigNodeUsers(n: INode) {
    const {
      registry,
      configNodes
    } = this.nodes

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
}
