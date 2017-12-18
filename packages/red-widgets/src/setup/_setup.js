import { Bottle } from "../../node_modules/bottlejs/dist/bottle";

var inversify = require("inversify");
require("reflect-metadata");

var RED =
{
   settings : {
    theme(id) { },
    get(id) { return id },
    set(settings, state) { },
    remove(id) { }
  },
   actions : {
    get(callback) { },
    add(selector, elem) { }
  },
   events : {
    on(elem, fun) { },
    emit(elm) { }
  },
   view : {
    focus() { }
  },
   text : {
    bidi: {
      // for renameTab
      resolveBaseTextDir(label) {
        return label;
      }
    }
  },
   utils : {
    getNodeIcon(def) { }
  },
   popover : {
    create(obj) { }
  },
   nodes : {
    subflow(index) { },
    addLink(link) { },
    removeLink(link) { }
  },
   sidebar : {
    info: {
      set(text) { }
    }
  },
   _ : function () { },
   tray : {
    close() { },
    show() { }
  },
   tabs : {
    create(obj) { }
  },
   history : {
    push(event) { }
  },
   editor : {
    validateNode(node) { }
  },
   userSettings : {
    toggle(elem) { }
  },
   workspaces : {
    active() { }
  },
   subflow : {
    refresh(val) { }
  },
   state : {
    QUICK_JOINING: true,
    JOINING: true,
    DEFAULT: true,
    MOVING_ACTIVE: true,
    MOVING: true,
    IMPORT_DRAGGING: true
  },
   typeSearch : {
    show(obj) { }
  },
   touch : {
    radialMenu: {
      active: () => { }
    }
  },
   keyboard : {
    remove(selector) { },
    add(selector) { }
  },
  /**
   *  setDisabled
   */
   menu : {
    setDisabled() { }
  },
  notify(func, node) { }
}
var bottle = new Bottle();
var _RED = function () {
  return RED;
}
bottle.service("RED", _RED);
// bottle.service("Menu", MenuFactory, 'RED');
export { bottle };

