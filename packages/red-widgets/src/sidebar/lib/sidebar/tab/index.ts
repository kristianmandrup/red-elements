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
  Context,
  $
} from '../../../../common'

import { SidebarTabInitializer } from './config-nodelist-manager'

import {
  I18n
} from '@tecla5/red-runtime/src/i18n'
import { Sidebar } from '../../index';
import {
  JQElem
} from '@tecla5/red-base';
import { JQueryAjaxAdapter } from '../../../../../../red-api/src/adapters/jquery/index';
import { SidebarTabConfiguration } from './configuration';

interface I18nWidget extends JQuery<HTMLElement> {
  i18n: Function
}

export interface ISidebarTab {
  getOrCreateCategory(name: string, parent?: any, label?: string)
  show(id: string): ISidebarTab
}

export class SidebarTab extends Context {
  public content: HTMLElement
  public toolbar: JQElem
  public globalCategories: JQElem
  public flowCategories: JQElem
  public subflowCategories: JQElem
  public category: JQElem

  showUnusedOnly = false;
  categories = {};
  i18n: I18n = new I18n()

  protected initializer: SidebarTabInitializer
  protected configuration: SidebarTabConfiguration

  constructor(public sidebar: Sidebar) {
    super()
    this.configure()
  }

  configure() {
    this.configuration.configure()
  }

  /**
   * Get or create Palette category
   * @param name
   * @param parent
   * @param label
   */
  getOrCreateCategory(name: string, parent?: any, label?: string) {
    let {
      category
    } = this

    this._validateStr(name, 'name', 'getOrCreateCategory')
    if (parent) {
      this._validateJQ(parent, 'parent', 'getOrCreateCategory')
    }
    if (label) {
      this._validateStr(label, 'label', 'getOrCreateCategory')
    }

    name = name.replace(/\./i, "-");
    let categories = this.categories

    if (!categories[name]) {
      const container = this.createPaletteCategoryContainer(name, parent)
      const header = this.appendHeader(container)
      this.appendLabel(label, name, header)
      this.appendNodeFilterInfo(header)

      category = this.appendCategory(header)
      container.i18n();
      const icon = header.find("i");
      const result = {
        label: label,
        list: category,
        size: () => {
          return result.list.find("li:not(.config_node_none)").length
        },
        open: (snap?) => {
          if (!icon.hasClass("expanded")) {
            icon.addClass("expanded");
            if (snap) {
              result.list.show();
            } else {
              result.list.slideDown();
            }
          }
        },
        close: (snap?) => {
          if (icon.hasClass("expanded")) {
            icon.removeClass("expanded");
            if (snap) {
              result.list.hide();
            } else {
              result.list.slideUp();
            }
          }
        },
        isOpen: () => {
          return icon.hasClass("expanded");
        }
      };

      header.on('click', (e) => {
        if (result.isOpen()) {
          result.close();
        } else {
          result.open();
        }
      });
      categories[name] = result;
    } else {
      if (categories[name].label !== label) {
        categories[name].list.parent().find('.config-node-label').text(label);
        categories[name].label = label;
      }
    }
    return categories[name];
  }


  /**
   * Show sidebar tab
   * @param id
   */
  show(id: string): ISidebarTab {
    let RED = this.ctx
    if (typeof id === 'boolean') {
      if (id) {
        this.nodeFilterUnused.click();
      } else {
        this.nodeFilterAll.click();
      }
    }
    this.initializer.refreshConfigNodeList();
    if (typeof id === "string") {
      this.nodeFilterAll.click();
      id = id.replace(/\./g, "-");
      setTimeout(function () {
        const node = this.paletteNodeElem(id)
        const y = node.position().top;
        const h = node.height();
        const scrollWindow = this.sidebarNodeConfig
        const scrollHeight = scrollWindow.height();

        if (y + h > scrollHeight) {
          scrollWindow.animate({
            scrollTop: '-=' + (scrollHeight - (y + h) - 30)
          }, 150);
        } else if (y < 0) {
          scrollWindow.animate({
            scrollTop: '+=' + (y - 10)
          }, 150);
        }
        let flash = 21;
        const flashFunc = function () {
          flash % 2 === 0 ? this.removeHighlight(node) : this.addHighlight(node)

          flash--;
          if (flash >= 0) {
            setTimeout(flashFunc, 100);
          }
        }
        flashFunc();
      }, 100);
    }
    RED.sidebar.show("config");
    return this
  }

  // protected

  // TODO: reuse same method in initializer!!
  protected get nodeFilterUnused() {
    return $('#workspace-config-node-filter-unused')
  }

  // TODO: reuse same method in initializer!!
  protected get nodeFilterAll() {
    return $('#workspace-config-node-filter-all')
  }

  protected get sidebarNodeConfig() {
    return $(".sidebar-node-config")
  }

  protected paletteNodeElem(id) {
    return $(".palette_node_id_" + id);
  }

  protected removeHiglight(node) {
    node.removeClass('node_highlighted');
  }

  protected addHiglight(node) {
    node.addClass('node_highlighted');
  }

  protected createPaletteCategoryContainer(name, parent): I18nWidget {
    return <I18nWidget>$('<div class="palette-category workspace-config-node-category" id="workspace-config-node-category-' + name + '"></div>').appendTo(parent);
  }

  protected appendHeader(container): JQElem {
    return $('<div class="workspace-config-node-tray-header palette-header"><i class="fa fa-angle-down expanded"></i></div>').appendTo(container);
  }

  protected appendLabel(label, name, header) {
    if (label) {
      $('<span class="config-node-label"/>').text(label).appendTo(header);
    } else {
      $('<span class="config-node-label" data-i18n="sidebar.config.' + name + '">').appendTo(header);
    }
  }

  protected appendNodeFilterInfo(header) {
    $('<span class="config-node-filter-info"></span>').appendTo(header);
  }

  protected appendCategory(container) {
    return $('<ul class="palette-content config-node-list"></ul>').appendTo(container);
  }
}
