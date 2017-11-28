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
  default as $
} from 'jquery'

export class Menu {
  constructor(options) {
    this.menuItems = {};
    var menuParent = $("#" + options.id);

    var topMenu = $("<ul/>", {
      id: options.id + "-submenu",
      class: "dropdown-menu pull-right"
    });

    if (menuParent.length === 1) {
      topMenu.insertAfter(menuParent);
    }

    // default: menu with no options?
    options.options = options.options || []

    var lastAddedSeparator = false;
    for (var i = 0; i < options.options.length; i++) {
      var opt = options.options[i];
      if (opt !== null || !lastAddedSeparator) {
        var li = this.createMenuItem(opt);
        if (li) {
          li.appendTo(topMenu);
          lastAddedSeparator = (opt === null);
        }
      }
    }

   // return topMenu;
   return this;
  }

  createMenuItem(opt) {
    const {
      menuItems
    } = this

    var item;

    if (opt !== null && opt.id) {
      var themeSetting = RED.settings.theme("menu." + opt.id);
      if (themeSetting === false) {
        return null;
      }
    }

    function setInitialState() {
      var savedStateActive = RED.settings.get("menu-" + opt.id);
      if (opt.setting) {
        // May need to migrate pre-0.17 setting

        if (savedStateActive !== null) {
          RED.settings.set(opt.setting, savedStateActive);
          RED.settings.remove("menu-" + opt.id);
        } else {
          savedStateActive = RED.settings.get(opt.setting);
        }
      }
      if (savedStateActive) {
        link.addClass("active");
        triggerAction(opt.id, true);
      } else if (savedStateActive === false) {
        link.removeClass("active");
        triggerAction(opt.id, false);
      } else if (opt.hasOwnProperty("selected")) {
        if (opt.selected) {
          link.addClass("active");
        } else {
          link.removeClass("active");
        }
        triggerAction(opt.id, opt.selected);
      }
    }

    if (opt === null) {
      item = $('<li class="divider"></li>');
    } else {
      item = $('<li></li>');

      if (opt.group) {
        item.addClass("menu-group-" + opt.group);

      }
      var linkContent = '<a ' + (opt.id ? 'id="' + opt.id + '" ' : '') + 'tabindex="-1" href="#">';
      if (opt.toggle) {
        linkContent += '<i class="fa fa-square pull-left"></i>';
        linkContent += '<i class="fa fa-check-square pull-left"></i>';

      }
      if (opt.icon !== undefined) {
        if (/\.png/.test(opt.icon)) {
          linkContent += '<img src="' + opt.icon + '"/> ';
        } else {
          linkContent += '<i class="' + (opt.icon ? opt.icon : '" style="display: inline-block;"') + '"></i> ';
        }
      }

      if (opt.sublabel) {
        linkContent += '<span class="menu-label-container"><span class="menu-label">' + opt.label + '</span>' +
          '<span class="menu-sublabel">' + opt.sublabel + '</span></span>'
      } else {
        linkContent += '<span class="menu-label">' + opt.label + '</span>'
      }

      linkContent += '</a>';

      var link = $(linkContent).appendTo(item);

      menuItems[opt.id] = opt;

      if (opt.onselect) {
        link.click(function (e) {
          e.preventDefault();
          if ($(this).parent().hasClass("disabled")) {
            return;
          }
          if (opt.toggle) {
            var selected = isSelected(opt.id);
            if (typeof opt.toggle === "string") {
              if (!selected) {
                for (var m in menuItems) {
                  if (menuItems.hasOwnProperty(m)) {
                    var mi = menuItems[m];
                    if (mi.id != opt.id && opt.toggle == mi.toggle) {
                      setSelected(mi.id, false);
                    }
                  }
                }
                setSelected(opt.id, true);
              }
            } else {
              setSelected(opt.id, !selected);
            }
          } else {
            triggerAction(opt.id);
          }
        });
        if (opt.toggle) {
          setInitialState();
        }
      } else if (opt.href) {
        link.attr("target", "_blank").attr("href", opt.href);
      } else if (!opt.options) {
        item.addClass("disabled");
        link.click(function (event) {
          event.preventDefault();
        });
      }
      if (opt.options) {
        item.addClass("dropdown-submenu pull-left");
        var submenu = $('<ul id="' + opt.id + '-submenu" class="dropdown-menu"></ul>').appendTo(item);

        for (var i = 0; i < opt.options.length; i++) {
          var li = createMenuItem(opt.options[i]);
          if (li) {
            li.appendTo(submenu);
          }
        }
      }
      if (opt.disabled) {
        item.addClass("disabled");
      }
    }


    return item;

  }

  triggerAction(id, args) {
    var opt = menuItems[id];
    var callback = opt.onselect;
    if (typeof opt.onselect === 'string') {
      callback = RED.actions.get(opt.onselect);
    }
    if (callback) {
      callback.call(opt, args);
    } else {
      console.log("No callback for", id, opt.onselect);
    }
  }

  isSelected(id) {
    return $("#" + id).hasClass("active");
  }

  setSelected(id, state) {
    if (this.isSelected(id) == state) {
      return;
    }
    var opt = this.menuItems[id];
    if (state) {
      $("#" + id).addClass("active");
    } else {
      $("#" + id).removeClass("active");
    }
    if (opt && opt.onselect) {
      triggerAction(opt.id, state);
    }
    RED.settings.set(opt.setting || ("menu-" + opt.id), state);
  }

  toggleSelected(id) {
    this.setSelected(id, !this.isSelected(id));
  }

  setDisabled(id, state) {
    if (state) {
      $("#" + id).parent().addClass("disabled");
    } else {
      $("#" + id).parent().removeClass("disabled");
    }
  }

  addItem(id, opt) {
    var item = this.createMenuItem(opt);
    if (opt.group) {
      var groupItems = $("#" + id + "-submenu").children(".menu-group-" + opt.group);
      if (groupItems.length === 0) {
        item.appendTo("#" + id + "-submenu");
      } else {
        for (var i = 0; i < groupItems.length; i++) {
          var groupItem = groupItems[i];
          var label = $(groupItem).find(".menu-label").html();
          if (opt.label < label) {
            $(groupItem).before(item);
            break;
          }
        }
        if (i === groupItems.length) {
          item.appendTo("#" + id + "-submenu");
        }
      }
    } else {
      item.appendTo("#" + id + "-submenu");
    }
  }
  removeItem(id) {
    $("#" + id).parent().remove();
  }

  setAction(id, action) {
    var opt = this.menuItems[id];
    if (opt) {
      opt.onselect = action;
    }
  }
}
