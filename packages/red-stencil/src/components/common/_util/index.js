import {
  default as $
} from 'jquery';

// used to turn a DOM element (ie. custom element root elem) into a jQuery widget
export function createjQueryWidget(options = {}) {
  const {
    $el,
    widgetName,
    options
  } = options
  // get the element by refName, such as by class
  if (!$el) {
    let errMsg = `missing root element: $el in options`
    console.error(errMsg)
    // throw new Error(errMsg)
    return
  }
  console.log('createjQueryWidget', {
    $el,
    widgetName,
    options
  })
  $($el)[widgetName](options)
}
