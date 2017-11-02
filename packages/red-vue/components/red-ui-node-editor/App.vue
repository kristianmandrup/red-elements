<template>
  <div id="app">
    <red-editor />
  </div>
</template>

<script>
const log = console.log
import Editor from './Editor'

export default {
  name: 'app',
  components: {
    'red-editor': Editor
  }

}
</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>

<!-- Global CSS -->
<style>

</style>
