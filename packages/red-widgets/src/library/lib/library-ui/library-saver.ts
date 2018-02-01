import {
  log,
  $,
  Context,
  container,
  delegateTarget
} from './_base'

import {
  lazyInject,
  $TYPES
} from '../../../_container'

import {
  INotifications
} from '../../../_interfaces'

const TYPES = $TYPES.all

import { LibraryUI } from '../'
import { LibraryPoster } from './library-poster';

export interface ILibrarySaver {
  saveToLibrary(overwrite, options): Promise<any>
  postLibrary(data: any, options: any): Promise<any>
}

@delegateTarget({
  container,
})
export class LibrarySaver extends Context implements ILibrarySaver {
  @lazyInject(TYPES.notify) notify: INotifications

  protected libraryPoster: LibraryPoster

  constructor(public ui: LibraryUI) {
    super()
  }

  /**
   *
   * @param data
   * @param options
   */

  async postLibrary(data: any, options: any): Promise<any> {
    return await this.libraryPoster.postLibrary(data, options)
  }

  async saveToLibrary(overwrite, options) {
    const { notify } = this
    var name = $("#node-input-name").val().toString().replace(/(^\s*)|(\s*$)/g, "");
    var RED = options.RED;
    if (name === "") {
      name = RED._("library.unnamedType", {
        type: options.type
      });
    }


    var filename = $("#node-dialog-library-save-filename").val().toString().replace(/(^\s*)|(\s*$)/g, "");
    var pathname = $("#node-dialog-library-save-folder").val().toString().replace(/(^\s*)|(\s*$)/g, "");
    if (filename === "" || !/.+\.js$/.test(filename)) {
      notify.notify(RED._("library.invalidFilename"), "warning", "", 0);
      return;
    }
    var fullpath = pathname + (pathname === "" ? "" : "/") + filename;

    var queryArgs = [];
    var data: any = {};
    for (var i = 0; i < options.fields.length; i++) {
      var field = options.fields[i];
      if (field == "name") {
        data.name = name;
      } else {
        data[field] = $("#node-input-" + field).val();
      }
    }

    data.text = options.editor.getValue();

    options.fullpath = fullpath

    return await this.postLibrary(data, options)
  }
}
