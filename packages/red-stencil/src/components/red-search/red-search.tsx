import { Component, Prop, Element } from '@stencil/core'
import { search } from '../_widgets'
const { controllers } = search

@Component({
  tag: 'red-search',
  // styleUrl: 'red-menu.scss'
})
export class RedSearch {
  componentDidLoad() {
    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.search = new controllers.Search({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() search: any;
  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="search">
        <h3>Search</h3>
      </div>
    );
  }
}
