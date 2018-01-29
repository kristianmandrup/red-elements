const { log } = console

import classDecorator from '@darkobits/class-decorator';

function addSuperpowers(...powers) {
  return classDecorator({
    onConstruct() {
      powers.forEach(power => {
        this[power] = true;
      });
    },
    prototype: {
      hasSuperpower(power) {
        return this[power];
      }
    }
  });
}

@addSuperpowers('strength', 'speed', 'flight')
class Person {
  name: string
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

test('superpowers', () => {
  const bob = new Person('Bob');
  expect(bob.strength).toBeTruthy()
})
