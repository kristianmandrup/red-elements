<template>
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
</template>
<script>
const log = console.log
import { PaletteEditor } from './controllers/editor'
import { UserSettings } from '@tecla5/red-ui-settings/src/components/controllers/userSettings'

let RED = {
  userSettings: new UserSettings(RED)
}

export default {
  name: 'paletteEditor',
  created() {
    log('paletteEditor')
    new PaletteEditor(RED)
  }
}
</script>

<style lang="scss" src="./styles/palette-editor.scss">

</style>
