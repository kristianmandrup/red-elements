/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {
  Context
} from '../../context'

import clone from 'clone'
import when from 'when'

var Flow = require('../flow');

var typeRegistry = require("../registry");
var context = require("../context")
var credentials = require("../credentials");

// TODO: register as services and inject instead!
import {
  FlowUtils
} from './flow-utils'
import {
  Logger
} from '../../log'
import {
  Events,
  IEvents
} from '../../events'
import {
  Util as RedUtil
} from '../../util'

var deprecated = require("../registry/deprecated");

export class Flows extends Context {
  storage = null
  settings = null
  activeConfig = null
  activeFlowConfig = null
  activeFlows = {}
  activeNodesToFlow = {}
  subflowInstanceNodeMap = {}
  typeEventRegistered = false
  protected _started = false

  // TODO: Fix - temporary until proper service injection
  events: IEvents = new Events()
  log: any = new Logger()
  redUtil: any = new RedUtil()
  flowUtil: any = new FlowUtils()

  /**
   * TODO:
   * inject as services
   * - events: Event
   * - log: Logger
   * - flowUtil: Util
   *
   * @param runtime - NOT NEEDED, use service injection!
   */
  constructor(runtime) {
    super()
    let {
      started,
      settings,
      storage,
      typeEventRegistered,
      activeFlowConfig
    } = this

    const {
      events,
      log
    } = this

    const {
      startFlows
    } = this.rebind([
        'startFlows'
      ])

    if (started) {
      throw new Error("Cannot init without a stop");
    }
    settings = runtime.settings; // service
    storage = runtime.storage; // service
    started = false;
    if (!typeEventRegistered) {
      events.on('type-registered', function (type) {
        if (activeFlowConfig && activeFlowConfig.missingTypes.length > 0) {
          var i = activeFlowConfig.missingTypes.indexOf(type);
          if (i != -1) {
            log.info(log._("nodes.flows.registered-missing", {
              type: type
            }));
            activeFlowConfig.missingTypes.splice(i, 1);
            if (activeFlowConfig.missingTypes.length === 0 && started) {
              events.emit("runtime-event", {
                id: "runtime-state"
              });
              startFlows();
            }
          }
        }
      });
      typeEventRegistered = true;
    }

    this.setInstanceVars({
      started,
      settings,
      storage,
      typeEventRegistered
    })
  }

  get started() {
    return this._started
  }

  /**
   * Load the current flow configuration from storage
   * @return a promise for the loading of the config
   */
  load() {
    return this.setFlows(null, "load", false);
  }

  /**
   * Sets the current active config.
   * @param config the configuration to enable
   * @param type the type of deployment to do: full (default), nodes, flows, load
   * @return a promise for the saving/starting of the new flow
   */
  /*
   * _config - new node array configuration
   * type - full/nodes/flows/load (default full)
   * muteLog - don't emit the standard log messages (used for individual flow api)
   */
  setFlows(_config, type, muteLog) {
    const {
      started,
      storage,
      log, // service
      flowUtil // service
    } = this
    let {
      activeFlowConfig,
      activeConfig,
    } = this

    const {
      loadFlows,
      stopFlows,
      startFlows
    } = this.rebind([
        'loadFlows',
        'stopFlows',
        'startFlows'
      ])

    type = type || "full";

    var configSavePromise = null;
    var config = null;
    var diff;
    var newFlowConfig;
    var isLoad = false;
    if (type === "load") {
      isLoad = true;
      configSavePromise = loadFlows().then(function (_config) {
        config = clone(_config.flows);
        newFlowConfig = flowUtil.parseConfig(clone(config));
        type = "full";
        return _config.rev;
      });
    } else {
      config = clone(_config);
      newFlowConfig = flowUtil.parseConfig(clone(config));
      if (type !== 'full') {
        diff = flowUtil.diffConfigs(activeFlowConfig, newFlowConfig);
      }
      credentials.clean(config);
      var credsDirty = credentials.dirty();
      configSavePromise = credentials.export().then(function (creds) {
        var saveConfig = {
          flows: config,
          credentialsDirty: credsDirty,
          credentials: creds
        }
        return storage.saveFlows(saveConfig);
      });
    }

    return configSavePromise
      .then(function (flowRevision) {
        if (!isLoad) {
          log.debug("saved flow revision: " + flowRevision);
        }
        activeConfig = {
          flows: config,
          rev: flowRevision
        };
        activeFlowConfig = newFlowConfig;
        if (started) {
          return stopFlows(type, diff, muteLog).then(function () {
            context.clean(activeFlowConfig);
            startFlows(type, diff, muteLog);
            return flowRevision;
          }).otherwise(function (err) { })
        }
      });
  }

