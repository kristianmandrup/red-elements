import { Component } from '@stencil/core'

@Component({
  tag: 'main-menu',
  // styleUrl: '../_shared/header.scss'
})
export class MainMenu {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <ul>
        <li>
          <stencil-route-link url="/">Home</stencil-route-link>
        </li>
        <li>
          <stencil-route-link url="/tabs">Tabs</stencil-route-link>
        </li>
        <li>
          <stencil-route-link url="/palette">Palette</stencil-route-link>
        </li>
      </ul>

    )
  }
}
