import { Component, Prop, Element } from '@stencil/core'

@Component({
  tag: 'red-main-container',
  // styleUrl: '../_shared/header.scss'
})
export class RedMainContainer {
  constructor() {
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="library">
        <h3>Library</h3>
      </div>
    );
  }
}