  loadFlows() {
    const {
      storage,
      log // service
    } = this

    return storage.getFlows().then(function (config) {
      log.debug("loaded flow revision: " + config.rev);
      return credentials.load(config.credentials).then(function () {
        return config;
      });
    }).otherwise(function (err) {
      log.warn(log._("nodes.flows.error", {
        message: err.toString()
      }));
      console.log(err.stack);
    });
  }

  getNode(id) {
    const {
      activeNodesToFlow,
      activeFlows
    } = this

    var node;
    if (activeNodesToFlow[id] && activeFlows[activeNodesToFlow[id]]) {
      return activeFlows[activeNodesToFlow[id]].getNode(id);
    }
    for (var flowId in activeFlows) {
      if (activeFlows.hasOwnProperty(flowId)) {
        node = activeFlows[flowId].getNode(id);
        if (node) {
          return node;
        }
      }
    }
    return null;
  }

  eachNode(cb) {
    const {
      activeFlowConfig
    } = this

    for (var id in activeFlowConfig.allNodes) {
      if (activeFlowConfig.allNodes.hasOwnProperty(id)) {
        cb(activeFlowConfig.allNodes[id]);
      }
    }
  }

  getFlows() {
    return this.activeConfig;
  }


  delegateError(node, logMessage, msg) {
    const {
      activeNodesToFlow,
      activeFlows,
      activeFlowConfig,
      subflowInstanceNodeMap
    } = this

    const {
      delegateError,
      getNode
    } = this.rebind([
        'delegateError',
        'getNode'
      ])

    if (activeFlows[node.z]) {
      activeFlows[node.z].handleError(node, logMessage, msg);
    } else if (activeNodesToFlow[node.z] && activeFlows[activeNodesToFlow[node.z]]) {
      activeFlows[activeNodesToFlow[node.z]].handleError(node, logMessage, msg);
    } else if (activeFlowConfig.subflows[node.z] && subflowInstanceNodeMap[node.id]) {
      subflowInstanceNodeMap[node.id].forEach(function (n) {
        delegateError(getNode(n), logMessage, msg);
      });
    }
  }

  $handleError(node, logMessage, msg) {
    const {
      activeFlowConfig,
    } = this
    const {
      delegateError,
    } = this.rebind([
        'delegateError',
      ])

    if (node.z) {
      delegateError(node, logMessage, msg);
    } else {
      if (activeFlowConfig.configs[node.id]) {
        activeFlowConfig.configs[node.id]._users.forEach(function (id) {
          var userNode = activeFlowConfig.allNodes[id];
          delegateError(userNode, logMessage, msg);
        })
      }
    }
  }

  delegateStatus(node, statusMessage) {
    const {
      activeFlowConfig,
      activeFlows,
      activeNodesToFlow
    } = this
    if (activeFlows[node.z]) {
      activeFlows[node.z].handleStatus(node, statusMessage);
    } else if (activeNodesToFlow[node.z] && activeFlows[activeNodesToFlow[node.z]]) {
      activeFlows[activeNodesToFlow[node.z]].handleStatus(node, statusMessage);
    }
  }

  handleStatus(node, statusMessage) {
    const {
      events, // service
      activeFlowConfig,
    } = this
    const {
      delegateStatus,
    } = this.rebind([
        'delegateStatus',
      ])

    events.emit("node-status", {
      id: node.id,
      status: statusMessage
    });
    if (node.z) {
      delegateStatus(node, statusMessage);
    } else {
      if (activeFlowConfig.configs[node.id]) {
        activeFlowConfig.configs[node.id]._users.forEach(function (id) {
          var userNode = activeFlowConfig.allNodes[id];
          delegateStatus(userNode, statusMessage);
        })
      }
    }
  }

