<template>
  <div id="palette">
    <img src="red/images/spin.svg" class="palette-spinner hide" />
    <div id="palette-search" class="palette-search hide">
      <input type="text" data-i18n="[placeholder]palette.filter"></input>
    </div>
    <red-palette-editor />
    <div id="palette-container" class="palette-scroll hide"></div>
    <red-palette-footer />
    <div id="palette-shade" class="hide"></div>
  </div>
</template>
<script>
const log = console.log;
import { Palette } from "./controllers/palette";
import PaletteEditor from "./PaletteEditor";
import { Events } from "@tecla5/red-shared/src/events";

let RED = {
  events: new Events(RED)
};

export default {
  name: "palette",
  components: {
    "red-palette-editor": PaletteEditor,
    "red-palette-footer": PaletteFooter
  },
  mounted() {
    log("editor");
    new Palette(RED);
  }
};
</script>

<style lang="scss" src="./styles/palette.scss">

</style>
