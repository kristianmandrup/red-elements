import {
  default as $
} from 'jquery';

// used to turn a DOM element (ie. custom element root elem) into a jQuery widget
export function createjQueryWidget(rootElem, owidgetName, ptions = {}) {
  // get the element by refName, such as by class
  if (rootElem) {
    console.log(rootElem)
    $(rootElem)[widgetName](options)
  } else {
    console.log(`missing element: ${refName}`)
  }
}
