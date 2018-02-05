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

const { log } = console

import {
  IValidators
} from './interface'

export class Validators extends Context {
  constructor() {
    super()
  }

  /**
   * Return validation function to test if value is a number via javascript isNaN function
   * @param blankAllowed { boolean } if blanks are allowed
   * @returns { function } validation function
   */
  number(blankAllowed) {
    return function (v) {
      return (blankAllowed && (v === '' || v === undefined)) || (v !== '' && !isNaN(v));
    }
  }

  /**
   * return validation function to test if value is matches given Regular Expression
   * @param re { RegExp } regular expression to use in validation function
   * @returns { function } validation function
   */
  regex(re: RegExp): Function {
    return function (v) {
      return re.test(v);
    }
  }

  /**
   *
   * @param ptypeName { string }
   * @param isConfig { boolean }
   */
  typedInput(ptypeName: string, isConfig: boolean) {
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

  /**
   * Try to parse value as JSON - valid if parse without error
   * @param value { string } value to parse as JSON
   * @returns { boolean } whether value is valid JSON
   */
  validateJson(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Validate if value is a number via RegExp
   * @param value { string } value to validate
   */
  validateNumber(value: string) {
    return /^[+-]?[0-9]*\.?[0-9]*([eE][-+]?[0-9]+)?$/.test(value);
  }

  /**
   * Validate if value is a property
   * @param value { string } value to validate
   */
  validateProp(value: string) {
    const { ctx } = this
    return ctx.utils.validatePropertyExpression(value);
  }
}
