import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-typed-input',
  // styleUrl: 'red-typed-input.scss'
})
export class RedTypedInput {
  constructor() {
    // registers TypedInput as a jQuery widget on $
    controllers.TypedInput()
    // now turn this element into a TypedInput jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() first: string;

  render() {
    return (
      <div>
        TypedInput {this.first}
      </div>
    );
  }
}
