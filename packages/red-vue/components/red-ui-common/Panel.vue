<template>
  <div class="red-ui-panel" id="my-panel">
    <div class="one">First child</div>
    <div class="two">Second child</div>
  </div>
</template>
<script>
// <h3>panel</h3>
const log = console.log;
import { Panel } from "../controllers/panel";

// Note: Panel must have 2 children!
export default {
  name: "panel",
  mounted() {
    log("panel");
    let options = {
      id: "my-panel"
    };
    new Panel(options);
  }
};
</script>

<style lang="scss">

</style>
