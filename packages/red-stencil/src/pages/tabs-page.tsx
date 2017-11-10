import { Component } from '@stencil/core'

@Component({
  tag: 'tabs-page',
  // styleUrl: '../_shared/header.scss'
})
export class TabsPage {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <div>
        <h1>Tabs page</h1>
        <main-menu />
      </div>
    )
  }
}
