import {
  default as $
} from 'jquery';

export function wrap(component, refName, options = {}) {
  let element = component.$refs[refName]
  if (element) {
    console.log(element)
    $(element)[refName](options)
  } else {
    console.log(`missing element: ${refName}`)
  }
}
