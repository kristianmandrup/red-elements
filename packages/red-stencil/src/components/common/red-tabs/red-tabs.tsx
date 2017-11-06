import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-tabs',
  // styleUrl: 'red-tabs.scss'
})
export class RedTabs {
  constructor() {
    // registers Tabs as a jQuery widget on $
    controllers.Tabs()
    // now turn this element into a Tabs jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() first: string;

  render() {
    return (
      <div>
        Tabs {this.first}
      </div>
    );
  }
}
