import { Component, Prop, Element } from '@stencil/core'
import { library } from '../_widgets'
const { controllers } = library

@Component({
  tag: 'lib-lookup',
  // styleUrl: 'red-menu.scss'
})
export class LibLookup {
  componentDidLoad() {
    // use dialog widget?
    controllers
  }

  @Prop() id: string;




  // See
  // How to handle inline styles with JSX/TSX
  // https://blog.blueberry.io/how-we-handle-inline-styles-with-typescript-and-react-2c257e039f2b
  render() {
    return (
      <div id="node-dialog-library-lookup" class="lookup hide">
        <form class="form-horizontal">
          <div class="form-row">
            <ul id="node-dialog-library-breadcrumbs" class="breadcrumb">
              <li class="active"><a href="#" data-i18n="[append]library.breadcrumb"></a></li>
            </ul>
          </div>
          <div class="form-row">
            <div class="row">
              <div id="node-select-library" class="select-lib"><ul></ul></div>
            </div>
            <div class="row2">
              <div class="node-text-editor" id="node-select-library-text" ></div>
            </div>
          </div>
        </form>
      </div >
    );
  }
}
