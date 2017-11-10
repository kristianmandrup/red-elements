import { Component } from '@stencil/core'
import { library } from '../_widgets'
const { controllers } = library

@Component({
  tag: 'lib-save-confirm',
  // styleUrl: 'red-menu.scss'
})
export class LibSaveConfirm {
  componentDidLoad() {
    // use dialog widget?
    controllers
  }

  // extracted from mustache template
  render() {
    return (
      <div id="node-dialog-library-save-confirm" class="save-confirm hide">
        <form class="form-horizontal">
          <div class="content" id="node-dialog-library-save-content">
          </div>
        </form>
      </div>
    );
  }
}
