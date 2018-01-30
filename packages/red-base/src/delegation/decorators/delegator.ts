function isObject(obj) {
  return obj === Object(obj);
}

function getClassName(containerItemId, map) {
  if (typeof containerItemId === 'string') return containerItemId
  if (isObject(containerItemId)) {
    return containerItemId.constructor.name
  }
  const errMsg = 'Invalid class name in @delegates map. Use a string or class reference'
  console.error(errMsg, {
    id: containerItemId,
    map
  })
  throw new Error(errMsg)
}


export function delegator(config: any) {
  const {
    container,
    map
  } = config

  return (target: Object) => {
    // implement class decorator here, the class decorator
    // will have access to the decorator arguments (filter)
    // because they are  stored in a closure


    // save a reference to the original constructor
    var original: any = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {
      var c: any = function () {
        return constructor.apply(this, args);
      }
      c.prototype = constructor.prototype;
      return new c();
    }

    // the new constructor behaviour
    var f: any = function (...args) {
      const constructed = construct(original, args);

      Object.keys(map).map(key => {
        const containerItemId = map[key]
        const clazzName = getClassName(containerItemId, map)
        const clazz = container.resolve(clazzName)
        constructed[key] = new clazz(constructed)
      })
      return constructed
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor (will override original)
    return f;
  }
}
