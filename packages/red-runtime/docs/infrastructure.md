# Infrastructure

In the `/src/_infra` folder:

- configures fakes such as the fake injectable `RED` object currently used for testing
- configures and exports constants from `inversify` dependency injection library

## RED

Currently `RED` is configured as a fake/mock object that is injectable via a decorator.

Fake `RED` injectable (see `src/_infra/fakes`)

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

```ts
class Search extends Context {
  // injects RED service as an instance variable on class
  constructor() {
    super()
  }
}
```

We need to use a real/live `RED` object for testing, not the fake currently used!
See the `src/red` folder of `red-widgets`

We might then have to move the real `RED` injectable from `red-widgets` to `red-runtime` if it is being used there.

### Faking RED context

The Fake `RED` global context object is configured in `src/_setup/setup.ts`

```ts
@injectable()
export class RED implements IRED {
  public palette: any
  public stack: any
  public comms: any

  // ...
}
```

We plan to soon replace the `RED` global object with service injection of individual services on a "per need" basis.
