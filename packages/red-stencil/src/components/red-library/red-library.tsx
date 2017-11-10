import { Component, Prop, Element } from '@stencil/core'
import { library } from '../_widgets'
const { controllers } = library

@Component({
  tag: 'red-library',
  // styleUrl: 'red-menu.scss'
})
export class RedLibrary {
  componentDidLoad() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    // alternatively, pass the id for it to get a handle

    // the li
    const defaultOpts = {
      url: "functions", // where to get the data from
      type: "function", // the type of object the library is for
      // editor: this.editor, // the field name the main text body goes to
      mode: "ace/mode/javascript",
      fields: ['name', 'outputs']
    }
    const opts = Object.assign({
      $el: this.me,
      id: this.id
    }, defaultOpts)

    // instantiate library
    this.library = new controllers.Library(opts)
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() library: any;
  @Prop() id: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id={this.id}>
        <h3>Library</h3>
      </div>
    );
  }
}
