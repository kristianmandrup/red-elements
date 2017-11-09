import { Component, Prop, Element } from '@stencil/core'

@Component({
  tag: 'red-node-editor',
  // styleUrl: '../_shared/header.scss'
})
export class RedNodeEditor {
  constructor() {
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="node-editor">
        <h3>Node Editor</h3>
      </div>
    );
  }
}
