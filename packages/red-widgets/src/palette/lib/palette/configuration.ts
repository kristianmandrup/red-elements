import { Context, $, EditableList, Searchbox } from '../../../common'
import { Palette } from './';

export interface IPaletteConfiguration {
  configure()
}

import {
  container,
  delegates
} from '../container'

@delegates({
  container
})

export class PaletteConfiguration extends Context {
  // TODO: inject service Events

  constructor(public palette: Palette) {
    super()
  }

  /**
   * make Widget Factories Available
   * - Searchbox
   * - EditableList
   */
  makeWidgetFactoriesAvailable() {
    // make jquery Widget factories available for jQuery elements
    new Searchbox()
    new EditableList()
  }

  /**
   *
   */
  configure() {
    const { RED, rebind, palette } = this

    this.makeWidgetFactoriesAvailable()

    const {
      coreCategories
    } = palette

    const {
      addNodeType,
      removeNodeType,
      showNodeType,
      hideNodeType,
      filterChange,
      createCategoryContainer,
    } = rebind([
        'addNodeType',
        'removeNodeType',
        'showNodeType',
        'hideNodeType',
        'filterChange',
        'categoryContainers',
        'createCategoryContainer',
      ], palette)

    this.addEventHandlers()

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
      createCategoryContainer(category, RED._("palette.label." + category, {
        defaultValue: category
      }));
    });

    this.addElementEventHandlers()
  }

  /**
   * add Element Event Handlers
   */
  addElementEventHandlers() {
    const {
      categoryContainers,
    } = this.palette

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

  /**
   * add Event Handlers
   */
  addEventHandlers() {
    const {
      addEventHandler,
      onNodeSetRemoved,
      onNodeSetDisabled,
      onNodeSetEnabled,
      onNodeTypeAdded,
      onNodeTypeRemoved
    } = this.rebind([
        'addEventHandler',
        'onNodeSetRemoved',
        'onNodeSetDisabled',
        'onNodeSetEnabled',
        'onNodeTypeAdded',
        'onNodeTypeRemoved',
      ])

    // NodeType events
    addEventHandler('registry:node-type-added', onNodeTypeAdded)
    addEventHandler('registry:node-type-removed', onNodeTypeRemoved);

    // NodeSet events
    addEventHandler('registry:node-set-enabled', onNodeSetEnabled)
    addEventHandler('registry:node-set-disabled', onNodeSetDisabled);
    addEventHandler('registry:node-set-removed', onNodeSetRemoved)
  }

  protected onNodeTypeRemoved(nodeType) {
    const {
      removeNodeType
    } = this.rebind([
        'removeNodeType'
      ])
    removeNodeType(nodeType);
  }

  protected onNodeTypeAdded(nodeType) {
    const {
      RED
    } = this
    const {
      addNodeType
    } = this.rebind([
        'addNodeType'
      ])
    var def = RED.nodes.getType(nodeType);
    addNodeType(nodeType, def);
    if (def.onpaletteadd && typeof def.onpaletteadd === "function") {
      def.onpaletteadd.call(def);
    }
  }

  protected onNodeSetEnabled(nodeSet) {
    const {
      RED
    } = this
    const {
      showNodeType
    } = this.rebind([
        'showNodeType'
      ])
    for (var j = 0; j < nodeSet.types.length; j++) {
      showNodeType(nodeSet.types[j]);
      var def = RED.nodes.getType(nodeSet.types[j]);
      if (def.onpaletteadd && typeof def.onpaletteadd === "function") {
        def.onpaletteadd.call(def);
      }
    }
  }

  protected onNodeSetDisabled(nodeSet) {
    const {
      RED
    } = this
    const {
      hideNodeType
    } = this.rebind([
        'hideNodeType'
      ])

    for (var j = 0; j < nodeSet.types.length; j++) {
      hideNodeType(nodeSet.types[j]);
      var def = RED.nodes.getType(nodeSet.types[j]);
      if (def.onpaletteremove && typeof def.onpaletteremove === "function") {
        def.onpaletteremove.call(def);
      }
    }
  }

  protected onNodeSetRemoved(nodeSet) {
    const {
      RED
    } = this
    const {
      removeNodeType
    } = this.rebind([
        'removeNodeType'
      ])

    if (nodeSet.added) {
      for (var j = 0; j < nodeSet.types.length; j++) {
        removeNodeType(nodeSet.types[j]);
        var def = RED.nodes.getType(nodeSet.types[j]);
        if (def.onpaletteremove && typeof def.onpaletteremove === "function") {
          def.onpaletteremove.call(def);
        }
      }
    }
  }

  addEventHandler(eventName: string, eventHandler: Function) {
    const {
      RED
    } = this
    RED.events.on(eventName, eventHandler)
  }
}
