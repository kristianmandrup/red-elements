// holds all Inversify bindings for red-widget classes

import {
  Container
} from 'inversify'

const widgetContainer = new Container()

import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(widgetContainer)

import {
  Deploy,
  widgets
} from '../'


import {
  runtimeContainer,
  TYPES as RUNTIME_TYPES
} from '@tecla5/red-runtime'

// TODO: cleanup later.
// We likely don't need all these types defined/usd with inversify
const WIDGET_TYPES = {
  canvas: 'ICanvas',
  clipboard: 'IClipboard',
  common: {
    checkboxSet: 'ICheckboxSet',
    editableList: 'IEditableList',
    menu: 'IMenu',
    panel: 'IPanel',
    popover: 'IPopover',
    searchbox: 'ISearchbox',
    stack: 'IStack',
    tabs: 'ITabs',
    typedInput: 'ITypedInput',
    utils: 'ICommonUtils'
    // ...
  },
  deploy: 'IDeploy',
  keyboard: 'IKeyboard',
  library: 'ILibrary',
  main: 'IMain',
  nodeDiff: 'INodeDiff',
  nodeEditor: 'INodeEditor',
  notifications: 'INotifications',
  palette: 'IPalette',
  paletteEditor: 'IPaletteEditor',
  search: 'ISearch',
  sidebar: 'ISidebar',
  tray: 'ITray',
  user: 'IUser',
  userSettings: 'IUserSettings',
  utils: 'IUtils',
  workspaces: 'IWorkspaces',
  // .. TODO: more const to type name bindings, one for each class to be bound
}

function isClassy(clazz) {
  return typeof clazz === 'function'
}

const all = Object.assign({}, WIDGET_TYPES, RUNTIME_TYPES)

const $TYPES = {
  widgets: WIDGET_TYPES,
  runtime: RUNTIME_TYPES,
  all
}

// TODO: do all widget bindings to widget classes
// naive, cumbersome appraoch
// widgetContainer.bind(WIDGET_TYPES.canvas).to(Canvas)
// widgetContainer.bind(WIDGET_TYPES.clipboard).to(Clipboard)
// widgetContainer.bind(WIDGET_TYPES.deploy).to(Deploy)

// we can also try to automatically build all bindings!!!
// auto bind via conventions
Object.keys(widgets).map(widgetName => {
  const widgetTypeName = widgetName.toLowerCase()
  const type = WIDGET_TYPES[widgetTypeName]

  const clazz = widgets[widgetName]
  if (type && isClassy(clazz)) {
    widgetContainer.bind(type).to(clazz)
  }
})

// merge container with runtime container here?
// see /docs on Service injection
// Container.merge(a: Container, b: Container)

const container = Container.merge(widgetContainer, runtimeContainer)

// might be easier to use
const containers = {
  widget: widgetContainer,
  runtime: runtimeContainer
}

// export both the app container (simply named container) from merge
// and the widget only container named widgetContainer
export {
  lazyInject,
  WIDGET_TYPES,
  $TYPES,
  containers,
  container,
  widgetContainer
}
