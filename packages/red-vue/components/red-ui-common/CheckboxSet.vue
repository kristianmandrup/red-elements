<template>
  <div class="red-ui-checkboxSet" ref="checkboxSet">
    <h3>checkboxSet</h3>
  </div>
</template>
<script>
const log = console.log;
import checkboxSet from "../controllers/checkboxSet";
import "../styles/checkboxSet.scss";
import { wrap } from "./util";

checkboxSet();

export default {
  name: "checkboxSet",
  mounted() {
    log("checkboxSet");
    let options = {};
    wrap(this, "checkboxSet", options);
  }
};
</script>


