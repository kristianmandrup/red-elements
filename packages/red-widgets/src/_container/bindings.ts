import {
  widgets,
} from '../'

import {
  TYPES,
  containers
} from './'

function isClassy(clazz) {
  return typeof clazz === 'function'
}

// TODO: do all widget bindings to widget classes
// naive, cumbersome appraoch
// widgetContainer.bind(WIDGET_TYPES.canvas).to(Canvas)

// Better to automatically build all bindings!!!
// auto bind via conventions
Object.keys(widgets).map(widgetName => {
  const widgetTypeName = widgetName.toLowerCase()
  const type = TYPES.widgets[widgetTypeName]

  const clazz = widgets[widgetName]
  if (type && isClassy(clazz)) {
    containers.widgets.bind(type).to(clazz)
  }
})

// merge container with runtime container here?
// see /docs on Service injection
// Container.merge(a: Container, b: Container)
