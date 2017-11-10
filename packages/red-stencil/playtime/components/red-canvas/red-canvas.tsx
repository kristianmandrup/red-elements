import { Component, Prop, Element } from '@stencil/core'
import { canvas } from '../_widgets'
const { controllers } = canvas

@Component({
  tag: 'red-canvas'
})
export class RedCanvas {
  componentDidLoad() {
    // use Canvas as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.canvas = new controllers.Canvas({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() canvas: any;
  @Prop() first: string;

  render() {
    return (
      <div>
        Canvas {this.first}
      </div>
    );
  }
}
