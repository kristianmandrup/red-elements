import { Component, Prop, Element } from '@stencil/core'
import { palette } from '../_widgets'
const { controllers } = palette

@Component({
  tag: 'red-palette',
  styleUrl: 'styles/palette.scss'
})
export class RedPalette {
  componentDidLoad() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.palette = new controllers.Palette({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() palette: any;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="palette">
        <img src="red/images/spin.svg" class="palette-spinner hide" />
        <div id="palette-search" class="palette-search hide">
          <input type="text" data-i18n="[placeholder]palette.filter"></input>
        </div>
        <red-palette-editor />
        <div id="palette-container" class="palette-scroll hide"></div>
        <red-palette-footer />
        <div id="palette-shade" class="hide"></div>
      </div>
    );
  }
}
