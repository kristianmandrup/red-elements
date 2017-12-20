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
  Context
} from '../context'

import { Utils } from './utils'

function validateNumber(v) {
  return /^[+-]?[0-9]*\.?[0-9]*([eE][-+]?[0-9]+)?$/.test(v);
}

function validateJson(v) {
  try {
    JSON.parse(v);
    return true;
  } catch (err) {
    return false;
  }
}

class TypedInputValidator extends Context {
  constructor(protected v, protected ptype) {
    super()
  }

  validate(v) {
    if (this.isNumber) return validateNumber(v)
    if (this.isJson) return validateJson(v)
    if (this.isProp) return this.validateProp(v)
  }

  validateProp(v) {
    return this.RED.utils.validatePropertyExpression(v);
  }

  get isProp() {
    return !!['msg', 'flow', 'global'].indexOf(this.ptype)
  }

  get isNumber() {
    return this.ptype === 'num'
  }

  get isJson() {
    return this.ptype === 'json'
  }
}

export class Validators extends Context {
  constructor() {
    super()
    this.RED.utils = new Utils()
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
    const {
      RED
    } = this

    var ptype = $('#node-' + (isConfig ? 'config-' : '') + 'input-' + ptypeName).val() || this[ptypeName];
    return (v) => {
      const validator = new TypedInputValidator(ptype, v)
      return validator.validate(v)
    }
  }


}
