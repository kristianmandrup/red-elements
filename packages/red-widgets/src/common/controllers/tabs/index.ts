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
import { Context } from '../../base'

const {
  log
} = console

export class Tabs extends Context {
  public static create(options) {
    return new Tabs(options)
  }

  scrollContainer: any;
  options: any;
  tabs: any;
  ul: any;
  scrollLeft: any;
  scrollRight: any;
  wrapper: any;
  currentTabWidth: any;
  currentActiveTabWidth: any;

  constructor(options) {
    super()
    this.options = options || {}
    if (typeof options !== 'object') {
      this.handleError('Tabs must take an options object', {
        options
      })
    }
    var tabs = {};
    var currentTabWidth;
    var currentActiveTabWidth = 0;
    if (!(options.id || options.element)) {
      this.handleError('Tabs must take an id: or element: option for target element', {
        id: options.id,
        element: options.element,
        options
      })
    }

    var ul = options.element || $("#" + options.id);
    var wrapper = ul.wrap("<div>").parent();
    var scrollContainer = ul.wrap("<div>").parent();
    var scrollLeft;
    var scrollRight;


    let {
      onTabClick,
      onTabDblClick,
      updateTabWidths,
      updateScroll
    } = this.rebind([
        'onTabClick',
        'onTabDblClick',
        'updateTabWidths',
        'updateScroll'
      ], this)

    wrapper.addClass("red-ui-tabs");
    if (options.vertical) {
      wrapper.addClass("red-ui-tabs-vertical");
    }

    if (options.addButton && typeof options.addButton === 'function') {
      wrapper.addClass("red-ui-tabs-add");
      var addButton = $('<div class="red-ui-tab-button"><a href="#"><i class="fa fa-plus"></i></a></div>').appendTo(wrapper);
      addButton.find('a').click((evt) => this.handleAddButtonClickedEvent(evt, options));
    }

    if (options.scrollable) {
      wrapper.addClass("red-ui-tabs-scrollable");
      scrollContainer.addClass("red-ui-tabs-scroll-container");
      scrollContainer.scroll(updateScroll);
      scrollLeft = $('<div class="red-ui-tab-button red-ui-tab-scroll red-ui-tab-scroll-left"><a href="#" style="display:none;"><i class="fa fa-caret-left"></i></a></div>').appendTo(wrapper).find("a");
      scrollLeft.on('mousedown', (evt) => this.scrollEventHandler(evt, '-=150'))
        .on('click', this.handleScrollMoveMouseClickEvent);
      scrollRight = $('<div class="red-ui-tab-button red-ui-tab-scroll red-ui-tab-scroll-right"><a href="#" style="display:none;"><i class="fa fa-caret-right"></i></a></div>').appendTo(wrapper).find("a");
      scrollRight.on('mousedown', (evt) => this.scrollEventHandler(evt, '+=150'))
        .on('click', this.handleScrollMoveMouseClickEvent);
    }
    const instVars = {
      tabs,
      currentTabWidth,
      currentActiveTabWidth,
      ul,
      wrapper,
      scrollContainer,
      scrollLeft,
      scrollRight
    }

    Object.keys(instVars).map(key => {
      this[key] = instVars[key]
    })
    ul.children().first().addClass("active");
    ul.children().addClass("red-ui-tab");

    ul.find("li.red-ui-tab a").on("click", onTabClick).on("dblclick", onTabDblClick);
    setTimeout(function () {
      updateTabWidths();
    }, 0);

  }

  scrollEventHandler(evt, dir) {
    const {
      scrollContainer
    } = this

    evt.preventDefault();
    if ($(this).hasClass('disabled')) {
      return this;
    }
    var currentScrollLeft = scrollContainer.scrollLeft();
    scrollContainer.animate({
      scrollLeft: dir
    }, 100);
    var interval = setInterval(() => {
      var newScrollLeft = scrollContainer.scrollLeft()
      if (newScrollLeft === currentScrollLeft) {
        clearInterval(interval);
        return this;
      }
      currentScrollLeft = newScrollLeft;
      scrollContainer.animate({
        scrollLeft: dir
      }, 100);
    }, 100);
    $(this).one('mouseup', function () {
      clearInterval(interval);
    })
    return this
  }


