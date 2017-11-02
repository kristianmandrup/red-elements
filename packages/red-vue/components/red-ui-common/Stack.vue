<template>
  <div class="red-ui-stack">

  </div>
</template>
<script>
// <h3>stack</h3>
const log = console.log;
import { Stack } from "../controllers/stack";

export default {
  name: "stack",
  mounted() {
    log("stack");
    let options = {};
    new Stack(options);
  }
};
</script>

<style lang="scss">

</style>
