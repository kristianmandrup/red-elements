<template>
  <div id="app">
    <red-palette />
  </div>
</template>

<script>
const log = console.log
import Palette from './Palette'

export default {
  name: 'app',
  components: {
    'red-palette': Palette
  }
}
</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>

<!-- Global CSS -->
<style>

</style>
