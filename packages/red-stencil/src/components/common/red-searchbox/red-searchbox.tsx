import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-searchbox',
  // styleUrl: 'red-searchbox.scss'
})
export class RedSearchbox {
  componentDidLoad() {
    // registers Searchbox as a jQuery widget on $
    controllers.Searchbox()
    // now turn this element into a Searchbox jQuery widget
    createjQueryWidget(this.me);
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() first: string;

  render() {
    return (
      <div>
        Searchbox {this.first}
      </div>
    );
  }
}
