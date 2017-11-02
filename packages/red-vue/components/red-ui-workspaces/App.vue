<template>
  <div id="app">
    <red-workspaces />
  </div>
</template>

<script>

import Workspace from './Workspace'
export default {
  name: 'app',
  components: {
    'red-workspaces': Workspace
  }
}
</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>

<!-- Global CSS -->
<style>

</style>
