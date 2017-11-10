import { Component, Prop, Element } from '@stencil/core'

@Component({
  tag: 'red-main-container',
  // styleUrl: '../_shared/header.scss'
})
export class RedMainContainer {
  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

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
