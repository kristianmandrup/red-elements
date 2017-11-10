import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-tabs',
  styleUrl: 'styles/tabs.scss'
})
export class RedTabs {
  // TODO: move to appropriate component lifecycle method!!!

  componentDidLoad() {
    // registers Tabs as a jQuery widget on $
    controllers.Tabs({
      id: this.id
    })

    // now turn this element into a Tabs jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() id: string;

  render() {
    return (
      <div class="red-ui-tabs" id={this.id}>
        <ul>
          <li class="red-ui-tab">hello</li>
          <li class="red-ui-tab">bye</li>
        </ul>
      </div>
    );
  }
}
