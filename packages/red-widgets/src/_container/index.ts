// holds all Inversify bindings for red-widget classes

import {
  TYPES,
  containers
} from '@tecla5/red-base'

// TODO: We need to group injectors as well, such as injectors.widgets.lazyInject
import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(containers.widgets)

import {
  Canvas,
  Clipboard,
  Deploy,
  widgets
} from '../'

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

// export both the app container (simply named container) from merge
// and the widget only container named widgetContainer
export {
  lazyInject
}
