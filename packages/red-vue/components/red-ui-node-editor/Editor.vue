<template>
  <div id="editor-stack">
  </div>
</template>
<script>
const log = console.log;
import { Editor } from "./controllers/editor";
import { Actions } from "@tecla5/red-shared/src/ui/actions";

export default {
  name: "editor",
  mounted() {
    log("editor");
    let RED = {
      actions: new Actions(RED)
    };
    new Editor(RED);
  }
};
</script>

<style lang="scss" src="./styles/editor.scss">

</style>
