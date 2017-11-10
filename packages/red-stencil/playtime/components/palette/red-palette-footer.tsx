import { Component } from '@stencil/core'

@Component({
  tag: 'red-palette-footer',
  styleUrl: 'styles/palette.scss' // extract into own palette-footer.scss
})
export class RedPaletteFooter {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="palette-footer">
        <a class="palette-button" id="palette-collapse-all" href="#">
          <i class="fa fa-angle-double-up"></i>
        </a>
        <a class="palette-button" id="palette-expand-all" href="#">
          <i class="fa fa-angle-double-down"></i>
        </a>
      </div>
    );
  }
}
