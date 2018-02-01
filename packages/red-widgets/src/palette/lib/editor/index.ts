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
import { Context, $, EditableList, Searchbox } from '../../../common'
import { NodesApi } from '@tecla5/red-runtime';
import { PaletteEditorConfiguration } from './configuration';
import { PaletteEditorNodeManager } from './node-manager/node-manager';

interface ISearchTerm extends JQuery<HTMLElement> {
}

interface IDialogWidget extends JQuery<HTMLElement> {
  dialog: Function
}
interface ISearchResults extends JQuery<HTMLElement> {
  editableList: Function
}

import {
  container,
  delegator,
  delegateTo
} from './_base'

export interface IPaletteEditor {
  configure()

  /**
   * semantic Version Compare
   * @param A
   * @param B
   */
  semVerCompare(A, B)

  /**
   * change Node State
   */
  changeNodeState(id, state, shade, callback): Promise<any>

  /**
   * get ContrastingBorder
   * @param rgbColor
   *
   */
  getContrastingBorder(rgbColor)

  /**
   * filter Change
   * @param val
   */
  filterChange(val)

  /**
   * handle Catalog Response
   * @param err
   * @param catalog
   * @param index
   * @param v
   */
  handleCatalogResponse(err, catalog, index, v)

  /**
   * refresh filtered Items
   */
  refreshFilteredItems()

  /**
   * sort modules A-Z
   * @param A
   * @param B
   */
  sortModulesAZ(A, B)

  /**
   * sort modules recent
   * @param A
   * @param B
   */
  sortModulesRecent(A, B)
}


@delegator({
  container,
  map: {
    configuration: PaletteEditorConfiguration,
    nodeManager: PaletteEditorNodeManager
  }
})
export class PaletteEditor extends Context {
  public disabled: Boolean = false
  public loadedList: Array<any> = [];
  public filteredList: Array<any> = [];
  public loadedIndex: Object = {};

  public typesInUse: Object = {};
  public nodeEntries: Object = {};
  public eventTimers: Object = {};
  public activeFilter: Object = '';

  public editorTabs: any; // jQuery element
  public filterInput: any; // jQuery element
  public searchInput: any; // jQuery element
  public nodeList: ISearchResults;
  public packageList: any; // jQuery element

  public settingsPane: any; // jQuery element ?
  public catalogueCount: any;

  public catalogueLoadStatus: Array<any> = [];
  public catalogueLoadStart: any
  public catalogueLoadErrors: Boolean = false;

  public activeSort: any = this.sortModulesAZ;

  configuration: PaletteEditorConfiguration // = new PaletteEditorConfiguration(this)
  nodeManager: PaletteEditorNodeManager // = new PaletteEditorNodeManager(this)

  constructor() {
    super()
    this.configure()
  }

  @delegateTo('configuration')
  configure() {
    // this.configuration.configure()
  }

  /**
   * semantic Version Compare
   * @param A
   * @param B
   */
  semVerCompare(A, B) {
    var aParts = A.split(".").map(function (m) {
      return parseInt(m);
    });
    var bParts = B.split(".").map(function (m) {
      return parseInt(m);
    });
    for (var i = 0; i < 3; i++) {
      var j = aParts[i] - bParts[i];
      if (j < 0) {
        return -1
      }
      if (j > 0) {
        return 1
      }
    }
    return 0;
  }

  /**
   * change Node State
   */
  async changeNodeState(id, state, shade, callback) {
    shade.show();
    var start = Date.now();

    await this.nodeManager.updateNode(state, id)
  }

