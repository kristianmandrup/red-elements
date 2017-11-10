import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-editable-list',
  styleUrl: 'styles/editableList.scss'
})
export class RedEditableList {
  componentDidLoad() {
    // context should (ideally) be the RED runtime?
    const ctx = {
      id: this.id
    }
    // registers CheckboxSet as a jQuery widget on $
    // use new ?
    controllers.EditableList(ctx)

    // now turn this element into a EditableList jQuery widget
    createjQueryWidget({
      $el: this.me,
      name: 'editableList' // name of widget
    });
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() id: string;

  render() {
    return (
      <div id={this.id}>
        Editable list
      </div>
    );
  }
}
