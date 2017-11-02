<template>
  <div class="red-ui-typedInput" ref="typedInput">
  </div>
</template>
<script>
// <h3>typedInput</h3>

const log = console.log;
import typedInput from "../controllers/typedInput";
import { wrap } from "../util";

// TODO: pass Singleton instance
const RED = {
  utils: {}
};
typedInput(RED);

export default {
  name: "typedInput",
  mounted() {
    log("typedInput");
    const options = {};
    wrap(this, "typedInput", options);
  }
};
</script>

<style lang="scss" src="../styles/typedInput.scss"></style></style>
