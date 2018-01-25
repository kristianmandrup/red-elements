
import {
  Library
} from './'
import { Context } from '../../../context';
import { LibraryApi } from '@tecla5/red-runtime';

const { log } = console

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export class LibraryFlowsLoader extends Context {
  protected libraryApi: LibraryApi

  constructor(public library: Library) {
    super()
  }

  /**
   * Takes a done cb function to be called when done loading
   */
  async loadFlowsLibrary() {
    const url = 'library/flows'

    const {
      libraryApi,
      onLoadFlowsSuccess,
      // onLoadError
    } = this

    this.libraryApi = new LibraryApi().configure({
      url
    })

    try {
      const result = await libraryApi.load()
      onLoadFlowsSuccess(result)
    } catch (error) {
      // onLoadError(error)
    }
  }

  async loadFlowByName(flowName: string) {
    const url = 'library/flows/' + flowName
    this.libraryApi = new LibraryApi().configure({
      url
    })

    const {
      libraryApi,
      onLoadFlowSuccess
    } = this

    try {
      flowName
      const result = await libraryApi.load()
      onLoadFlowSuccess(result)
    } catch (error) {
      // onLoadFlowError(error)
    }
  }

  onLoadFlowSuccess(data) {
    const {
      RED
    } = this
    RED.view.importNodes(data);
  }

  onLoadFlowsSuccess(data) {
    const {
      loadFlowByName
    } = this.rebind([
        'loadFlowByName'
      ])

    var buildMenu = (data, root) => {
      var i;
      var li;
      var a;
      var ul = document.createElement("ul");
      if (root === "") {
        ul.id = "menu-item-import-library-submenu";
      }
      ul.className = "dropdown-menu";
      if (data.d) {
        for (i in data.d) {
          if (data.d.hasOwnProperty(i)) {
            li = document.createElement("li");
            li.className = "dropdown-submenu pull-left";
            a = document.createElement("a");
            a.href = "#";
            var label = i.replace(/^node-red-contrib-/, "").replace(/^node-red-node-/, "").replace(/-/, " ").replace(/_/, " ");
            a.innerHTML = label;
            li.appendChild(a);
            li.appendChild(buildMenu(data.d[i], root + (root !== "" ? "/" : "") + i));
            ul.appendChild(li);
          }
        }
      }
      if (data.f) {
        for (i in data.f) {
          if (data.f.hasOwnProperty(i)) {
            li = document.createElement("li");
            a = document.createElement("a");
            a.href = "#";
            a.innerHTML = data.f[i];
            a.flowName = root + (root !== "" ? "/" : "") + data.f[i];
            a.onclick = async function () {
              await loadFlowByName(this.flowName)
            };
            li.appendChild(a);
            ul.appendChild(li);
          }
        }
      }
      return ul;
    };
    var examples;
    if (data.d && data.d._examples_) {
      examples = data.d._examples_;
      delete data.d._examples_;
    }
    var menu = buildMenu(data, "");
    $("#menu-item-import-examples").remove();
    if (examples) {
      this.ctx.menu.addItem("menu-item-import", {
        id: "menu-item-import-examples",
        label: this.ctx._("menu.label.examples"),
        options: []
      })
      $("#menu-item-import-examples-submenu").replaceWith(buildMenu(examples, "_examples_"));
    }
    //TODO: need an api in ctx.menu for this
    $("#menu-item-import-library-submenu").replaceWith(menu);

    return {
      loaded: true
    }
  }
}
