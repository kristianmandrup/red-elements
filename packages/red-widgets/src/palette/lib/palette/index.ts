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

// import {
//   default as marked
// } from 'marked'

// import * as d3 from 'd3'

import {
  d3,
  marked
} from '../../../_libs'


export {
  PaletteEditor
} from '../editor'

import {
  Context,
  $,
  Searchbox,
  EditableList
} from '../../../common'
import { PaletteConfiguration } from './configuration';

import {
  container,
  delegator,
  delegateTo
} from '../container'

import {
  IPalette
} from './interface'

@delegator({
  container,
  map: {
    configuration: PaletteConfiguration
  }
})
export class Palette extends Context implements IPalette {
  public categoryContainers = {}
  exclusion = [
    'config',
    'unknown',
    'deprecated'
  ]
  coreCategories = [
    'subflows',
    'input',
    'output',
    'function',
    'social',
    'mobile',
    'storage',
    'analysis',
    'advanced'
  ]

  configuration: PaletteConfiguration // = new PaletteConfiguration(this)

  constructor() {
    super()
    this.configure()
  }

  /**
   * Configure
   */
  @delegateTo('configuration')
  configure() {
    // this.configuration.configure()
  }

  /**
   * translate Markdown content
   * @param content
   */
  marked(content: string) {
    return marked(content)
  }

  /**
   * filter Change
   * @param val
   */
  filterChange(val: string) {
    const {
      categoryContainers
    } = this

    var re = new RegExp(val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    $("#palette-container .palette_node").each(function (i, el) {
      var currentLabel = $(el).find(".palette_label").text();
      if (val === "" || re.test(el.id) || re.test(currentLabel)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });

    for (var category in categoryContainers) {
      if (categoryContainers.hasOwnProperty(category)) {
        if (categoryContainers[category].container
          .find(".palette_node")
          .filter(function () {
            return $(this).css('display') !== 'none'
          }).length === 0) {
          categoryContainers[category].close();
        } else {
          categoryContainers[category].open();
        }
      }
    }
    return this
  }
}
