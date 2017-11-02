<template>
  <div id="workspace">
    <ul id="workspace-tabs"></ul>
    <div id="chart" tabindex="1"></div>
    <red-workspace-toolbar />
    <div id="workspace-footer">
      <a class="workspace-footer-button" id="btn-zoom-out" href="#">
        <i class="fa fa-minus"></i>
      </a>
      <a class="workspace-footer-button" id="btn-zoom-zero" href="#">
        <i class="fa fa-circle-o"></i>
      </a>
      <a class="workspace-footer-button" id="btn-zoom-in" href="#">
        <i class="fa fa-plus"></i>
      </a>
    </div>
    <div id="editor-shade" class="hide"></div>
  </div>
</template>
<script>
import WorkspaceToolbar from './WorkspaceToolbar'
import { Workspaces } from './controllers/workspaces'
const log = console.log

const events = {}
const actions = {}
const menu = {}

let RED = {
  events,
  actions,
  menu
}

export default {
  name: 'workspace',
  components: {
    'red-workspace-toolbar': WorkspaceToolbar
  },
  mounted() {
    new Workspaces(RED)
  }
}
</script>

<style lang="scss" src="./styles/workspace.scss">

</style>
