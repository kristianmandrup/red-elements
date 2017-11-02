<template>
  <div class="red-ui-diff">
  </div>
</template>
<script>
const log = console.log
import { Diff } from './controllers/diff'
export default {
  name: 'diff',
  mounted() {
    log('diff')
    let RED = {
    }
    new Diff(RED)
  }
}
</script>

<style lang="scss">

</style>
