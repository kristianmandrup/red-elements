<template>
  <div id="main-container">
    <div id="main-container" class="sidebar-closed hide">
      <red-workspace />
      <red-palette />
      <red-editor />
      <red-sidebar />
      <div id="sidebar-separator"></div>
    </div>
  </div>
</template>
<script>
const log = console.log
import Palette from '@tecla5/red-ui-palette/src/components/Palette'
import Editor from '@tecla5/red-ui-node-editor/src/components/Editor'
import Sidebar from '@tecla5/red-ui-sidebar/src/components/Sidebar'
import Workspace from '@tecla5/red-ui-workspaces/src/components/Workspace'

export default {
  name: 'mainContainer',
  components: {
    'red-palette': Palette,
    'red-editor': Editor,
    'red-sidebar': Sidebar,
    'red-workspace': Workspace
  },
  created() {
    log('mainContainer')
  }
}
</script>

<style lang="scss">

</style>
