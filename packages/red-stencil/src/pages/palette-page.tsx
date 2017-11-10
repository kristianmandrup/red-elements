import { Component } from '@stencil/core'

@Component({
  tag: 'palette-page',
  // styleUrl: '../_shared/header.scss'
})
export class PalettePage {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <div>
        <h1>Palette page</h1>
        <main-menu />
      </div>
    )
  }
}
