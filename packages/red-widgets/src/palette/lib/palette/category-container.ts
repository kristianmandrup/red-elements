import { Context, $ } from '../../../common'
import { Palette } from './';

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
    var catDiv = $('<div id="palette-container-' + category + '" class="palette-category palette-close hide">' +
      '<div id="palette-header-' + category + '" class="palette-header"><i class="expanded fa fa-angle-down"></i><span>' + label + '</span></div>' +
      '<div class="palette-content" id="palette-base-category-' + category + '">' +
      '<div id="palette-' + category + '-input"></div>' +
      '<div id="palette-' + category + '-output"></div>' +
      '<div id="palette-' + category + '-function"></div>' +
      '</div>' +
      '</div>').appendTo(container);

    categoryContainers[category] = {
      container: catDiv,
      close: () => {
        catDiv.removeClass("palette-open");
        catDiv.addClass("palette-closed");
        $("#palette-base-category-" + category).slideUp();
        $("#palette-header-" + category + " i").removeClass("expanded");
      },
      open: () => {
        catDiv.addClass("palette-open");
        catDiv.removeClass("palette-closed");
        $("#palette-base-category-" + category).slideDown();
        $("#palette-header-" + category + " i").addClass("expanded");
      },
      toggle: () => {
        if (catDiv.hasClass("palette-open")) {
          categoryContainers[category].close();
        } else {
          categoryContainers[category].open();
        }
      }
    };

    $("#palette-header-" + category).on('click', function (e) {
      categoryContainers[category].toggle();
    })
    return this
  }
}
