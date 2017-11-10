import { Component, Prop, Element } from '@stencil/core'
import { settings } from '../_widgets'
const { controllers } = settings

@Component({
  tag: 'red-settings',
  // styleUrl: 'red-menu.scss'
})
export class RedSettings {
  componentDidLoad() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.settings = new controllers.Settings({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() settings: any;
  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="settings">
        <h3>Settings</h3>
      </div>
    );
  }
}
