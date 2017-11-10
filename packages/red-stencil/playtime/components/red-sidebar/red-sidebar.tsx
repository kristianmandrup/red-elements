import { Component, Prop, Element } from '@stencil/core'
import { sidebar } from '../_widgets'
const { controllers } = sidebar

@Component({
  tag: 'red-sidebar',
  styleUrl: 'styles/sidebar.scss'
})
export class RedSidebar {
  componentDidLoad() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.sidebar = new controllers.Sidebar({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement

  @Prop() sidebar: any

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="sidebar">
        <ul id="sidebar-tabs"></ul>
        <div id="sidebar-content"></div>
        <div id="sidebar-footer"></div>
        <div id="sidebar-shade" class="hide"></div>
      </div>
    );
  }
}
