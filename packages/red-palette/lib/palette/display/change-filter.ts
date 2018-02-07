import { Palette } from '../';

import {
  Context,
  $,
  container,
  delegateTarget,
  delegator
} from '../_base'

export interface IPaletteChangeFilter {
  /**
   * filter Change
   * @param val
   */
  filterChange(val: string)
}

@delegator()
export class PaletteChangeFilter extends Context implements IPaletteChangeFilter {
  constructor(public palette: Palette) {
    super()
  }

  /**
   * filter Change
   * @param val
   */
  filterChange(val: string) {
    const {
      categoryContainers
    } = this

    var re = new RegExp(val.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    $("#palette-container .palette_node").each(function (i, el) {
      var currentLabel = $(el).find(".palette_label").text();
      if (val === "" || re.test(el.id) || re.test(currentLabel)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });

    for (var category in categoryContainers) {
      if (categoryContainers.hasOwnProperty(category)) {
        if (categoryContainers[category].container
          .find(".palette_node")
          .filter(function () {
            return $(this).css('display') !== 'none'
          }).length === 0) {
          categoryContainers[category].close();
        } else {
          categoryContainers[category].open();
        }
      }
    }
    return this
  }
}
