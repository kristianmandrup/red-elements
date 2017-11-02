<template>
  <div id="sidebar">
    <ul id="sidebar-tabs"></ul>
    <div id="sidebar-content"></div>
    <div id="sidebar-footer"></div>
    <div id="sidebar-shade" class="hide"></div>
  </div>
</template>
<script>
const log = console.log
import { Sidebar } from './controllers/sidebar'
// import './styles/sidebar.scss'

export default {
  name: 'sidebar',
  mounted() {
    log('sidebar')
    let RED = {
      sidebar: {}
    };
    let options = {}
    new Sidebar(RED)
  }
}
</script>

<style lang="scss" src="./styles/sidebar.scss">

</style>
