import { IRED, TYPES, container } from '../../setup/setup';
import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(container);

export {
  lazyInject,
  IRED,
  TYPES
}

export {
  BaseContext,
  BaseContext as Context
} from './context'

export {
  jQuery,
  jQuery as $
} from './jquery'
