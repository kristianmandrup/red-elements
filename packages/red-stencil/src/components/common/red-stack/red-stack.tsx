import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-stack',
  // styleUrl: 'red-stack.scss'
})
export class RedStack {
  constructor() {
    // registers Stack as a jQuery widget on $
    controllers.Stack()
    // now turn this element into a Stack jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() first: string;

  render() {
    return (
      <div>
        Stack {this.first}
      </div>
    );
  }
}