  /**
   * get ContrastingBorder
   * @param rgbColor
   *
   */
  getContrastingBorder(rgbColor) {
    var parts = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)[,)]/.exec(rgbColor);
    if (parts) {
      var r = parseInt(parts[1]);
      var g = parseInt(parts[2]);
      var b = parseInt(parts[3]);
      var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      if (yiq > 160) {
        r = Math.floor(r * 0.8);
        g = Math.floor(g * 0.8);
        b = Math.floor(b * 0.8);
        return "rgb(" + r + "," + g + "," + b + ")";
      }
    }
    return rgbColor;
  }

  /**
   * filter Change
   * @param val
   */
  filterChange(val) {
    let {
      activeFilter,
      nodeList,
      filterInput
    } = this

    activeFilter = val.toLowerCase();
    var visible = nodeList.editableList('filter');
    var size = nodeList.editableList('length');
    if (val === "") {
      filterInput.searchBox('count');
    } else {
      filterInput.searchBox('count', visible + " / " + size);
    }
  }

  /**
   * handle Catalog Response
   * @param err
   * @param catalog
   * @param index
   * @param v
   */
  handleCatalogResponse(err, catalog, index, v) {
    let {
      catalogueLoadStatus,
      catalogueLoadStart,
      catalogueCount,
      catalogueLoadErrors,
      loadedIndex,
      loadedList,
      searchInput
    } = this

    const {
      createSettingsPane
    } = this.rebind([
        'createSettingsPane'
      ])

    catalogueLoadStatus.push(err || v);
    if (!err) {
      if (!v.modules) {
        this.handleError('handleCatalogResponse: v missing modules property', {
          v
        })
      }

      if (v.modules) {
        v.modules.forEach((m) => {
          loadedIndex[m.id] = m;
          m.index = [m.id];
          if (m.keywords) {
            m.index = m.index.concat(m.keywords);
          }
          if (m.updated_at) {
            m.timestamp = new Date(m.updated_at).getTime();
          } else {
            m.timestamp = 0;
          }
          m.index = m.index.join(",").toLowerCase();
        })
        loadedList = loadedList.concat(v.modules);
      }

      if (!searchInput) {
        createSettingsPane()
        searchInput = this.searchInput
      }

      log({
        searchInput
      })
      this._validateObj(searchInput, 'searchInput', 'handleCatalogResponse')

      searchInput.searchBox('count', loadedList.length);
    } else {
      catalogueLoadErrors = true;
    }
    if (catalogueCount > 1) {
      $(".palette-module-shade-status").html(this.RED._('palette.editor.loading') + "<br>" + catalogueLoadStatus.length + "/" + catalogueCount);
    }
    if (catalogueLoadStatus.length === catalogueCount) {
      if (catalogueLoadErrors) {
        this.RED.notify.call(this.RED._('palette.editor.errors.catalogLoadFailed', {
          url: catalog
        }), "error", false, 8000);
      }
      var delta = 250 - (Date.now() - catalogueLoadStart);
      setTimeout(() => {
        $("#palette-module-install-shade").hide();
      }, Math.max(delta, 0));

    }
  }

  /**
   * refresh filtered Items
   */
  refreshFilteredItems() {
    const {
      packageList,
      loadedList,
      filteredList,
      searchInput,
      activeSort
    } = this

    packageList.editableList('empty');

    if (!(searchInput && searchInput.searchBox)) {
      this.handleError('refreshFilteredItems: missing searchInput.searchBox', {
        searchInput
      })
    }

    var currentFilter = searchInput.searchBox('value').trim();
    if (currentFilter === "") {
      packageList.editableList('addItem', {
        count: loadedList.length
      })
      return;
    }
    filteredList.sort(activeSort);
    for (var i = 0; i < Math.min(10, filteredList.length); i++) {
      packageList.editableList('addItem', filteredList[i]);
    }
    if (filteredList.length === 0) {
      packageList.editableList('addItem', {});
    }

    if (filteredList.length > 10) {
      packageList.editableList('addItem', {
        start: 10,
        more: filteredList.length - 10
      })
    }
    return this
  }

  /**
   * sort modules A-Z
   * @param A
   * @param B
   */
  sortModulesAZ(A, B) {
    return A.info.id.localeCompare(B.info.id);
  }

  /**
   * sort modules recent
   * @param A
   * @param B
   */
  sortModulesRecent(A, B) {
    return -1 * (A.info.timestamp - B.info.timestamp);
  }
}
