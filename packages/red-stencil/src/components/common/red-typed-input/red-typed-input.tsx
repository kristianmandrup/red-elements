import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-typed-input',
  // TODO: move here
  styleUrl: '../../_shared/styles/typedInput.scss'
})
export class RedTypedInput {
  componentDidLoad() {
    // registers TypedInput as a jQuery widget on $
    controllers.TypedInput()
    // now turn this element into a TypedInput jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() id: string;

  render() {
    return (
      <div id={this.id}>
        TypedInput
      </div>
    );
  }
}
