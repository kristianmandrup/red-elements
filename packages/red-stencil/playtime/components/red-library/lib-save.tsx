import { Component } from '@stencil/core'
import { library } from '../_widgets'
const { controllers } = library

@Component({
  tag: 'lib-save',
  // styleUrl: 'red-menu.scss'
})
export class LibSave {
  componentDidLoad() {
    // use dialog widget?
    controllers
  }

  // extracted from mustache template
  render() {
    return (
      <div id="node-dialog-library-save" class="hide">
        <form class="form-horizontal">
          <div class="form-row">
            <label htmlFor="node-dialog-library-save-folder" data-i18n="[append]library.folder"><i class="fa fa-folder-open"></i> </label>
            <input type="text" id="node-dialog-library-save-folder" data-i18n="[placeholder]library.folderPlaceholder" />
          </div>
          <div class="form-row">
            <label htmlFor="node-dialog-library-save-filename" data-i18n="[append]library.filename"><i class="fa fa-file"></i> </label>
            <input type="text" id="node-dialog-library-save-filename" data-i18n="[placeholder]library.filenamePlaceholder" />
          </div>
        </form>
      </div>
    );
  }
}
