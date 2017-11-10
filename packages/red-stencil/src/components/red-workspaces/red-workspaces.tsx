import { Component, Prop, Element } from '@stencil/core'
import { workspaces } from '../_widgets'
const { controllers } = workspaces

@Component({
  tag: 'red-workspaces',
  // styleUrl: 'red-menu.scss'
})
export class RedWorkspaces {
  constructor() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.workspaces = new controllers.Workspaces({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() workspaces: any;
  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="workspaces">
        <h3>Workspaces</h3>
      </div>
    );
  }
}
