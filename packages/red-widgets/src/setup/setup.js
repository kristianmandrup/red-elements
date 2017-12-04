import { Bottle } from "../../node_modules/bottlejs/dist/bottle";

import { Menu } from "../common/controllers/menu";
import { MenuFactory } from "../common/controllers/menu.factory";
var RED = {
  settings: {
    theme(id) { },
    get(settings) { },
    set(settings, state) { },
    remove(id) { }
  },
  actions: {
    get(callback) { }
  }
}
var bottle = new Bottle();
var _RED = function () {
  return RED;
}
bottle.service("RED", _RED);
bottle.service("Menu", MenuFactory, 'RED');
export { bottle };

