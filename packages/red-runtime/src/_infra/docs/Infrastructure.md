# Infrastructure

We are currently using the `inversify` library for injection via a decorator

Fake `RED` injectable:

```ts
export let TYPES = { RED: 'IRED' };
export interface IRED {
  // ...
}

@injectable()
export class RED implements IRED {
  // ...
}

container.bind<IRED>(TYPES.RED).to(RED);
export { container }
```

Any class that subclasses `Context` will have `TYPES.RED` lazily injected on creation
via the `@lazyInject` decorator.

```ts
export class Context {
  @lazyInject(TYPES.RED) RED: IRED;
```