<template>
  <div class="red-ui-searchBox" ref="searchBox">
  </div>
</template>
<script>
// <h3>searchBox</h3>
const log = console.log;
import searchBox from "../controllers/searchBox";
import "../styles/searchBox.scss";
import { wrap } from "./util";

searchBox();

export default {
  name: "searchBox",
  mounted() {
    log("searchBox");
    const options = {};
    wrap(this, "searchBox", options);
  }
};
</script>


