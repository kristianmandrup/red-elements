<template>
  <div class="red-ui-menu" id="my-menu">
    <h3>menu</h3>
  </div>
</template>
<script>
const log = console.log;
import { Menu } from "../controllers/menu";

export default {
  name: "menu",
  mounted() {
    log("menu");
    let options = {
      id: "my-menu",
      options: {}
    };
    new Menu(options);
  }
};
</script>

<style lang="scss">

</style>