  onTabClick() {
    const {
      activateTab,
      tabs
    } = this

    let options = this.options

    if (options.onclick) {
      options.onclick(tabs[$(this).attr('href').slice(1)]);
    }
    this.activateTab($(this));
    return false;
  }

  updateScroll() {
    const {
      ul,
      scrollContainer,
      scrollLeft,
      scrollRight
    } = this
    if (ul.children().length !== 0) {
      var sl = scrollContainer.scrollLeft();
      var scWidth = scrollContainer.width();
      var ulWidth = ul.width();
      if (sl === 0) {
        scrollLeft.hide();
      } else {
        scrollLeft.show();
      }
      if (sl === ulWidth - scWidth) {
        scrollRight.hide();
      } else {
        scrollRight.show();
      }
    }
    return this
  }

  onTabDblClick() {
    const {
      options,
      tabs
    } = this

    if (options.ondblclick) {
      options.ondblclick(tabs[$(this).attr('href').slice(1)]);
    }
    return false;
  }

  activateTab(link) {
    const {
      updateTabWidths,
      ul,
      options,
      scrollContainer,
      tabs
    } = this

    if (typeof link === "string") {
      link = ul.find("a[href='#" + link + "']");
    }
    if (link.length === 0) {
      return this;
    }
    if (!link.parent().hasClass("active")) {
      ul.children().removeClass("active");
      ul.children().css({
        "transition": "width 100ms"
      });
      link.parent().addClass("active");
      if (options.scrollable) {
        var pos = link.parent().position().left;
        if (pos - 21 < 0) {
          scrollContainer.animate({
            scrollLeft: '+=' + (pos - 50)
          }, 300);
        } else if (pos + 120 > scrollContainer.width()) {
          scrollContainer.animate({
            scrollLeft: '+=' + (pos + 140 - scrollContainer.width())
          }, 300);
        }
      }
      if (options.onchange) {
        options.onchange(tabs[link.attr('href').slice(1)]);
      }
      this.updateTabWidths();
      setTimeout(function () {
        ul.children().css({
          "transition": ""
        });
      }, 100);
    }
    return this
  }

  activatePreviousTab() {
    const {
      ul
    } = this

    var previous = ul.find("li.active").prev();
    if (previous.length > 0) {
      this.activateTab(previous.find("a"));
    }
    return this
  }

  activateNextTab() {
    const {
      ul
    } = this

    var next = ul.find("li.active").next();
    if (next.length > 0) {
      this.activateTab(next.find("a"));
    }
    return this
  }

  updateTabWidths() {
    const {
      ul,
      options,
      wrapper
    } = this

    // FIX: directly reference instance vars below?
    let currentTabWidth = this.currentTabWidth
    let currentActiveTabWidth = this.currentActiveTabWidth

    if (options.vertical) {
      return;
    }
    var tabs = ul.find("li.red-ui-tab");
    if (!tabs) {
      throw new Error("Missing tabs: li.red-ui-tab")
    }
    var width = wrapper.width();
    var tabCount = tabs.length;

    var tabWidth = (width - 12 - (tabCount * 6)) / tabCount;
    currentTabWidth = (100 * tabWidth / width) + "%";
    currentActiveTabWidth = currentTabWidth + "%";
    if (options.scrollable) {
      tabWidth = Math.max(tabWidth, 140);
      currentTabWidth = tabWidth + "px";
      currentActiveTabWidth = 0;
      var listWidth = Math.max(wrapper.width(), 12 + (tabWidth + 6) * tabCount);
      ul.width(listWidth);
      this.updateScroll();
    } else if (options.hasOwnProperty("minimumActiveTabWidth")) {
      if (tabWidth < options.minimumActiveTabWidth) {
        tabCount -= 1;
        tabWidth = (width - 12 - options.minimumActiveTabWidth - (tabCount * 6)) / tabCount;
        currentTabWidth = (100 * tabWidth / width) + "%";
        currentActiveTabWidth = options.minimumActiveTabWidth + "px";
      } else {
        currentActiveTabWidth = 0;
      }
    }
    tabs.css({
      width: currentTabWidth
    });
    if (tabWidth < 50) {
      ul.find(".red-ui-tab-close").hide();
      ul.find(".red-ui-tab-icon").hide();
      ul.find(".red-ui-tab-label").css({
        paddingLeft: Math.min(12, Math.max(0, tabWidth - 38)) + "px"
      })
    } else {
      ul.find(".red-ui-tab-close").show();
      ul.find(".red-ui-tab-icon").show();
      ul.find(".red-ui-tab-label").css({
        paddingLeft: ""
      })
    }
    if (currentActiveTabWidth !== 0) {
      ul.find("li.red-ui-tab.active").css({
        "width": options.minimumActiveTabWidth
      });
      ul.find("li.red-ui-tab.active .red-ui-tab-close").show();
      ul.find("li.red-ui-tab.active .red-ui-tab-icon").show();
      ul.find("li.red-ui-tab.active .red-ui-tab-label").css({
        paddingLeft: ""
      })
    }
    return this
  }

