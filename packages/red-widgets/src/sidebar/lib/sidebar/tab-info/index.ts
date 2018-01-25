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
  TabInfoRefresher
} from './refresher'

import {
  TabInfoTips
} from './tips'
import {
  Stack
} from '../../../../common'

import {
  I18n
} from '@tecla5/red-runtime'

export {
  TabInfoTips
}

import marked from 'marked'
import { TabInfoInitializer } from './initializer';

export class SidebarTabInfo extends Context {
  createStack(options) {
    // legacy: ctx.stack.create
    return new Stack(options)
  }

  public tips: TabInfoTips
  public content: HTMLDivElement
  public sections: any // JQuery<HTMLElement>;
  public nodeSection: any; // JQuery<HTMLElement>;
  public infoSection: any; // JQuery<HTMLElement>;
  public tipBox: JQuery<HTMLElement>;
  public expandedSections: any; // JQuery<HTMLElement>;

  protected initializer: TabInfoInitializer
  protected refresher: TabInfoRefresher
  protected i18n: I18n

  constructor() {
    super()
    const { RED } = this

    // FIX: ensure that _ is set to i18n translate (ie. key lookup) function
    this.i18n = new I18n()
    this.tips = new TabInfoTips()
  }

  async init() {
    await this.initializer.init(this.i18n)
  }


  get sidebar() {
    return this.RED.sidebar
  }

  refresh() {
    this.refresher.refresh()
  }

  show() {
    this.sidebar.show("info");
  }

  jsonFilter(key, value) {
    if (key === "") {
      return value;
    }
    var t = typeof value;
    if ($.isArray(value)) {
      return "[array:" + value.length + "]";
    } else if (t === "object") {
      return "[object]"
    } else if (t === "string") {
      if (value.length > 30) {
        return value.substring(0, 30) + " ...";
      }
    }
    return value;
  }

  addTargetToExternalLinks(el) {
    $(el).find("a").each(function (el) {
      var href = $(this).attr('href');
      if (/^https?:/.test(href)) {
        $(this).attr('target', '_blank');
      }
    });
    return el;
  }


  setInfoText(infoText) {
    const {
      RED,
      infoSection
    } = this;
    const {
      addTargetToExternalLinks
    } = this.rebind([
        'addTargetToExternalLinks'
      ])
    var info = addTargetToExternalLinks($('<div class="node-help"><span class="bidiAware" dir=\"' + RED.text.bidi.resolveBaseTextDir(infoText) + '">' + infoText + '</span></div>')).appendTo(infoSection.content);
    info.find(".bidiAware").contents().filter(function () {
      return this.nodeType === 3 && this.textContent.trim() !== ""
    }).wrap("<span></span>");
    var foldingHeader = "H3";
    info.find(foldingHeader).wrapInner('<a class="node-info-header expanded" href="#"></a>')
      .find("a").prepend('<i class="fa fa-angle-right">').click(function (e) {
        e.preventDefault();
        var isExpanded = $(this).hasClass('expanded');
        var el = $(this).parent().next();
        while (el.length === 1 && el[0].nodeName !== foldingHeader) {
          el.toggle(!isExpanded);
          el = el.next();
        }
        $(this).toggleClass('expanded', !isExpanded);
      })
    return this
  }

  clear() {
    this.sections.hide();
    return this
  }

  set(html) {
    let {
      sections,
      nodeSection,
      infoSection
    } = this
    const { setInfoText } = this.rebind(['setInfoText']);

    // tips.stop();
    sections.show();
    nodeSection.container.hide();
    $(infoSection.content).empty();
    setInfoText(html);
    $(".sidebar-node-info-stack").scrollTop(0);
    return this
  }
}
