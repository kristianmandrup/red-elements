// const { log } = console

interface IConfiguration {

}

class MyConfiguration implements IConfiguration {
  constructor(parent: any) {
    console.log('MyConfiguration', {
      parent
    })
  }
}

interface IExecuter {

}

class MyExecuter implements IExecuter {
  constructor(parent: any) {
    console.log('MyExecuter', {
      parent
    })
  }
}


@delegates({
  configuration: MyConfiguration,
  executer: MyExecuter,
})
class MyPerson {
  public name: string;
  configuration: IConfiguration
  executer: IExecuter

  constructor(name: string = 'kristian') {
    console.log('MyPerson', {
      name
    })
  }
}

function delegates(delegates: Object) {
  // log('delegates', {
  //   delegates
  // })

  return (target: Object) => {
    // log('logClass', {
    //   target
    // })

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
      Object.keys(delegates).map(key => {
        const clazz = delegates[key]
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

test('delegates', () => {
  const person = new MyPerson('mike')

  expect(person.configuration.constructor).toBe(MyConfiguration)
  expect(person.executer.constructor).toBe(MyExecuter)
})
