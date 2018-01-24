# Service injection

## Simple service injection

The `@inject` decorator is not required when you use classes. The annotation is not required because the typescript compiler generates the metadata for us. However, this won't happen if you forget one of the following things:

- Import `reflect-metadata`
- Set `emitDecoratorMetadata` to `true` in `tsconfig.json`.

```js
import { Container, injectable, inject } from 'inversify';

@injectable()
class Katana {
    public hit() {
        return "cut!";
    }
}

@injectable()
class Shuriken {
    public throw() {
        return "hit!";
    }
}

@injectable()
class Ninja implements Ninja {

    private _katana: Katana;
    private _shuriken: Shuriken;

    // auto-injetion of Katana and Shuriken instances via inversify
    public constructor(katana: Katana, shuriken: Shuriken) {
        this._katana = katana;
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}

var container = new Container();
container.bind<Ninja>(Ninja).to(Ninja);
container.bind<Katana>(Katana).to(Katana);
container.bind<Shuriken>(Shuriken).to(Shuriken);
```

If the binding feels a bit too repetitive, use the `toSelf` method:

```js
container.bind<Samurai>(Samurai).toSelf();
```

## Symbols vs Classes as identifiers

In very large applications using strings as the identifiers of the types to be injected by the InversifyJS can lead to naming collisions. InversifyJS supports and recommends the usage of Symbols instead of string literals.

### Circular dependencies

```
Error: Missing required @Inject or @multiinject annotation in: argument 0 in class Dom.
```

This happens because, at the point in time in which the *decorator is invoked*, the *class has not been declared* so the decorator is invoked as `@inject(undefined)`. This trigger InversifyJS to think that the annotation was never added.

The solution is to *use symbols* like `Symbol.for("Dom")` as service identifiers *instead of the classes* like `Dom`:

```js
const TYPE = {
    Dom: Symbol.for("Dom"),
    DomUi: Symbol.for("DomUi")
};

@injectable()
class Dom {
    public name: string;
    @lazyInject(TYPE.DomUi) public domUi: DomUi;
    public constructor() {
        this.name = "Dom";
    }
}
```

## Container Options

### defaultScope

The default scope is transient and you can change the scope of a type when declaring a binding:

```js
container.bind<Warrior>(TYPES.Warrior).to(Ninja).inSingletonScope();
container.bind<Warrior>(TYPES.Warrior).to(Ninja).inTransientScope();
```

You can use container options to change the default scope used at application level:

```js
let container = new Container({ defaultScope: "Singleton" });
```

### autoBindInjectable

You can use this to activate automatic binding for @injectable() decorated classes:

```js
let container = new Container({ autoBindInjectable: true });
container.isBound(Ninja);          // returns false
container.get(Ninja);              // returns a Ninja
container.isBound(Ninja);          // returns true
```

`container.get(Ninja)` here does the auto-binding of `Ninja` to the `container`

## Merging containers

```js
Container.merge(a: Container, b: Container)
```

Merges two containers into one:

```js
let chinaExpansionContainer = new Container();
chinaExpansionContainer.bind<Ninja>(CHINA_EXPANSION_TYPES.Ninja).to(Ninja);
chinaExpansionContainer.bind<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken).to(Shuriken);


let japanExpansionContainer = new Container();
japanExpansionContainer.bind<Samurai>(JAPAN_EXPANSION_TYPES.Samurai).to(Samurai);
japanExpansionContainer.bind<Katana>(JAPAN_EXPANSION_TYPES.Katana).to(Katana);

// Full container (merged)
let gameContainer = Container.merge(chinaExpansionContainer, japanExpansionContainer)

expect(gameContainer.get<Ninja>(CHINA_EXPANSION_TYPES.Ninja).name).to.eql("Ninja");
expect(gameContainer.get<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken).name).to.eql("Shuriken");
expect(gameContainer.get<Samurai>(JAPAN_EXPANSION_TYPES.Samurai).name).to.eql("Samurai");
expect(gameContainer.get<Katana>(JAPAN_EXPANSION_TYPES.Katana).name).to.eql("Katana");
```

