import { Component, Prop, Element } from '@stencil/core'
import { library } from '../_widgets'
const { controllers } = library

@Component({
  tag: 'red-library',
  // styleUrl: 'red-menu.scss'
})
export class RedLibrary {
  constructor() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.library = new controllers.Library({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() library: any;
  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="library">
        <h3>Library</h3>
      </div>
    );
  }
}
