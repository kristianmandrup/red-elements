<template>
  <div id="app">
    <red-checkbox-set />
    <red-editable-list />
    <red-menu />
    <red-panel />
    <red-popover />

    <red-stack />
    <red-tabs />
    <p>Searchbox:
      <red-searchbox />
    </p>

    <p>TypedInput:
      <red-typed-input />
    </p>

  </div>
</template>

<script>
const log = console.log
import CheckboxSet from './CheckboxSet'
import EditableList from './EditableList'
import Menu from './Menu'
import Panel from './Panel'
import Popover from './Popover'
import SearchBox from './SearchBox'
import Stack from './Stack'
import Tabs from './Tabs'
import TypedInput from './TypedInput'
// ...

// font-awesome
// import 'font-awesome/css/font-awesome.min.css'
import 'font-awesome/css/font-awesome.css'

export default {
  name: 'app',
  components: {
    'red-checkbox-set': CheckboxSet,
    'red-editable-list': EditableList,
    'red-menu': Menu,
    'red-panel': Panel,
    'red-popover': Popover,
    'red-searchbox': SearchBox,
    'red-stack': Stack,
    'red-tabs': Tabs,
    'red-typed-input': TypedInput
    // ...
  }
}
</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>

<!-- Global CSS -->
<style>

</style>
