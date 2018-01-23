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

import {
  I18n
} from '@tecla5/red-runtime/src/i18n'

interface I18nWidget extends JQuery<HTMLElement> {
  i18n: Function
}

export class SidebarTab extends Context {
  public content: HTMLElement
  public toolbar: JQuery<HTMLElement>
  public globalCategories: JQuery<HTMLElement>
  public flowCategories: JQuery<HTMLElement>
  public subflowCategories: JQuery<HTMLElement>
  public category: JQuery<HTMLElement>

  public showUnusedOnly: Boolean
  public categories: Object

  protected i18n: I18n

  constructor() {
    super()
  }

  getOrCreateCategory(name, parent?, label?) {
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
      var container = <I18nWidget>$('<div class="palette-category workspace-config-node-category" id="workspace-config-node-category-' + name + '"></div>').appendTo(parent);
      var header = $('<div class="workspace-config-node-tray-header palette-header"><i class="fa fa-angle-down expanded"></i></div>').appendTo(container);
      if (label) {
        $('<span class="config-node-label"/>').text(label).appendTo(header);
      } else {
        $('<span class="config-node-label" data-i18n="sidebar.config.' + name + '">').appendTo(header);
      }
      $('<span class="config-node-filter-info"></span>').appendTo(header);
      category = $('<ul class="palette-content config-node-list"></ul>').appendTo(container);
      container.i18n();
      var icon = header.find("i");
      var result = {
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


  show(id) {
    let RED = this.ctx
    if (typeof id === 'boolean') {
      if (id) {
        $('#workspace-config-node-filter-unused').click();
      } else {
        $('#workspace-config-node-filter-all').click();
      }
    }
    this.refreshConfigNodeList();
    if (typeof id === "string") {
      $('#workspace-config-node-filter-all').click();
      id = id.replace(/\./g, "-");
      setTimeout(function () {
        var node = $(".palette_node_id_" + id);
        var y = node.position().top;
        var h = node.height();
        var scrollWindow = $(".sidebar-node-config");
        var scrollHeight = scrollWindow.height();

        if (y + h > scrollHeight) {
          scrollWindow.animate({
            scrollTop: '-=' + (scrollHeight - (y + h) - 30)
          }, 150);
        } else if (y < 0) {
          scrollWindow.animate({
            scrollTop: '+=' + (y - 10)
          }, 150);
        }
        var flash = 21;
        var flashFunc = function () {
          if ((flash % 2) === 0) {
            node.removeClass('node_highlighted');
          } else {
            node.addClass('node_highlighted');
          }
          flash--;
          if (flash >= 0) {
            setTimeout(flashFunc, 100);
          }
        }
        flashFunc();
      }, 100);
    }
    RED.sidebar.show("config");
  }
}
