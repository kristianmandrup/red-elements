import {
  IValidator,
  Validator
} from '@tecla5/red-base'

export interface IWidgetValidator extends IValidator {
  _validateJQ(obj: JQuery<HTMLElement>, name, methodName: string, info?: any)
}

export class WidgetValidator extends Validator implements IWidgetValidator {
  _validateJQ(obj: JQuery<HTMLElement>, name, methodName: string, info?: any) {
    if (obj instanceof jQuery) return true
    this.handleError(`${methodName}: ${name} must be a $ (jQuery) element`, {
      [name]: obj,
      info
    })
  }
}