This is super useful for large applications, where it can be used to partition individual application scopes/domains and then aggregate (merge) them into an app level container.

## Declaring container modules

Container modules can help you to manage the complexity of your bindings in very large applications.

```js
let warriors = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<Ninja>("Ninja").to(Ninja);
});

let weapons = new ContainerModule(
    (
        bind: interfaces.Bind,
        unbind: interfaces.Unbind,
        isBound: interfaces.IsBound,
        rebind: interfaces.Rebind
    ) => {
        bind<Katana>("Katana").to(Katana);
        bind<Shuriken>("Shuriken").to(Shuriken);
    }
);

let container = new Container();

// now we can load/unload a group of bindings
// such as for a particular application level domain/scope
// - weapons
// - warriors

container.load(warriors, weapons);
container.unload(warriors);
```

## Container snapshots

Declaring container snapshots is a feature that helps you to write unit tests with ease.

Application `container` is shared by all unit tests:

```
import container from "../../src/ioc/container";

describe("Ninja", () => {

    beforeEach(() => {

        // create a snapshot so each unit test can modify
        // it without breaking other unit tests
        container.snapshot();

    });

    afterEach(() => {

        // Restore to last snapshot so each unit test
        // takes a clean copy of the application container
        container.restore();

    });

    // each test is executed with a snapshot of the container

    it("Ninja can fight", () => {

        let katanaMock = {
            hit: () => { return "hit with mock"; }
        };

        // unbind specific application service binding: Katana
        container.unbind("Katana");

        // rebind to Mock service (a constant for testing)
        container.bind<Something>("Katana").toConstantValue(katanaMock);

        // get mock via service binding
        let ninja = container.get<Ninja>("Ninja");

        // do tests using mock
        expect(ninja.fight()).eql("hit with mock");
    });

    it("Ninja can sneak", () => {

        let shurikenMock = {
            throw: () => { return "hit with mock"; }
        };

        // unbind specific application service binding: Shuriken
        container.unbind("Shuriken");

        // rebind to Mock service (a constant for testing)
        container.bind<Something>("Shuriken").toConstantValue(shurikenMock);

        // get mock via service binding
        let ninja = container.get<Ninja>("Shuriken");

        // do tests using mock
        expect(ninja.sneak()).eql("hit with mock");
    });

});
```

## Controlling the scope of the dependencies

InversifyJS uses transient scope by default but you can also use singleton and request scope:

```js
container.bind<Shuriken>("Shuriken").to(Shuriken).inTransientScope(); // Default
container.bind<Shuriken>("Shuriken").to(Shuriken).inSingletonScope();
container.bind<Shuriken>("Shuriken").to(Shuriken).inRequestScope();
```

## About inSingletonScope

There are many available kinds of bindings:

```js
interface BindingToSyntax<T> {
    to(constructor: { new (...args: any[]): T; }): BindingInWhenOnSyntax<T>;
    toSelf(): BindingInWhenOnSyntax<T>;
    toConstantValue(value: T): BindingWhenOnSyntax<T>;
    toDynamicValue(func: (context: Context) => T): BindingWhenOnSyntax<T>;
    toConstructor<T2>(constructor: Newable<T2>): BindingWhenOnSyntax<T>;
    toFactory<T2>(factory: FactoryCreator<T2>): BindingWhenOnSyntax<T>;
    toFunction(func: T): BindingWhenOnSyntax<T>;
    toAutoFactory<T2>(serviceIdentifier: ServiceIdentifier<T2>): BindingWhenOnSyntax<T>;
    toProvider<T2>(provider: ProviderCreator<T2>): BindingWhenOnSyntax<T>;
}
```

In terms of how scope behaves we can group these types of bindings in two main groups:

- Bindings that will inject an `object`
- Bindings that will inject a `function`