import { IRED, TYPES, container } from '../../../setup/setup';
import getDecorators from 'inversify-inject-decorators';
let { lazyInject } = getDecorators(container);
import { Widget } from './widget'

class EditableList {
  @lazyInject(TYPES.RED) RED: IRED
  public widget: any

  constructor() {
    this.widget = new Widget(this.RED)
  }
}


