import { Context, $, EditableList, Searchbox } from '../../../common'
import { Palette } from './';

export class PaletteConfiguration extends Context {
  constructor(public palette: Palette) {
    super()
  }

  configure() {
    const { RED } = this

    // make jquery Widget factories available for jQuery elements
    new Searchbox()
    new EditableList()

    const {
      addNodeType,
      removeNodeType,
      showNodeType,
      hideNodeType,
      filterChange,
      categoryContainers
    } = this.rebind([
        'addNodeType',
        'removeNodeType',
        'showNodeType',
        'hideNodeType',
        'filterChange',
        'categoryContainers'
      ], this.palette)

    RED.events.on('registry:node-type-added', function (nodeType) {
      var def = RED.nodes.getType(nodeType);
      addNodeType(nodeType, def);
      if (def.onpaletteadd && typeof def.onpaletteadd === "function") {
        def.onpaletteadd.call(def);
      }
    });
    RED.events.on('registry:node-type-removed', function (nodeType) {
      removeNodeType(nodeType);
    });

    RED.events.on('registry:node-set-enabled', function (nodeSet) {
      for (var j = 0; j < nodeSet.types.length; j++) {
        showNodeType(nodeSet.types[j]);
        var def = RED.nodes.getType(nodeSet.types[j]);
        if (def.onpaletteadd && typeof def.onpaletteadd === "function") {
          def.onpaletteadd.call(def);
        }
      }
    });
    RED.events.on('registry:node-set-disabled', function (nodeSet) {
      for (var j = 0; j < nodeSet.types.length; j++) {
        hideNodeType(nodeSet.types[j]);
        var def = RED.nodes.getType(nodeSet.types[j]);
        if (def.onpaletteremove && typeof def.onpaletteremove === "function") {
          def.onpaletteremove.call(def);
        }
      }
    });
    RED.events.on('registry:node-set-removed', function (nodeSet) {
      if (nodeSet.added) {
        for (var j = 0; j < nodeSet.types.length; j++) {
          removeNodeType(nodeSet.types[j]);
          var def = RED.nodes.getType(nodeSet.types[j]);
          if (def.onpaletteremove && typeof def.onpaletteremove === "function") {
            def.onpaletteremove.call(def);
          }
        }
      }
    });


    $("#palette > .palette-spinner").show();

    // create searchBox widget
    const widget = $("#palette-search input")
    widget['searchBox']({
      delay: 100,
      change: function () {
        filterChange($(this).val());
      }
    })

    var categoryList = coreCategories;
    if (RED.settings.paletteCategories) {
      categoryList = RED.settings.paletteCategories;
    } else if (RED.settings.theme('palette.categories')) {
      categoryList = RED.settings.theme('palette.categories');
    }
    if (!Array.isArray(categoryList)) {
      categoryList = coreCategories
    }
    categoryList.forEach((category) => {
      this.createCategoryContainer(category, RED._("palette.label." + category, {
        defaultValue: category
      }));
    });

    $("#palette-collapse-all").on("click", function (e) {
      e.preventDefault();
      for (var cat in categoryContainers) {
        if (categoryContainers.hasOwnProperty(cat)) {
          categoryContainers[cat].close();
        }
      }
    });
    $("#palette-expand-all").on("click", function (e) {
      e.preventDefault();
      for (var cat in categoryContainers) {
        if (categoryContainers.hasOwnProperty(cat)) {
          categoryContainers[cat].open();
        }
      }
    });
  }
}
