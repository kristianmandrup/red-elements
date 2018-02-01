export function todo(target, key, descriptor) {
  console.log(`TODO: ${target.name}.${key}`)
  return descriptor
}

export {
  autobind
} from 'javascript-decorators'
