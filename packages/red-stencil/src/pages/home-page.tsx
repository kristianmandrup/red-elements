import { Component } from '@stencil/core'

@Component({
  tag: 'home-page',
  // styleUrl: '../_shared/header.scss'
})
export class HomePage {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <div>
        <h1>Home</h1>
        <main-menu />
      </div>
    )
  }
}
