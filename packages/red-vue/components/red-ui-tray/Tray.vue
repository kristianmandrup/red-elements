<template>
  <div id="tray">
  </div>
</template>
<script>
const log = console.log;
import { Tray } from "./controllers/tray";
import { Events } from "@tecla5/red-shared/src/events";

export default {
  name: "tray",
  mounted() {
    log("tray");

    let RED = {};
    let events = new Events(RED);
    RED.events = events;
    let options = {};
    new Tray(RED);
  }
};
</script>
