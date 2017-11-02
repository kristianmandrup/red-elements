<template>
  <div id="library-dialogs">
    <red-library-save-confirm />
    <red-library-save />
    <red-library-lookup />
  </div>
</template>
<script>
import SaveConfirm from './SaveConfirm.vue'
import Save from './Save.vue'
import Lookup from './Lookup.vue'

export default {
  name: 'sidebar',
  components: {
    'red-library-save-confirm': SaveConfirm,
    'red-library-save': Save,
    'red-library-lookup': Lookup
  },
  created() {
  }
}
</script>

<style lang="scss">

</style>