  removeTab(id) {
    const {
      ul,
      tabs,
      options,
      updateTabWidths
    } = this

    var li = ul.find("a[href='#" + id + "']").parent();
    if (li.hasClass("active")) {
      var tab = li.prev();
      if (tab.size() === 0) {
        tab = li.next();
      }
      this.activateTab(tab.find("a"));
    }
    li.remove();
    if (options.onremove) {
      options.onremove(tabs[id]);
    }
    delete tabs[id];
    this.updateTabWidths()
    return this
  }

  addTab(tab) {
    const {
      ul,
      tabs,
      options,
      updateTabWidths,
      scrollContainer
    } = this

    let {
      onTabClick,
      onTabDblClick,
    } = this.rebind([
        'onTabClick',
        'onTabDblClick',
      ], this)


    tabs[tab.id] = tab;
    var li: any = $("<li/>", {
      class: "red-ui-tab"
    }).appendTo(ul);
    li.attr('id', "red-ui-tab-" + (tab.id.replace(".", "-")));
    li.data("tabId", tab.id);
    var link = $("<a/>", {
      href: "#" + tab.id,
      class: "red-ui-tab-label"
    }).appendTo(li);
    if (tab.icon) {
      $('<img src="' + tab.icon + '" class="red-ui-tab-icon"/>').appendTo(link);
    }
    var span = $('<span/>', {
      class: "bidiAware"
    }).text(tab.label).appendTo(link);
    if (!(this.RED.text && this.RED.text.bidi && this.RED.text.bidi.resolveBaseTextDir)) {
      this.handleError('addTab: mising RED.text.bidi.resolveBaseTextDir', {
        text: this.RED.text,
        RED: this.RED
      })
    }

    span.attr('dir', this.RED.text.bidi.resolveBaseTextDir(tab.label));

    link.on("click", onTabClick);
    link.on("dblclick", onTabDblClick);
    if (tab.closeable) {
      var closeLink = $("<a/>", {
        href: "#",
        class: "red-ui-tab-close"
      }).appendTo(li);
      closeLink.append('<i class="fa fa-times" />');

      closeLink.on("click", (event) => {
        event.preventDefault();
        this.removeTab(tab.id);
      });
    }

    this.updateTabWidths();
    if (options.onadd) {
      options.onadd(tab);
    }
    link.attr("title", tab.label);
    if (ul.find("li.red-ui-tab").length == 1) {
      this.activateTab(link);
    }
    if (options.onreorder) {
      var originalTabOrder;
      var tabDragIndex;
      var tabElements = [];
      var startDragIndex;

      li.draggable({
        axis: "x",
        distance: 20,
        start: (event, ui) => {
          originalTabOrder = [];
          tabElements = [];
          ul.children().each(function (i) {
            tabElements[i] = {
              el: $(this),
              text: $(this).text(),
              left: $(this).position().left,
              width: $(this).width()
            };
            if ($(this).is(li)) {
              tabDragIndex = i;
              startDragIndex = i;
            }
            originalTabOrder.push($(this).data("tabId"));
          });
          ul.children().each(function (i) {
            if (i !== tabDragIndex) {
              $(this).css({
                position: 'absolute',
                left: tabElements[i].left + "px",
                width: tabElements[i].width + 2,
                transition: "left 0.3s"
              });
            }

          })
          if (!li.hasClass('active')) {
            li.css({
              'zIndex': 1
            });
          }
        },
        drag: (event, ui) => {
          ui.position.left += tabElements[tabDragIndex].left + scrollContainer.scrollLeft();
          var tabCenter = ui.position.left + tabElements[tabDragIndex].width / 2 - scrollContainer.scrollLeft();
          for (var i = 0; i < tabElements.length; i++) {
            if (i === tabDragIndex) {
              continue;
            }
            if (tabCenter > tabElements[i].left && tabCenter < tabElements[i].left + tabElements[i].width) {
              if (i < tabDragIndex) {
                tabElements[i].left += tabElements[tabDragIndex].width + 8;
                tabElements[tabDragIndex].el.detach().insertBefore(tabElements[i].el);
              } else {
                tabElements[i].left -= tabElements[tabDragIndex].width + 8;
                tabElements[tabDragIndex].el.detach().insertAfter(tabElements[i].el);
              }
              tabElements[i].el.css({
                left: tabElements[i].left + "px"
              });

              tabElements.splice(i, 0, tabElements.splice(tabDragIndex, 1)[0]);

              tabDragIndex = i;
              break;
            }
          }
        },
        stop: (event, ui) => {
          ul.children().css({
            position: "relative",
            left: "",
            transition: ""
          });
          if (!li.hasClass('active')) {
            li.css({
              zIndex: ""
            });
          }
          this.updateTabWidths();
          if (startDragIndex !== tabDragIndex) {
            options.onreorder(originalTabOrder, $.makeArray(ul.children().map(function () {
              return $(this).data('tabId');
            })));
          }
          this.activateTab(tabElements[tabDragIndex].el.data('tabId'));
        }
      })
    }
    return this
  }

