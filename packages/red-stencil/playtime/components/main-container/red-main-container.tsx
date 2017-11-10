import { Component } from '@stencil/core'

@Component({
  tag: 'red-main-container',
  // styleUrl: '../_shared/header.scss'
})
export class RedMainContainer {
  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="main-container" class="sidebar-closed hide">
        <red-workspace />
        <red-palette />
        <red-editor />
        <red-sidebar />
        <div id="sidebar-separator"></div>
      </div>
    );
  }
}
