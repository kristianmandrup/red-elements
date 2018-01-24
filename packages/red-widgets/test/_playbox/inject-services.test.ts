import {
  Container,
  injectable
} from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

const container = new Container()

// TODO: Fix this
// const { lazyInject } = getDecorators(container)

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

container.bind<IGreeting>(HelloService).to(HelloService)

@injectable()
class ByeService {
  constructor() {
  }

  say() {
    return 'bye'
  }
}

container.bind<IGreeting>(ByeService).to(ByeService)

/**
 * Injection of HelloService and ByeService should inject properties:
 * - hello: HelloService
 * - bye: ByeService
 */
class GreetingService {
  @lazyInject(ByeService) ByeService: IGreeting
  @lazyInject(HelloService) HelloService: IGreeting
  // TODO: add injection here or via class decorator similar to Angular
  constructor() {
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
