import {
  Menu
}
from './menu'
import {
  Panel
}
from './panel'
import {
  Popover
}
from './popover'
import {
  Stack
}
from './stack'
import {
  Tabs
}
from './tabs'
import {
  default as CheckboxSet
}
from './checkbox-set'
import {
  default as TypedInput
}
from './typed-input'
import {
  default as EditableList
}
from './editable-list'
import {
  default as Searchbox
}
from './search-box'

Popover.create = (ctx, RED) => {
  return new Popover(ctx, RED)
}

Tabs.create = (ctx, RED) => {
  return new Tabs(ctx, RED)
}


export const controllers = {
  Menu,
  Panel,
  Popover,
  Stack,
  Tabs,
  CheckboxSet,
  TypedInput,
  EditableList,
  Searchbox
}

export default controllers

export {
  Menu,
  Panel,
  Popover,
  Stack,
  Tabs,
  CheckboxSet,
  TypedInput,
  EditableList,
  Searchbox
}
