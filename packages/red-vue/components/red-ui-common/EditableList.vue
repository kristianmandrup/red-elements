<template>
  <div class="red-ui-editableList" ref="editableList">

  </div>
</template>
<script>
// <h3>editableList</h3>
const log = console.log;
import editableList from "../controllers/editableList";
import { wrap } from "../util";

// TODO: pass Singleton instance
const RED = {
  utils: {}
};
editableList(RED);

export default {
  name: "editableList",
  mounted() {
    log("editableList");
    let options = {};
    wrap(this, "editableList", options);
  }
};
</script>

<style lang="scss" src="../styles/editableList.scss"></style>
