<template>
  <div class="red-ui-popover" id="popover">
    <h3>popover</h3>
  </div>
</template>
<script>
const log = console.log;
import { Popover } from "../controllers/popover";
import "../styles/popover.scss";

export default {
  name: "popover",
  mounted() {
    log("popover");
    let options = {
      id: "popover"
    };
    new Popover(options);
  }
};
</script>


