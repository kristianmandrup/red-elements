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

// jquery-ui and webpack, how to manage it into module?
// https://stackoverflow.com/questions/33998262/jquery-ui-and-webpack-how-to-manage-it-into-module

// Full GUIDE
// http://code.tonytuan.org/2017/03/webpack-import-jquery-ui-in-es6-syntax.html

// jQuery
const {
  log
} = console
import {
  jQuery
} from '../jquery-ui';

export function Widget(RED) {
  let { uiElement } = RED.uiElement
  let { options } = RED.options.parent
  let { parent } = RED.parent
  let { element } = RED.element
  let { children } = RED.children
  let { partialFlag } = RED.partialFlag
  let { stateValue } = RED.stateValue
  let { checked } = RED.checked
  let { optionsArray } = RED.options

    (function ($) {
      $['widget']("nodered.checkboxSet", {
        _create: function () {

          uiElement = element.wrap("<span>").parent();
          uiElement.addClass("red-ui-checkboxSet");
          if (options) {
            parent = options;
            parent.checkboxSet('addChild', element);
          }

          children = [];
          partialFlag = false;
          stateValue = 0;
          var initialState = element.prop('checked');
          optionsArray = [
            $('<span class="red-ui-checkboxSet-option hide"><i class="fa fa-square-o"></i></span>').appendTo(uiElement),
            $('<span class="red-ui-checkboxSet-option hide"><i class="fa fa-check-square-o"></i></span>').appendTo(uiElement),
            $('<span class="red-ui-checkboxSet-option hide"><i class="fa fa-minus-square-o"></i></span>').appendTo(uiElement)
          ];
          if (initialState) {
            optionsArray[1].show();
          } else {
            optionsArray[0].show();
          }

          element.change(() => {
            if (checked) {
              optionsArray[0].hide();
              optionsArray[1].show();
              optionsArray[2].hide();
            } else {
              optionsArray[1].hide();
              optionsArray[0].show();
              optionsArray[2].hide();
            }
            var isChecked = checked;
            children.forEach(function (child) {
              child.checkboxSet('state', isChecked, false, true);
            })
          })
          uiElement.click((e) => {
            e.stopPropagation();
            // state returns null for a partial state. Clicking on that should
            // result in false.
            this.state((this.state() === false) ? true : false);
          })
          if (parent) {
            parent.checkboxSet('updateChild', this);
          }
        },
        _destroy: function () {
          if (parent) {
            parent.checkboxSet('removeChild', element);
          }
        },
        addChild: function (child) {
          children.push(child);
        },
        removeChild: function (child) {
          var index = children.indexOf(child);
          if (index > -1) {
            children.splice(index, 1);
          }
        },
        updateChild: function (child) {
          var checkedCount = 0;
          children.forEach(function (c, i) {
            if (c.checkboxSet('state') === true) {
              checkedCount++;
            }
          });
          if (checkedCount === 0) {

            this.state(false, true);
          } else if (checkedCount === children.length) {
            this.state(true, true);
          } else {
            this.state(null, true);
          }
        },
        disable: function () {
          uiElement.addClass('disabled');
        },
        state: function (state, suppressEvent, suppressParentUpdate) {

          if (arguments.length === 0) {
            return partialFlag ? null : element.is(":checked");
          } else {
            partialFlag = (state === null);
            var trueState = partialFlag || state;
            element.prop('checked', trueState);
            if (state === true) {
              optionsArray[0].hide();
              optionsArray[1].show();
              optionsArray[2].hide();
            } else if (state === false) {
              optionsArray[2].hide();
              optionsArray[1].hide();
              optionsArray[0].show();
            } else if (state === null) {
              optionsArray[0].hide();
              optionsArray[1].hide();
              optionsArray[2].show();
            }
            if (!suppressEvent) {
              element.trigger('change', null);
            }
            if (!suppressParentUpdate && parent) {
              parent.checkboxSet('updateChild', this);
            }
          }
        }
      })

    })(jQuery);
}
