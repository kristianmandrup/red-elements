<template>
  <div id="app">
    <red-search />
  </div>
</template>

<script>
const log = console.log
import Search from './Search'

export default {
  name: 'app',
  components: {
    'red-search': Search
  }
}

</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>

<!-- Global CSS -->
<style>

</style>
