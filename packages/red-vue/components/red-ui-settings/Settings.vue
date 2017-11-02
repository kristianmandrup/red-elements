<template>
  <div class="red-ui-settings">
  </div>
</template>
<script>
const log = console.log
import { UserSettings } from './controllers/userSettings'

const RED = {
  actions: {}
}

export default {
  name: 'settings',
  mounted() {
    log('settings')
    new UserSettings(RED)
  }
}
</script>

<style lang="scss" src="./styles/userSettings.scss">

</style>
