import { Component, Prop, Element } from '@stencil/core'
import { tray } from '../_widgets'
const { controllers } = tray

@Component({
  tag: 'red-tray'
})
export class RedTray {
  componentDidLoad() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.tray = new controllers.Tray({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() tray: any;
  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="tray">
        <h3>Tray</h3>
      </div>
    );
  }
}
