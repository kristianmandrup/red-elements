<template>
  <div class="red-ui-search">
  </div>
</template>
<script>
import { Search } from './controllers/search'
export default {
  name: 'search',
  mounted() {
    log('search')
    let RED = {
    }
    new Search(RED)
  }
}
</script>

<style lang="scss">

</style>