  startFlows(type, diff, muteLog) {
    const {
      events, // service
      settings, // service
      log, // service
      activeFlowConfig,
      activeFlows,
      activeNodesToFlow,
      subflowInstanceNodeMap
    } = this
    let {
      started
    } = this

    //dumpActiveNodes();
    type = type || "full";
    started = true;
    var i;
    if (activeFlowConfig.missingTypes.length > 0) {
      log.info(log._("nodes.flows.missing-types"));
      var knownUnknowns = 0;
      for (i = 0; i < activeFlowConfig.missingTypes.length; i++) {
        var nodeType = activeFlowConfig.missingTypes[i];
        var info = deprecated.get(nodeType);
        if (info) {
          log.info(log._("nodes.flows.missing-type-provided", {
            type: activeFlowConfig.missingTypes[i],
            module: info.module
          }));
          knownUnknowns += 1;
        } else {
          log.info(" - " + activeFlowConfig.missingTypes[i]);
        }
      }
      if (knownUnknowns > 0) {
        log.info(log._("nodes.flows.missing-type-install-1"));
        log.info("  npm install <module name>");
        log.info(log._("nodes.flows.missing-type-install-2"));
        log.info("  " + settings.userDir);
      }
      events.emit("runtime-event", {
        id: "runtime-state",
        type: "warning",
        text: "notification.warnings.missing-types"
      });
      return when.resolve();
    }
    if (!muteLog) {
      if (diff) {
        log.info(log._("nodes.flows.starting-modified-" + type));
      } else {
        log.info(log._("nodes.flows.starting-flows"));
      }
    }
    var id;
    if (!diff) {
      if (!activeFlows['global']) {
        activeFlows['global'] = Flow.create(activeFlowConfig);
      }
      for (id in activeFlowConfig.flows) {
        if (activeFlowConfig.flows.hasOwnProperty(id)) {
          if (!activeFlows[id]) {
            activeFlows[id] = Flow.create(activeFlowConfig, activeFlowConfig.flows[id]);
          }
        }
      }
    } else {
      activeFlows['global'].update(activeFlowConfig, activeFlowConfig);
      for (id in activeFlowConfig.flows) {
        if (activeFlowConfig.flows.hasOwnProperty(id)) {
          if (activeFlows[id]) {
            activeFlows[id].update(activeFlowConfig, activeFlowConfig.flows[id]);
          } else {
            activeFlows[id] = Flow.create(activeFlowConfig, activeFlowConfig.flows[id]);
          }
        }
      }
    }

    for (id in activeFlows) {
      if (activeFlows.hasOwnProperty(id)) {
        activeFlows[id].start(diff);
        var activeNodes = activeFlows[id].getActiveNodes();
        Object.keys(activeNodes).forEach(function (nid) {
          activeNodesToFlow[nid] = id;
          if (activeNodes[nid]._alias) {
            subflowInstanceNodeMap[activeNodes[nid]._alias] = subflowInstanceNodeMap[activeNodes[nid]._alias] || [];
            subflowInstanceNodeMap[activeNodes[nid]._alias].push(nid);
          }
        });

      }
    }
    events.emit("nodes-started");
    events.emit("runtime-event", {
      id: "runtime-state"
    });

    if (!muteLog) {
      if (diff) {
        log.info(log._("nodes.flows.started-modified-" + type));
      } else {
        log.info(log._("nodes.flows.started-flows"));
      }
    }
    return when.resolve();
  }

