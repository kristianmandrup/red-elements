import { Component, Prop, Element } from '@stencil/core'

@Component({
  tag: 'red-node-diff',
  // styleUrl: '../_shared/header.scss'
})
export class RedNodeDiff {
  componentDidLoad() {
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() title: string;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="node-diff">
        <h3>Node Diff</h3>
      </div>
    );
  }
}
