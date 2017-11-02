<template>
  <div id="app">
    <red-header />
    <red-main-container />
    <red-notifications />
    <red-drop-target />
    <red-confirm-deploy />
    <red-templates />
  </div>
</template>

<script>
const log = console.log
import Templates from './Templates'
import Header from '@tecla5/red-ui-header/src/components/Header'
import MainContainer from '@tecla5/red-ui-main-container/src/components/MainContainer'
import Notifications from './Notifications'
// import Notifications from 'red-ui-notifications/components/Notifications'
import DropTarget from './DropTarget'
import ConfirmDeploy from './ConfirmDeploy'

// ACE editor
import 'ace-builds/min-css/ace'
import 'ace-builds/min-css/ext-language_tools'
import 'ace-builds/min-css/ace'
// import 'ace-builds/min-css/theme-dawn'

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-themen.min.css'
import 'bootstrap/dist/js/bootstrap.min'

// bootstrap-select
import 'bootstrap-select/dist/css/bootstrap-select.min.css'
import 'bootstrap-select/dist/js/bootstrap-select.min'

// D3
import 'd3/build/d3.min.css'

// jsonata
import 'jsonata/jsonata.min'

// jquery
import 'jquery/dist/jquery.min'

// font-awesome
import 'font-awesome/css/font-awesome.min.css'

// marked
import 'marked/lib/marked'

// include styles (requires sass-loader in poi-config)
// import './styles/app.scss'

// import api from '@tecla5/red-api'
// import runtime from '@tecla5/red-runtime'

export default {
  name: 'mainContainer',
  components: {
    'red-templates': Templates,
    'red-header': Header,
    'red-main-container': MainContainer,
    'red-notifications': Notifications,
    'red-drop-target': DropTarget,
    'red-confirm-deploy': ConfirmDeploy
  },
  created() {
    // start runtime
    // runtime.main() // see main.js
  }
}
</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>

<!-- Global CSS -->
<!-- Global CSS -->
<style>

</style>
