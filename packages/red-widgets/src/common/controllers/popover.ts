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
import * as $ from "jquery";

var deltaSizes = {
  "default": {
    top: 10,
    leftRight: 17,
    leftLeft: 25
  },
  "small": {
    top: 5,
    leftRight: 8,
    leftLeft: 16
  }
}

export class Popover {

  /**
   *
   * @param {Object} options
   *
   * - target: element to target
   * - direction (default: 'right')
   * - trigger: trigger event type (hover, onmouseover, ...)
   * - content: what to display
   * - delay: delay time in ms
   * - width
   * - size (default or small)
   */
  target: any;
  direction: any;
  trigger: any;
  content: any;
  delay: any;
  width: any;
  active: any;
  size: string;
  timer: any;
  div: any;
  constructor(options) {
    if (!options.target) {
      throw new Error('Popover must take a target: option that is a jQuery element')
    }

    this.target = options.target;
    this.direction = options.direction || "right";
    this.trigger = options.trigger;
    this.content = options.content;
    this.delay = options.delay;
    this.width = options.width || "auto";
    var size = options.size || "default";
    this.active = options.active || true;
    if (!deltaSizes[size]) {
      throw new Error(`Invalid RED.popover size value: ${size}`);
    }
    this.size = size

    this.timer = null;
  }

  openPopup() {
    let {
      active,
      target,
      direction,
      size,
      content,
      width,
      div,
      delay
    } = this
    if (active) {
      div = $('<div class="red-ui-popover red-ui-popover-' + direction + '"></div>').appendTo("body");
      if (size !== "default") {
        div.addClass("red-ui-popover-size-" + size);
      }
      if (typeof content === 'function') {
        content.call().appendTo(div);
      } else {
        div.html(content);
      }
      if (width !== "auto") {
        div.width(width);
      }


      var targetPos = target.offset();
      var targetWidth = target.width();
      var targetHeight = target.height();

      var divHeight = div.height();
      var divWidth = div.width();
      if (direction === 'right') {
        div.css({
          top: targetPos.top + targetHeight / 2 - divHeight / 2 - deltaSizes[size].top,
          left: targetPos.left + targetWidth + deltaSizes[size].leftRight
        });
      } else if (direction === 'left') {
        div.css({
          top: targetPos.top + targetHeight / 2 - divHeight / 2 - deltaSizes[size].top,
          left: targetPos.left - deltaSizes[size].leftLeft - divWidth
        });
      }

      div.fadeIn("fast");
    }
    return this
  }

  closePopup() {
    let {
      trigger,
      active,
      timer,
      div,
      target,
      delay
    } = this

    if (!active) {
      if (div) {
        div.fadeOut("fast", function () {
          $(this).remove();
        });
        div = null;
      }
    }

    if (trigger === 'hover') {
      target.on('mouseenter', (e) => {
        clearTimeout(timer);
        active = true;
        timer = setTimeout(this.openPopup, this.delay.show);
      });
      target.on('mouseleave', (e) => {
        if (timer) {
          clearTimeout(timer);
        }
        active = false;
        setTimeout(this.closePopup, this.delay.hide);
      });
    } else if (trigger === 'click') {
      target.click((e) => {
        e.preventDefault();
        e.stopPropagation();
        active = !active;
        if (!active) {
          this.closePopup();
        } else {
          this.openPopup();
        }
      });
    }
    return this
  }

  setContent(_content) {
    this.content = _content;
    return this
  }

  open() {
    this.active = true;
    this.openPopup();
    return this
  }

  close() {
    this.active = false;
    this.closePopup();
    return this
  }
}
