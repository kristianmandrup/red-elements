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
import {
  Context,
  $
} from '../context'

const { log } = console

export class Validators extends Context {
  constructor() {
    super()
  }

  number(blankAllowed) {
    return function (v) {
      return (blankAllowed && (v === '' || v === undefined)) || (v !== '' && !isNaN(v));
    }
  }

  regex(re) {
    return function (v) {
      return re.test(v);
    }
  }

  typedInput(ptypeName, isConfig) {
    return (v) => {
      const nodeConfigElem = $('#node-' + (isConfig ? 'config-' : '') + 'input-' + ptypeName)
      let ptypeElem
      if (nodeConfigElem) {
        ptypeElem = nodeConfigElem.val()
      }
      let ptypeProp = this[ptypeName]
      var ptype = ptypeElem || ptypeProp;
      if (!ptype) {
        this.logWarning(`no validator ptype for ${ptypeName}`, {
          ptypeName,
          ptypeElem,
          ptypeProp,
          v
        })
      }
      if (ptype === 'json') {
        return this.validateJson(v)
      } else if (ptype === 'msg' || ptype === 'flow' || ptype === 'global') {
        return this.validateProp(v);
      } else if (ptype === 'num') {
        return this.validateNumber(v)
      }
      return true;
    }
  }

  validateJson(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  validateNumber(value) {
    return /^[+-]?[0-9]*\.?[0-9]*([eE][-+]?[0-9]+)?$/.test(value);
  }

  validateProp(value) {
    const ctx = this.ctx;
    return ctx.utils.validatePropertyExpression(value);
  }
}
