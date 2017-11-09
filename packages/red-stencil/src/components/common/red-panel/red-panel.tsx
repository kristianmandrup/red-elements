import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-panel',
  // styleUrl: 'red-panel.scss'
})
export class RedPanel {
  constructor() {
    controllers.Panel({
      id: this.id
    })
  }

  @Prop() id: string;

  render() {
    return (
      <div id="{this.id}">
        <div class="panel first">first child</div>
        <div class="panel first">second child</div>
      </div>
    );
  }
}
