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

const TYPES = {
  HelloService: Symbol.for("HelloService")
}


@injectable()
class HelloService implements IGreeting {
  constructor() {
  }

  say() {
    return 'hello'
  }
}

container.bind<IGreeting>(TYPES.HelloService).to(HelloService).inSingletonScope()

/**
 * Injection of HelloService and ByeService should inject properties:
 * - hello: HelloService
 * - bye: ByeService
 */
class GreetingService {
  @lazyInject(TYPES.HelloService) public hello: HelloService
  // TODO: add injection here or via class decorator similar to Angular
  constructor() {
    console.log('GreetingService', {
      service: this,
      hello: this.hello
    })
  }
}

let ctx
beforeEach(() => {
  ctx = new GreetingService()
})

describe('Serviced: injection', () => {
  describe('HelloService', () => {
    test('injects hello: HelloService', () => {
      expect(ctx.hello.constructor).toBe(HelloService)
    })
    test('can say hello', () => {
      expect(ctx.hello.say()).toBe('hello')
    })
  })
})
