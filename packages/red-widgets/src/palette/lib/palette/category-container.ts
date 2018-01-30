import { Context, $ } from '../../../common'
import { Palette } from './';

import {
  container,
  delegates
} from '../container'

@delegates({
  container
})

export class PaletteCategoryContainer extends Context {
  constructor(public palette: Palette) {
    super()
  }

  createCategoryContainer(category, label) {
    const {
      categoryContainers
    } = this.palette

    let labelOrCat = label || category
    if (!labelOrCat) {
      this.handleError('createCategoryContainer: Must take a category and an optional label', {
        label,
        category
      })
    }

    // replace underscores with spaces
    label = labelOrCat.replace(/_/g, " ");

    const container = $('#palette-container')
    if (!container) {
      this.handleError('Page must have a #palette-container element to attach palette to')
    }

    // append palette to #palette-container
    const catDiv = this.buildCategoryContainer(category, container)
    const paletteBaseCategory = this.paletteBaseCategory(category)
    const paletteHeaderI = this.paletteHeaderCategory(category, true)
    const paletteHeader = this.paletteHeaderCategory(category)

    categoryContainers[category] = {
      container: catDiv,
      close: () => {
        catDiv.removeClass("palette-open");
        catDiv.addClass("palette-closed");
        paletteBaseCategory.slideUp();
        paletteHeaderI.removeClass("expanded");
      },
      open: () => {
        catDiv.addClass("palette-open");
        catDiv.removeClass("palette-closed");
        paletteBaseCategory.slideDown();
        paletteHeaderI.addClass("expanded");
      },
      toggle: () => {
        if (catDiv.hasClass("palette-open")) {
          categoryContainers[category].close();
        } else {
          categoryContainers[category].open();
        }
      }
    };

    paletteHeader.on('click', function (e) {
      categoryContainers[category].toggle();
    })
    return this
  }

  // protected

  protected paletteBaseCategory(category) {
    return $("#palette-base-category-" + category)
  }

  protected paletteHeaderCategory(category, i?: boolean) {
    category = i ? category + ' i' : category
    return $("#palette-header-" + category)
  }

  protected buildCategoryContainer(category, container) {
    return $('<div id="palette-container-' + category + '" class="palette-category palette-close hide">' +
      '<div id="palette-header-' + category + '" class="palette-header"><i class="expanded fa fa-angle-down"></i><span>' + label + '</span></div>' +
      '<div class="palette-content" id="palette-base-category-' + category + '">' +
      '<div id="palette-' + category + '-input"></div>' +
      '<div id="palette-' + category + '-output"></div>' +
      '<div id="palette-' + category + '-function"></div>' +
      '</div>' +
      '</div>').appendTo(container);

  }
}
