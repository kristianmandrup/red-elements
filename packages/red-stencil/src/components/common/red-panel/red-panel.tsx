import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-panel',
  // styleUrl: 'red-panel.scss'
})
export class RedPanel {
  constructor() {
    // registers CheckboxSet as a jQuery widget on $
    controllers.Panel()
    // now turn this element into a CheckboxSet jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() first: string;

  render() {
    return (
      <div>
        Panel {this.first}
      </div>
    );
  }
}
