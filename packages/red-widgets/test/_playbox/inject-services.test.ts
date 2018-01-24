import {
  Container,
  injectable
} from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

const container = new Container()

// TODO: Fix this
const { lazyInject } = getDecorators(container)

interface IGreeting {
  say(): string
}

@injectable()
class HelloService {
  constructor() {
  }

  say() {
    return 'hello'
  }
}

@injectable()
class ByeService {
  constructor() {
  }

  say() {
    return 'bye'
  }
}

const TYPES = {
  HelloService: Symbol.for("HelloService"),
  ByeService: Symbol.for("ByeService")
}

container.bind<IGreeting>(TYPES.HelloService).to(HelloService).inSingletonScope()
container.bind<IGreeting>(TYPES.ByeService).to(ByeService).inSingletonScope()

/**
 * Injection of HelloService and ByeService should inject properties:
 * - hello: HelloService
 * - bye: ByeService
 */
class GreetingService {
  @lazyInject(TYPES.ByeService) public bye: ByeService
  @lazyInject(TYPES.HelloService) public hello: HelloService
  // TODO: add injection here or via class decorator similar to Angular
  constructor() {
    console.log('GreetingService', {
      service: this,
      bye: this.bye,
      hello: this.hello
    })
  }
}

let ctx
beforeEach(() => {
  ctx = new GreetingService()
})

describe('Serviced: injection', () => {
  describe('ByeService', () => {

    test('injects bye: ByeService', () => {
      expect(ctx.bye).toBeDefined()
    })

    test('can say hello', () => {
      expect(ctx.bye.say()).toBe('bye')
    })
  })


  describe('HelloService', () => {
    test('injects hello: HelloService', () => {
      expect(ctx.hello.constructor).toBe(HelloService)
    })
    test('can say hello', () => {
      expect(ctx.hello.say()).toBe('hello')
    })
  })
})
