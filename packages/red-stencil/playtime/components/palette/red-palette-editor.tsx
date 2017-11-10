import { Component, Prop, Element } from '@stencil/core'
import { palette, settings } from '../_widgets'

const { PaletteEditor } = palette.controllers
const { UserSettings } = settings.controllers

@Component({
  tag: 'red-palette-editor',
  styleUrl: 'styles/palette-editor.scss'
})
export class RedPaletteEditor {
  componentDidLoad() {
    let RED: any = {}
    RED.userSettings = new UserSettings(RED)

    // use Library controller as component controller
    // we likely have to pass `me`, so it can control the rendered DOM
    this.editor = new PaletteEditor({
      $el: this.me
    })
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() editor: any;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="palette-editor">
        <div class="editor-tray-header">
          <div class="editor-tray-titlebar">
            <ul class="editor-tray-breadcrumbs">
              <li data-i18n="palette.editor.title"></li>
            </ul>
          </div>
          <div class="editor-tray-toolbar">
            <button id="palette-editor-close" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only primary" role="button" aria-disabled="false" data-i18n="common.label.done"></button>
          </div>
        </div>
        <ul id="palette-editor-tabs"></ul>
      </div>
    );
  }
}
