// holds all Inversify bindings for red-widget classes

import {
  Container
} from 'inversify'

const widgetContainer = new Container()

import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(widgetContainer)

import {
  Deploy
} from '../'


import {
  runtimeContainer,
  TYPES as RUNTIME_TYPES
} from '@tecla5/red-runtime'

const WIDGET_TYPES = {
  deploy: 'IDeploy',
  // .. TODO: more const to type name bindings, one for each class to be bound
}

const $TYPES = {
  widgets: WIDGET_TYPES,
  runtime: RUNTIME_TYPES
}

// TODO: do all widget bindings to widget classes
widgetContainer.bind(WIDGET_TYPES.deploy).to(Deploy)

// merge container with runtime container here?
// see /docs on Service injection
// Container.merge(a: Container, b: Container)

const container = Container.merge(widgetContainer, runtimeContainer)

// export both the app container (simply named container) from merge
// and the widget only container named widgetContainer
export {
  lazyInject,
  WIDGET_TYPES,
  $TYPES,
  container,
  widgetContainer
}
