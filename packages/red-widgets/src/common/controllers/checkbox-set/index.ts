import { IRED, TYPES, lazyInject } from '../../base'
import { Widget } from './widget'

export class CheckboxSet {
  @lazyInject(TYPES.RED) RED: IRED
  public widget: any

  constructor() {
    this.widget = new Widget(this.RED)
  }
}


