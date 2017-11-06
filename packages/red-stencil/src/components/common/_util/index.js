import {
  default as $
} from 'jquery';

// used to turn a DOM element (ie. custom element root elem) into a jQuery widget
export function createjQueryWidget(rootElem, options = {}) {
  // get the element by refName, such as by class
  if (rootElem) {
    console.log(rootElem)
    $(rootElem)[refName](options)
  } else {
    console.log(`missing element: ${refName}`)
  }
}
