import { Component, Prop, Element } from '@stencil/core'
import { workspaces } from '../_widgets'
const { controllers } = workspaces

@Component({
  tag: 'red-workspace',
  styleUrl: 'styles/workspace.scss'
})
export class RedWorkspace {
  componentDidLoad() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.workspaces = new controllers.Workspaces({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() workspaces: any;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="workspace">
        <ul id="workspace-tabs"></ul>
        <div id="chart" tabindex="1"></div>
        <red-workspace-toolbar />
        <red-workspace-footer />
        <div id="editor-shade" class="hide"></div>
      </div>
    );
  }
}
