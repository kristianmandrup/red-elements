import { Bottle } from "../../node_modules/bottlejs/dist/bottle";
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
  var _RED=function(){
    return RED;
  }
  bottle.service("RED", _RED);
  export { bottle };
  
  