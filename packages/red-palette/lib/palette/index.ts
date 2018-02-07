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

import {
  PaletteConfiguration,
  IPaletteConfiguration
} from './configuration';

import {
  PaletteNodeTypeManager,
  IPaletteNodeTypeManager
} from './node-type-manager'

import {
  container,
  delegator,
  delegateTo
} from '../container'

import {
  IPaletteChangeFilter,
  IPaletteCategoryContainer
} from './display'

import {
  IPalette
} from './interface'

@delegator({
  container,
  map: {
    configuration: 'IPaletteConfiguration',
    changeFilter: 'IPaletteChangeFilter',
    categoryContainer: 'IPaletteCategoryContainer',
    nodeTypeManager: 'IPaletteNodeTypeManager'
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

  configuration: IPaletteConfiguration
  changeFilter: IPaletteChangeFilter
  categoryContainer: IPaletteCategoryContainer
  nodeTypeManager: IPaletteNodeTypeManager

  constructor() {
    super()
    this.configure()
  }

  /**
     * escape Node Type
     * @param nt
     */
  @delegateTo('nodeTypeManager')
  escapeNodeType(nt) { }

  /**
   * add Node Type
   * @param nt
   * @param def
   */
  @delegateTo('nodeTypeManager')
  addNodeType(nt, def) { }

  @delegateTo('nodeTypeManager')
  removeNodeType(nt) { }

  @delegateTo('nodeTypeManager')
  hideNodeType(nt) { }

  @delegateTo('nodeTypeManager')
  showNodeType(nt) { }

  @delegateTo('nodeTypeManager')
  refreshNodeTypes() { }

  @delegateTo('nodeTypeManager')
  setLabel(type, el, label, info) { }

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
   * create Category Container
   * @param category
   * @param label
   */
  @delegateTo('categoryContainer')
  createCategoryContainer(category: string, label: string) {
  }

  /**
   * filter Change
   * @param val
   */
  @delegateTo('changeFilter')
  filterChange(val: string) {
  }

  // TODO
  refresh() {

  }
}
