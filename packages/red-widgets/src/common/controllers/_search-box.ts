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
// jQuery
import {
  jQuery
} from './jquery-ui'
const log = console.log
import { bottle} from '../../setup/_setup'
const RED=bottle.container.RED;
export default factory

function factory() {
  (function ($) {
    // log('creating searchBox widget: nodered.searchBox', {
    //   $widget: $.widget
    // })

    $.widget("nodered.searchBox", {
      _create: function () {
        var that = this;
        this.currentTimeout = null;
        this.lastSent = "";
        this.element.val("");
        this.uiContainer = this.element.wrap("<div>").parent();
        this.uiContainer.addClass("red-ui-searchBox-container");

        // create handler in same scope
        this.clearButtonClick = (e) => {
          e.preventDefault();
          this.element.val("");
          this._change("", true);
          this.element.focus();
        }

        $('<i class="fa fa-search"></i>').prependTo(this.uiContainer);
        this.clearButton = $('<a class="btnClear" href="#"><i class="fa fa-times"></i></a>').appendTo(this.uiContainer);
        this.clearButton.on("click", (e) => this.clearButtonClick(e));

        this.resultCount = $('<span>', {
          class: "red-ui-searchBox-resultCount hide"
        }).appendTo(this.uiContainer);

        this.element.val("");
        // create handler out of scope and passed current state
        this.element.on("keydown", (evt) => this.handleKeyDown(evt, that));
        this.element.on("keyup", function (evt) {
          that._change($(this).val());
        });

        this.element.bind("focus", () => {
          $("body").on("mousedown", () => {
            this.element.blur();
          });
        });
      },
      _change: function (val, instant) {
        var fireEvent = false;
        if (val === "") {
          this.clearButton.hide();
          fireEvent = true;
        } else {
          this.clearButton.show();
          fireEvent = (val.length >= (this.options.minimumLength || 0));
        }
        var current = this.element.val();
        fireEvent = fireEvent && current !== this.lastSent;
        if (fireEvent) {
          if (!instant && this.options.delay > 0) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = setTimeout(() => {
              this.lastSent = this.element.val();
              this._trigger("change");
            }, this.options.delay);
          } else {
            this._trigger("change");
          }
        }
      },
      value: function (val) {
        if (val === undefined) {
          return this.element.val();
        } else {
          this.element.val(val);
          this._change(val);
        }
      },
      count: function (val) {
        if (val === undefined || val === null || val === "") {
          this.resultCount.text("").hide();
        } else {
          this.resultCount.text(val).show();
        }
      },
      change: function () {
        this._trigger("change");
      },
      handleKeyDown: function (evt, $this) {
        if (evt.keyCode === 27) {
          $this.element.val("");
        }
      }
    });
  })(jQuery);
}
