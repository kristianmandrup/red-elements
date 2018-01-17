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

import clone from 'clone'
import {
  Util
} from '../../util'

import {
  Context
} from '../../context'

export interface INodesContext {
  createContext(id: string, seed: number)
  get(localId: string, flowId: string): any
  delete(id: string, flowId: string): void
  clean(flowConfig: any): void
}

export class NodesContext extends Context {
  contexts = {}
  globalContext = null
  util: any = new Util()

  constructor(settings: any = {}) {
    super()
    this.globalContext = this.createContext('global', settings.functionGlobalContext || {});
  }

  createContext(id: string, seed: number) {
    const {
      util
    } = this

    var data = seed || {};
    var obj: any = seed || {};
    obj.get = function get(key) {
      return util.getMessageProperty(data, key);
    };
    obj.set = function set(key, value) {
      util.setMessageProperty(data, key, value);
    }
    return obj;
  }


  get(localId: string, flowId: string): any {
    const {
      contexts,
      globalContext
    } = this
    const {
      createContext,
      getContext
    } = this.rebind([
        'createContext',
        'getContext'
      ])

    var contextId = localId;
    if (flowId) {
      contextId = localId + ':' + flowId;
    }
    if (contexts.hasOwnProperty(contextId)) {
      return contexts[contextId];
    }
    var newContext = createContext(contextId);
    if (flowId) {
      newContext.flow = getContext(flowId);
    }
    if (globalContext) {
      newContext.global = globalContext;
    }
    contexts[contextId] = newContext;
    return newContext;
  }

  delete(id: string, flowId: string): void {
    const {
      contexts
    } = this

    var contextId = id;
    if (flowId) {
      contextId = id + ':' + flowId;
    }
    delete contexts[contextId];
  }

  clean(flowConfig: any): void {
    const {
      contexts
    } = this

    var activeIds = {};
    var contextId;
    var node;
    for (var id in contexts) {
      if (contexts.hasOwnProperty(id)) {
        var idParts = id.split(':');
        if (!flowConfig.allNodes.hasOwnProperty(idParts[0])) {
          delete contexts[id];
        }
      }
    }
  }
};
