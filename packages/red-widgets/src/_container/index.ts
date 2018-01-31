// holds all Inversify bindings for red-widget classes

import {
  Container
} from 'inversify'

const widgetContainer = new Container()

import {
  Deploy
} from '../'

const TYPES = {
  DEPLOY: 'IDeploy',
  // .. TODO: more const to type name bindings, one for each class to be bound
}

// TODO: do all widget bindings
// TODO: do bindings to widget classes
widgetContainer.bind(TYPES.DEPLOY).to(Deploy)
// more bindings using same pattern

// TODO: perhaps merge container with runtime container here?
// see /docs on Service injection
// Container.merge(a: Container, b: Container)

// import {
//   container as runtimeContainer
// } from '@tecla5/red-runtime'
// const container = Container.merge(widgetContainer, runtimeContainer)

// export both the app container (simply named container) from merge
// and the widget only container named widgetContainer
export {
  // container,
  widgetContainer
}