  stopFlows(type, diff, muteLog) {
    const {
      log, // service
      activeFlows,
      activeNodesToFlow
    } = this
    let {
      _started,
      subflowInstanceNodeMap
    } = this

    type = type || "full";
    if (!muteLog) {
      if (diff) {
        log.info(log._("nodes.flows.stopping-modified-" + type));
      } else {
        log.info(log._("nodes.flows.stopping-flows"));
      }
    }
    _started = false;
    var promises = [];
    var stopList;
    if (type === 'nodes') {
      stopList = diff.changed.concat(diff.removed);
    } else if (type === 'flows') {
      stopList = diff.changed.concat(diff.removed).concat(diff.linked);
    }
    for (var id in activeFlows) {
      if (activeFlows.hasOwnProperty(id)) {
        promises = promises.concat(activeFlows[id].stop(stopList));
        if (!diff || diff.removed.indexOf(id) !== -1) {
          delete activeFlows[id];
        }
      }
    }

    return when.promise(function (resolve, reject) {
      when.settle(promises).then(function () {
        for (id in activeNodesToFlow) {
          if (activeNodesToFlow.hasOwnProperty(id)) {
            if (!activeFlows[activeNodesToFlow[id]]) {
              delete activeNodesToFlow[id];
            }
          }
        }
        if (stopList) {
          stopList.forEach(function (id) {
            delete activeNodesToFlow[id];
          });
        }
        // Ideally we'd prune just what got stopped - but mapping stopList
        // id to the list of subflow instance nodes is something only Flow
        // can do... so cheat by wiping the map knowing it'll be rebuilt
        // in start()
        subflowInstanceNodeMap = {};
        if (!muteLog) {
          if (diff) {
            log.info(log._("nodes.flows.stopped-modified-" + type));
          } else {
            log.info(log._("nodes.flows.stopped-flows"));
          }
        }

        // set instance var
        this.subflowInstanceNodeMap = subflowInstanceNodeMap

        resolve();
      });
    });
  }

  checkTypeInUse(id) {
    const {
      log
    } = this
    const {
      getFlows,
    } = this.rebind([
        'getFlows',
      ])

    var nodeInfo = typeRegistry.getNodeInfo(id);
    if (!nodeInfo) {
      throw new Error(log._("nodes.index.unrecognised-id", {
        id: id
      }));
    } else {
      var inUse = {};
      var config = getFlows();
      config.flows.forEach(function (n) {
        inUse[n.type] = (inUse[n.type] || 0) + 1;
      });
      var nodesInUse = [];
      nodeInfo.types.forEach(function (t) {
        if (inUse[t]) {
          nodesInUse.push(t);
        }
      });
      if (nodesInUse.length > 0) {
        const msg = nodesInUse.join(", ");
        const err: any = new Error(log._("nodes.index.type-in-use", {
          msg
        }));
        err.code = "type_in_use";
        throw err;
      }
    }
  }

  updateMissingTypes() {
    const {
      activeFlowConfig
    } = this

    var subflowInstanceRE = /^subflow:(.+)$/;
    activeFlowConfig.missingTypes = [];

    for (var id in activeFlowConfig.allNodes) {
      if (activeFlowConfig.allNodes.hasOwnProperty(id)) {
        var node = activeFlowConfig.allNodes[id];
        if (node.type !== 'tab' && node.type !== 'subflow') {
          var subflowDetails = subflowInstanceRE.exec(node.type);
          if ((subflowDetails && !activeFlowConfig.subflows[subflowDetails[1]]) || (!subflowDetails && !typeRegistry.get(node.type))) {
            if (activeFlowConfig.missingTypes.indexOf(node.type) === -1) {
              activeFlowConfig.missingTypes.push(node.type);
            }
          }
        }
      }
    }
  }

  addFlow(flow) {
    const {
      activeConfig,
      activeFlowConfig,
      log, // service
      redUtil // service
    } = this
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
        return when.reject(new Error('duplicate id'));
      }
      if (node.type === 'tab' || node.type === 'subflow') {
        return when.reject(new Error('invalid node type: ' + node.type));
      }
      node.z = flow.id;
      nodes.push(node);
    }
    if (flow.configs) {
      for (i = 0; i < flow.configs.length; i++) {
        node = flow.configs[i];
        if (activeFlowConfig.allNodes[node.id]) {
          // TODO nls
          return when.reject(new Error('duplicate id'));
        }
        if (node.type === 'tab' || node.type === 'subflow') {
          return when.reject(new Error('invalid node type: ' + node.type));
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

  getFlow(id) {
    const {
      activeFlowConfig
    } = this

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

  updateFlow(id, newFlow) {
    const {
      log, // service
      activeFlowConfig,
      activeConfig
    } = this

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

  removeFlow(id) {
    const {
      log, // service
      activeFlowConfig,
      activeConfig
    } = this

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

