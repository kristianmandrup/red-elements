const { log } = console

function logClass(target: any) {
  // log('logClass', {
  //   target
  // })
  // save a reference to the original constructor
  var original = target;

  // a utility function to generate instances of a class
  function construct(constructor, args) {
    // log('construct', {
    //   constructor,
    //   args
    // })
    var c: any = function () {
      // log('c', {
      //   args
      // })

      return constructor.apply(this, args);
    }
    c.prototype = constructor.prototype;
    return new c();
  }

  // the new constructor behaviour
  var f: any = function (...args) {
    console.log("New: " + original.name);
    return construct(original, args);
  }

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype;

  // return new constructor (will override original)
  return f;
}

@logClass
class Person {

  public name: string;
  public surname: string;

  constructor(name: string, surname: string) {
    this.name = name;
    this.surname = surname;
  }
}

test('delegates', () => {
  const person = new Person("remo", "jansen");
})