  count() {
    const {
      ul
    } = this
    const tabElems = ul.find("li.red-ui-tab")
    return tabElems.length;
  }

  contains(id) {
    const {
      ul
    } = this
    const tabLinksToId = ul.find("a[href='#" + id + "']")
    return tabLinksToId.length > 0;
  }

  renameTab(id, label) {
    const {
      ul,
      tabs,
    } = this

    if (!tabs[id]) {
      this.logWarning(`renameTab: No tab for id: ${id}`, {
        tabs,
        id
      })
      return this
    }

    tabs[id].label = label;
    var tab = ul.find("a[href='#" + id + "']");
    tab.attr("title", label);
    tab.find("span.bidiAware").text(label).attr('dir', this.RED.text.bidi.resolveBaseTextDir(label));
    this.updateTabWidths();
    return this
  }

  order(order) {
    const {
      ul
    } = this

    var existingTabOrder = $.makeArray(ul.children().map(() => {
      return $(this).data('tabId');
    }));
    if (existingTabOrder.length !== order.length) {
      return this
    }
    var i;
    var match = true;
    for (i = 0; i < order.length; i++) {
      if (order[i] !== existingTabOrder[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      return this;
    }
    var existingTabMap = {};
    var existingTabs = ul.children().detach().each(function () {
      existingTabMap[$(this).data("tabId")] = $(this);
    });
    for (i = 0; i < order.length; i++) {
      existingTabMap[order[i]].appendTo(ul);
    }
    return this
  }

  handleAddButtonClickedEvent(evt, options) {
    evt.preventDefault();
    if (options && options.addButton && (typeof options.addButton === 'function')) {
      options.addButton();
    } else {
      return false;
    }
  }

  handleScrollMoveMouseClickEvent(evt) {
    evt.preventDefault();
  }
}
