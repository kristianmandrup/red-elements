import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-editable-list',
  styleUrl: 'red-editable-list.scss'
})
export class RedEditableList {
  constructor() {
    // RED should (ideally) be the RED runtime
    const RED = {}
    // registers CheckboxSet as a jQuery widget on $
    controllers.EditableList(RED)

    // now turn this element into a CheckboxSet jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() first: string;

  render() {
    return (
      <div>
        Editable list {this.first}
      </div>
    );
  }
}
