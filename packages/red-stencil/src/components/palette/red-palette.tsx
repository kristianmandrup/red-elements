import { Component, Prop, Element } from '@stencil/core'
import { palette } from '../_widgets'
const { controllers } = palette

@Component({
  tag: 'red-palette',
  // styleUrl: 'red-menu.scss'
})
export class RedPalette {
  constructor() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.palette = new controllers.Palette({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() palette: any;
  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="palette">
        <h3>Library</h3>
      </div>
    );
  }
}
