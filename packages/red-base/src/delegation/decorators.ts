export function delegate(config: any) {
  const {
    container,
    scope,
    key
  } = config

  return (target: Object) => {
    container.getScopedOrDefault(scope).set(key, target)
  }
}

export function delegates(config: any) {
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
        const clazzName = map[key]

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
