import { Component, Prop, Element } from '@stencil/core'
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

  // @Prop() library: any;
  @Prop() id: string;

  // reuse Header.vue template from red-vue
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
