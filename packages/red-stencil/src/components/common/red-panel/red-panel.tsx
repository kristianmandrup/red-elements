import { Component, Prop } from '@stencil/core'
import { controllers } from '../controllers'
// import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-panel',
  // styleUrl: 'red-panel.scss'
})
export class RedPanel {
  componentDidLoad() {
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
