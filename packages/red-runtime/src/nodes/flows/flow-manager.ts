// TODO: extract from Flow class

import {
  Context
} from '../../context'
import { Flows } from './index';
import { IFlow } from '../flow/index';

import {
  clone
} from '../../_libs'

export class FlowManager extends Context {
  constructor(protected flows: Flows) {
    super()
  }

  /**
   * get list of flows
   * @returns { IFlow[] } list of flows
   */
  getFlows(): IFlow[] {
    return this.flows.activeConfig;
  }

  /**
   * Add flow
   * @param flow
   */
  async addFlow(flow: IFlow): Promise<any> {
    const {
      flows
    } = this
    const {
      activeConfig,
      activeFlowConfig,
      log, // service
      redUtil // service
    } = flows
    const {
      setFlows,
    } = this.rebind([
        'setFlows',
      ])

    var i, node;
    if (!flow.hasOwnProperty('nodes')) {
      throw new Error('missing nodes property');
    }
    flow.id = redUtil.generateId();

    var nodes = [{
      type: 'tab',
      label: flow.label,
      id: flow.id
    }];

    for (i = 0; i < flow.nodes.length; i++) {
      node = flow.nodes[i];
      if (activeFlowConfig.allNodes[node.id]) {
        // TODO nls
        return Promise.reject(new Error('duplicate id'));
      }
      if (node.type === 'tab' || node.type === 'subflow') {
        return Promise.reject(new Error('invalid node type: ' + node.type));
      }
      node.z = flow.id;
      nodes.push(node);
    }
    if (flow.configs) {
      for (i = 0; i < flow.configs.length; i++) {
        node = flow.configs[i];
        if (activeFlowConfig.allNodes[node.id]) {
          // TODO nls
          return Promise.reject(new Error('duplicate id'));
        }
        if (node.type === 'tab' || node.type === 'subflow') {
          return Promise.reject(new Error('invalid node type: ' + node.type));
        }
        node.z = flow.id;
        nodes.push(node);
      }
    }
    var newConfig = clone(activeConfig.flows);
    newConfig = newConfig.concat(nodes);

    return setFlows(newConfig, 'flows', true).then(function () {
      log.info(log._("nodes.flows.added-flow", {
        label: (flow.label ? flow.label + " " : "") + "[" + flow.id + "]"
      }));
      return flow.id;
    });
  }

  /**
   * Get flow by ID
   * @param id
   */
  getFlow(id: string) {
    const {
      activeFlowConfig
    } = this.flows

    var flow;
    if (id === 'global') {
      flow = activeFlowConfig;
    } else {
      flow = activeFlowConfig.flows[id];
    }
    if (!flow) {
      return null;
    }
    var result: any = {
      id: id
    };
    if (flow.label) {
      result.label = flow.label;
    }
    if (id !== 'global') {
      result.nodes = [];
    }
    if (flow.nodes) {
      var nodeIds = Object.keys(flow.nodes);
      if (nodeIds.length > 0) {
        result.nodes = nodeIds.map(function (nodeId) {
          var node = clone(flow.nodes[nodeId]);
          if (node.type === 'link out') {
            delete node.wires;
          }
          return node;
        })
      }
    }
    if (flow.configs) {
      var configIds = Object.keys(flow.configs);
      result.configs = configIds.map(function (configId) {
        return clone(flow.configs[configId]);
      })
      if (result.configs.length === 0) {
        delete result.configs;
      }
    }
    if (flow.subflows) {
      var subflowIds = Object.keys(flow.subflows);
      result.subflows = subflowIds.map(function (subflowId) {
        var subflow = clone(flow.subflows[subflowId]);
        var nodeIds = Object.keys(subflow.nodes);
        subflow.nodes = nodeIds.map(function (id) {
          return subflow.nodes[id];
        });
        if (subflow.configs) {
          var configIds = Object.keys(subflow.configs);
          subflow.configs = configIds.map(function (id) {
            return subflow.configs[id];
          })
        }
        delete subflow.instances;
        return subflow;
      });
      if (result.subflows.length === 0) {
        delete result.subflows;
      }
    }
    return result;
  }

  /**
   * Update flow by ID
   * @param id - id of flow to update
   * @param newFlow new Flow to update with
   */
  updateFlow(id: string, newFlow: IFlow) {
    const {
      log, // service
      activeFlowConfig,
      activeConfig
    } = this.flows

    const {
      setFlows,
    } = this.rebind([
        'setFlows',
      ])

    var label = id;
    if (id !== 'global') {
      if (!activeFlowConfig.flows[id]) {
        const e: any = new Error();
        e.code = 404;
        throw e;
      }
      label = activeFlowConfig.flows[id].label;
    }
    var newConfig = clone(activeConfig.flows);
    var nodes;

    if (id === 'global') {
      // Remove all nodes whose z is not a known flow
      // When subflows can be owned by a flow, this logic will have to take
      // that into account
      newConfig = newConfig.filter(function (node) {
        return node.type === 'tab' || (node.hasOwnProperty('z') && activeFlowConfig.flows.hasOwnProperty(node.z));
      })

      // Add in the new config nodes
      nodes = newFlow.configs || [];
      if (newFlow.subflows) {
        // Add in the new subflows
        newFlow.subflows.forEach(function (sf) {
          nodes = nodes.concat(sf.nodes || []).concat(sf.configs || []);
          delete sf.nodes;
          delete sf.configs;
          nodes.push(sf);
        });
      }
    } else {
      newConfig = newConfig.filter(function (node) {
        return node.z !== id && node.id !== id;
      });
      var tabNode = {
        type: 'tab',
        label: newFlow.label,
        id: id
      }
      nodes = [tabNode].concat(newFlow.nodes || []).concat(newFlow.configs || []);
      nodes.forEach(function (n) {
        n.z = id;
      });
    }

    newConfig = newConfig.concat(nodes);
    return setFlows(newConfig, 'flows', true).then(function () {
      log.info(log._("nodes.flows.updated-flow", {
        label: (label ? label + " " : "") + "[" + id + "]"
      }));
    })
  }

  /**
   * Remove flow by ID
   * @param id - id of flow to remove
   */
  removeFlow(id: string) {
    const {
      log, // service
      activeFlowConfig,
      activeConfig
    } = this.flows

    const {
      setFlows,
    } = this.rebind([
        'setFlows',
      ])


    if (id === 'global') {
      // TODO: nls + error code
      throw new Error('not allowed to remove global');
    }
    var flow = activeFlowConfig.flows[id];
    if (!flow) {
      const e: any = new Error();
      e.code = 404;
      throw e;
    }

    var newConfig = clone(activeConfig.flows);
    newConfig = newConfig.filter(function (node) {
      return node.z !== id && node.id !== id;
    });

    return setFlows(newConfig, 'flows', true).then(function () {
      log.info(log._("nodes.flows.removed-flow", {
        label: (flow.label ? flow.label + " " : "") + "[" + flow.id + "]"
      }));
    });
  }
}
