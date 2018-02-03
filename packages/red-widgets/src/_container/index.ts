// holds all Inversify bindings for red-widget classes

import {
  TYPES,
  containers
} from '@tecla5/red-base'

// TODO: We need to group injectors as well, such as injectors.widgets.lazyInject
import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(containers.widgets)

// export both the app container (simply named container) from merge
// and the widget only container named widgetContainer
export {
  lazyInject,
  TYPES,
  containers
}
