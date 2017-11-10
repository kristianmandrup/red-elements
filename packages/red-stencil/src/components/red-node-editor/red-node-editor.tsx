import { Component, Prop, Element } from '@stencil/core'
import { nodeEditor } from '../_widgets'
import { Actions } from "@tecla5/red-shared/src/ui/actions";
const { controllers } = nodeEditor

@Component({
  tag: 'red-node-editor',
  // styleUrl: '../_shared/header.scss'
})
export class RedNodeEditor {
  componentDidLoad() {
    console.log('NodeEditor');
    let ctx: any = {}
    ctx.actions = new Actions(ctx)
    new controllers.Editor(ctx)
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() title: string;

  // reuse Editor.vue template from red-vue ??
  // or see node-red mustached .mst template ??
  render() {
    return (
      <div id="node-editor">
        <h3>Node Editor</h3>
      </div>
    );
  }
}
