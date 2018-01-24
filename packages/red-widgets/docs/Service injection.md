# Service injection

Service injection uses [InversifyJS](http://inversify.io/), a super advanced DI system.

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

```js
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

The `inTransientScope` is used by default and we can select the scope of this types of binding, except for `toConstantValue` which will always use `inSingletonScope`.

When we invoke container.get for the first time and we are using to, `toSelf` or `toDynamicValue` the InversifyJS container will try to generate an object instance or value using a constructor or the dynamic value factory.

If the scope has been set to `inSingletonScope` the *value is cached*. The second time we invoke container.get for the same resource ID, and if `inSingletonScope` has been selected, InversifyJS will *try to get the value from the cache*.

## Bindings that will inject a function

In this group are included the following types of binding:

```js
interface BindingToSyntax<T> {
    toConstructor<T2>(constructor: Newable<T2>): BindingWhenOnSyntax<T>;
    toFactory<T2>(factory: FactoryCreator<T2>): BindingWhenOnSyntax<T>;
    toFunction(func: T): BindingWhenOnSyntax<T>;
    toAutoFactory<T2>(serviceIdentifier: ServiceIdentifier<T2>): BindingWhenOnSyntax<T>;
    toProvider<T2>(provider: ProviderCreator<T2>): BindingWhenOnSyntax<T>;
}
```

We cannot select the scope of this types of binding because the value to be injected (a factory function) is always a *singleton*.

However, the factory internal implementation may or may not return a singleton.

For example, the following binding will inject a factory which will always be a singleton.

```js
container.bind<interfaces.Factory<Katana>>("Factory<Katana>").toAutoFactory<Katana>("Katana");
However, the value returned by the factory may or not be a singleton:

container.bind<Katana>("Katana").to(Katana).inTransientScope();
// or
container.bind<Katana>("Katana").to(Katana).inSingletonScope();
```

## Optional dependencies

```js
@injectable()
class Ninja {
    public name: string;
    public katana: Katana;
    public shuriken: Shuriken;
    public constructor(
        @inject("Katana") katana: Katana,
        @inject("Shuriken") @optional() shuriken: Shuriken // Optional!
    ) {
        this.name = "Ninja";
        this.katana = katana;
        this.shuriken = shuriken;
    }
}

// ...
expect(ninja.shuriken).to.eql(undefined);

container.bind<Shuriken>("Shuriken").to(Shuriken);
expect(ninja.shuriken.name).to.eql("Shuriken");
```

the first time we resolve `Ninja`, its property `shuriken` is `undefined` because no bindings have been declared for Shuriken and the property is annotated with the `@optional()` decorator.

After declaring a binding for Shuriken:

`container.bind<Shuriken>("Shuriken").to(Shuriken);`

All the resolved instances of `Ninja` will contain an instance of `Shuriken`.

Default values
If a dependency is decorated with the @optional() decorator, we will be able to to declare a default value just like you can do in any other TypeScript application:

```js
@injectable()
class Ninja {
    public name: string;
    public katana: Katana;
    public shuriken: Shuriken;
    public constructor(
        @inject("Katana") katana: Katana,
        @inject("Shuriken") @optional() shuriken: Shuriken = { name: "DefaultShuriken" } // Default value!
    ) {
        this.name = "Ninja";
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

## Injecting a constant or dynamic value

Binds an abstraction to a constant value:

```js
container.bind<Katana>("Katana").toConstantValue(new Katana());
```

Binds an abstraction to a dynamic value:

```js
container.bind<Katana>("Katana").toDynamicValue((context: interfaces.Context) => { return new Katana(); });
```

## Injecting a Factory

Binds an abstraction to a user defined Factory.

```js
@injectable()
class Ninja implements Ninja {

    private _katana: Katana;
    private _shuriken: Shuriken;

    public constructor(
	    @inject("Factory<Katana>") katanaFactory: () => Katana,
	    @inject("Shuriken") shuriken: Shuriken
    ) {
        this._katana = katanaFactory();
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}
container.bind<interfaces.Factory<Katana>>("Factory<Katana>").toFactory<Katana>((context: interfaces.Context) => {
    return () => {
        return context.container.get<Katana>("Katana");
    };
});
```

You can also define a Factory with args:

```js
container.bind<interfaces.Factory<Weapon>>("Factory<Weapon>").toFactory<Weapon>((context: interfaces.Context) => {
    return (throwable: boolean) => {
        if (throwable) {
            return context.container.getTagged<Weapon>("Weapon", "throwable", true);
        } else {
            return context.container.getTagged<Weapon>("Weapon", "throwable", false);
        }
    };
});
```

Sometimes you might need to pass arguments to a factory in different moments during the execution:

```js
container.bind<Engine>("Engine").to(PetrolEngine).whenTargetNamed("petrol");
container.bind<Engine>("Engine").to(DieselEngine).whenTargetNamed("diesel");

container.bind<interfaces.Factory<Engine>>("Factory<Engine>").toFactory<Engine>((context) => {
    return (named: string) => (displacement: number) => {
        let engine = context.container.getNamed<Engine>("Engine", named);
        engine.displacement = displacement;
        return engine;
    };
});

@injectable()
class DieselCarFactory implements CarFactory {
    private _dieselFactory: (displacement: number) => Engine ;
    constructor(
        @inject("Factory<Engine>") factory: (category: string) => (displacement: number) => Engine // Injecting an engine factory
    ) {
        this._dieselFactory = factory("diesel"); // Creating a diesel engine facotry
    }
    public createEngine(displacement: number): Engine {
        return this._dieselFactory(displacement); // Creating a concrete diesel engine
    }
}
```

## Delegation class factory example

We need to try this or a similar approach for delegation classes.

```js
container.bind<interfaces.Factory<Weapon>>("Factory<Weapon>").toFactory<Weapon>((context: interfaces.Context) => {
    return (parent: any) => {
        // pass parent as argument to service retrieved
        const weapon = context.container.get<Weapon>("Weapon");
        // set parent on weapon
        weapon.parent = parent
        // return weapon with parent
        return weapon
    };
});
```

## Multi-injection

We can use multi-injection When two or more concretions have been bound to the an abstraction. Notice how an array of `Weapon` is injected into the `Ninja` class via its constructor thanks to the usage of the `@multiInject` decorator:

```js
@injectable()
class Ninja implements Ninja {
    public katana: Weapon;
    public shuriken: Weapon;
    public constructor(
	    @multiInject("Weapon") weapons: Weapon[]
    ) {
        this.katana = weapons[0];
        this.shuriken = weapons[1];
    }
}
```

We are binding Katana and Shuriken to Weapon:

```js
container.bind<Ninja>("Ninja").to(Ninja);
container.bind<Weapon>("Weapon").to(Katana);
container.bind<Weapon>("Weapon").to(Shuriken);
```

Another example:

```js
@injectable()
class Foo {
    public bar: Bar[];
    constructor(@multiInject(Bar) args: Bar[]) {
        this.bar = args;
    }
}
```

## Auto factory

Binds an abstraction to an auto-generated Factory.

```js
@injectable()
class Ninja implements Ninja {

    private _katana: Katana;
    private _shuriken: Shuriken;

    public constructor(
	    @inject("Factory<Katana>") katanaFactory: interfaces.Factory<Katana>,
	    @inject("Shuriken") shuriken: Shuriken
    ) {
        this._katana = katanaFactory();
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}
container.bind<Katana>("Katana").to(Katana);

container.bind<interfaces.Factory<Katana>>("Factory<Katana>")
    .toAutoFactory<Katana>("Katana");
```

## Injecting a Provider (asynchronous Factory)

Binds an abstraction to a Provider. A provider is an asynchronous factory, this is useful when dealing with asynchronous I/O operations.

```js
type KatanaProvider = () => Promise<Katana>;

@injectable()
class Ninja implements Ninja {

    public katana: Katana;
    public shuriken: Shuriken;
    public katanaProvider: KatanaProvider;

    public constructor(
	    @inject("KatanaProvider") katanaProvider: KatanaProvider,
	    @inject("Shuriken") shuriken: Shuriken
    ) {
        this.katanaProvider = katanaProvider;
        this.katana= null;
        this.shuriken = shuriken;
    }
    // ...
}

container.bind<KatanaProvider>("KatanaProvider").toProvider<Katana>((context) => {
    return () => {
        return new Promise<Katana>((resolve) => {
            let katana = context.container.get<Katana>("Katana");
            resolve(katana);
        });
    };
});

var ninja = container.get<Ninja>("Ninja");

ninja.katanaProvider()
     .then((katana) => { ninja.katana = katana; })
     .catch((e) => { console.log(e); });
```

## Provider custom arguments

The `toProvider` binding expects a `ProviderCreator` as its only argument:

```js
interface ProviderCreator<T> extends Function {
    (context: Context): Provider<T>;
}
```

The signature of a `provider` look as follows:

```js
interface Provider<T> extends Function {
    (...args: any[]): (((...args: any[]) => Promise<T>) | Promise<T>);
}
```

These type signatures allow as to pass custom arguments to a provider:

```js
let container = new Container();

interface Sword {
    material: string;
    damage: number;
}

@injectable()
class Katana implements Sword {
    public material: string;
    public damage: number;
}

type SwordProvider = (material: string, damage: number) => Promise<Sword>;

container.bind<Sword>("Sword").to(Katana);

container.bind<SwordProvider>("SwordProvider").toProvider<Sword>((context) => {
    return (material: string, damage: number) => { // Custom args!
        return new Promise<Sword>((resolve) => {
            setTimeout(() => {
                let katana = context.container.get<Sword>("Sword");
                katana.material = material;
                katana.damage = damage;
                resolve(katana);
            }, 10);
        });
    };
});

let katanaProvider = container.get<SwordProvider>("SwordProvider");

katanaProvider("gold", 100).then((powerfulGoldKatana) => { // Apply all custom args
    expect(powerfulGoldKatana.material).to.eql("gold");
    expect(powerfulGoldKatana.damage).to.eql(100);
});

katanaProvider("gold", 10).then((notSoPowerfulGoldKatana) => {
    expect(notSoPowerfulGoldKatana.material).to.eql("gold");
    expect(notSoPowerfulGoldKatana.damage).to.eql(10);
});
```

## Provider partial application

We can also pass the arguments using partial application:

```js
let container = new Container();

interface Sword {
    material: string;
    damage: number;
}

@injectable()
class Katana implements Sword {
    public material: string;
    public damage: number;
}

type SwordProvider = (material: string) => (damage: number) => Promise<Sword>;

container.bind<Sword>("Sword").to(Katana);

container.bind<SwordProvider>("SwordProvider").toProvider<Sword>((context) => {
    return (material: string) => {  // Custom arg 1!
        return (damage: number) => { // Custom arg 2!
            return new Promise<Sword>((resolve) => {
                setTimeout(() => {
                    let katana = context.container.get<Sword>("Sword");
                    katana.material = material;
                    katana.damage = damage;
                    resolve(katana);
                }, 10);
            });
        };
    };
});

let katanaProvider = container.get<SwordProvider>("SwordProvider");

// Apply the first custom arg!
let goldKatanaProvider = katanaProvider("gold");

goldKatanaProvider(100).then((powerfulGoldKatana) => {
    // Apply the second custom args!
    expect(powerfulGoldKatana.material).to.eql("gold");
    expect(powerfulGoldKatana.damage).to.eql(100);
});

goldKatanaProvider(10).then((notSoPowerfulGoldKatana) => {
    expect(notSoPowerfulGoldKatana.material).to.eql("gold");
    expect(notSoPowerfulGoldKatana.damage).to.eql(10);
});
```

## Provider defaults

The following function can be used as a helper to provide a default value when a provider is rejected:

```js
function valueOrDefault<T>(provider: () => Promise<T>, defaultValue: T) {
    return new Promise<T>((resolve, reject) => {
        provider().then((value) => {
            resolve(value);
        }).catch(() => {
            resolve(defaultValue);
        });
    });
}
```

The following example showcases how to apply the `valueOrDefault` helper:

```js
@injectable()
class Ninja {
    public level: number;
    public rank: string;
    public constructor() {
        this.level = 0;
        this.rank = "Ninja";
    }
    public train(): Promise<number> {
        return new Promise<number>((resolve) => {
            setTimeout(() => {
                this.level += 10;
                resolve(this.level);
            }, 100);
        });
    }
}

@injectable()
class NinjaMaster {
    public rank: string;
    public constructor() {
        this.rank = "NinjaMaster";
    }
}

type NinjaMasterProvider = () => Promise<NinjaMaster>;

let container = new Container();

container.bind<Ninja>("Ninja").to(Ninja).inSingletonScope();
container.bind<NinjaMasterProvider>("NinjaMasterProvider").toProvider((context) => {
    return () => {
        return new Promise<NinjaMaster>((resolve, reject) => {
            let ninja = context.container.get<Ninja>("Ninja");
            ninja.train().then((level) => {
                if (level >= 20) {
                    resolve(new NinjaMaster());
                } else {
                    reject("Not enough training");
                }
            });
        });
    };
});

let ninjaMasterProvider = container.get<NinjaMasterProvider>("NinjaMasterProvider");

valueOrDefault(ninjaMasterProvider, { rank: "DefaultNinjaMaster" }).then((ninjaMaster) => {
    // Using default here because the provider was rejected (the ninja has a level below 20)
    expect(ninjaMaster.rank).to.eql("DefaultNinjaMaster");
});

valueOrDefault(ninjaMasterProvider, { rank: "DefaultNinjaMaster" }).then((ninjaMaster) => {
    // A NinjaMaster was provided because the the ninja has a level above 20
    expect(ninjaMaster.rank).to.eql("NinjaMaster");
    done();
});
```

## Tagged bindings

We can use tagged bindings to fix `AMBIGUOUS_MATCH` errors when two or more concretions have been bound to the an abstraction.

Notice how the constructor arguments of the Ninja class have been annotated using the `@tagged` decorator:

```js
interface Weapon {}

@injectable()
class Katana implements Weapon {}

@injectable()
class Shuriken implements Weapon {}

interface Ninja {
    katana: Weapon;
    shuriken: Weapon;
}

@injectable()
class Ninja implements Ninja {
    public katana: Weapon;
    public shuriken: Weapon;
    public constructor(
        @inject("Weapon") @tagged("canThrow", false) katana: Weapon,
        @inject("Weapon") @tagged("canThrow", true) shuriken: Weapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

We are binding `Katana` and `Shuriken` to `Weapon` but a `whenTargetTagged` constraint is added to avoid `AMBIGUOUS_MATCH` errors:

```js
container.bind<Ninja>(ninjaId).to(Ninja);
container.bind<Weapon>(weaponId).to(Katana).whenTargetTagged("canThrow", false);
container.bind<Weapon>(weaponId).to(Shuriken).whenTargetTagged("canThrow", true);
```

PS: Not sure how the references such as `ninjaId` are supposed to work and what they reference??

## Create your own tag decorators

Creating your own decorators is really simple:

```js
let throwable = tagged("canThrow", true);
let notThrowable = tagged("canThrow", false);

@injectable()
class Ninja implements Ninja {
    public katana: Weapon;
    public shuriken: Weapon;
    public constructor(
        @inject("Weapon") @notThrowable katana: Weapon,
        @inject("Weapon") @throwable shuriken: Weapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

## Named bindings

We can use named bindings to fix `AMBIGUOUS_MATCH` errors when two or more concretions have been bound to the an abstraction. Notice how the constructor arguments of the Ninja class have been annotated using the @named decorator:

```js
interface Weapon {}

@injectable()
class Katana implements Weapon {}

@injectable()
class Shuriken implements Weapon {}

interface Ninja {
    katana: Weapon;
    shuriken: Weapon;
}

@injectable()
class Ninja implements Ninja {
    public katana: Weapon;
    public shuriken: Weapon;
    public constructor(
        @inject("Weapon") @named("strong")katana: Weapon,
        @inject("Weapon") @named("weak") shuriken: Weapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

We are binding Katana and Shuriken to Weapon but a whenTargetNamed constraint is added to avoid AMBIGUOUS_MATCH errors:

```js
container.bind<Ninja>("Ninja").to(Ninja);
container.bind<Weapon>("Weapon").to(Katana).whenTargetNamed("strong");
container.bind<Weapon>("Weapon").to(Shuriken).whenTargetNamed("weak");
```

The problem with this solution is that we will have to annotate using the `@named("strong")/@named("weak")` or `@tagged("strong", true)/@tagged("strong", false)` every single injection.

A better solution is to use a default target:

```js
container.bind<Weapon>(TYPES.Weapon).to(Shuriken).whenTargetNamed(TAG.throwable);
container.bind<Weapon>(TYPES.Weapon).to(Katana).whenTargetIsDefault();
```

We can use the whenTargetIsDefault to indicate which binding should be used as default to resolve an `AMBIGUOUS_MATCH` exception when no `@named` or `@tagged` annotations are available.

```js
let TYPES = {
    Weapon: "Weapon"
};

let TAG = {
    throwable: "throwable"
};

interface Weapon {
    name: string;
}

@injectable()
class Katana implements Weapon {
    public name: string;
    public constructor() {
        this.name = "Katana";
    }
}

@injectable()
class Shuriken implements Weapon {
    public name: string;
    public constructor() {
        this.name = "Shuriken";
    }
}

let container = new Container();
container.bind<Weapon>(TYPES.Weapon).to(Shuriken).whenTargetNamed(TAG.throwable);
container.bind<Weapon>(TYPES.Weapon).to(Katana).whenTargetIsDefault();

let defaultWeapon = container.get<Weapon>(TYPES.Weapon);
let throwableWeapon = container.getNamed<Weapon>(TYPES.Weapon, TAG.throwable);

expect(defaultWeapon.name).eql("Katana");
expect(throwableWeapon.name).eql("Shuriken");
```

## Support for hierarchical DI systems

Some applications use a hierarchical dependency injection (DI) system. For example, Angular 2.0 applications use its own hierarchical DI system.

In a hierarchical DI system, a container can have a parent container and multiple containers can be used in one application. The containers form a hierarchical structure.

When a container at the bottom of the hierarchical structure requests a dependency, the container tries to satisfy that dependency with it's own bindings. If the container lacks bindings, it passes the request up to its parent container.

If that container can't satisfy the request, it passes it along to its parent container. The requests keep bubbling up until we find an container that can handle the request or run out of container ancestors.

This can be achieved by adding a `parent` property to a container, pointing to the `parent` container to use when bubbling up.

```js
let weaponIdentifier = "Weapon";

@injectable()
class Katana {}

let parentContainer = new Container();
parentContainer.bind(weaponIdentifier).to(Katana);

let childContainer = new Container();
childContainer.parent = parentContainer;

expect(childContainer.get(weaponIdentifier)).to.be.instanceOf(Katana); // true
```

## Contextual bindings & @targetName

The `@targetName` decorator is used to access the names of the constructor arguments from a contextual constraint even when the code is compressed. The `constructor(katana, shuriken) { ... becomes constructor(a, b) { ...` after compression but thanks to `@targetName` we can still refer to the design-time names `katana` and `shuriken` at runtime.

```js
interface Weapon {}

@injectable()
class Katana implements Weapon {}

@injectable()
class Shuriken implements Weapon {}

interface Ninja {
    katana: Weapon;
    shuriken: Weapon;
}

@injectable()
class Ninja implements Ninja {
    public katana: Weapon;
    public shuriken: Weapon;
    public constructor(
        @inject("Weapon") @targetName("katana") katana: Weapon,
        @inject("Weapon") @targetName("shuriken") shuriken: Weapon
    ) {
        this.katana = katana;
        this.shuriken = shuriken;
    }
}
```

We are binding `Katana` and `Shuriken` to `Weapon` but a custom when constraint is added to avoid `AMBIGUOUS_MATCH` errors:

```js
container.bind<Ninja>(ninjaId).to(Ninja);

container.bind<Weapon>("Weapon").to(Katana).when((request: interfaces.Request) => {
    return request.target.name.equals("katana");
});

container.bind<Weapon>("Weapon").to(Shuriken).when((request: interfaces.Request) => {
    return request.target.name.equals("shuriken");
});
```

The target fields implement the `IQueryableString` interface to help you to create your custom constraints:

```js
interface QueryableString {
	 startsWith(searchString: string): boolean;
	 endsWith(searchString: string): boolean;
	 contains(searchString: string): boolean;
	 equals(compareString: string): boolean;
	 value(): string;
}
```

We have included some helpers to facilitate the creation of custom constraints:

```js
import { Container, traverseAncerstors, taggedConstraint, namedConstraint, typeConstraint } from "inversify";

let whenParentNamedCanThrowConstraint = (request: interfaces.Request) => {
    return namedConstraint("canThrow")(request.parentRequest);
};

let whenAnyAncestorIsConstraint = (request: interfaces.Request) => {
    return traverseAncerstors(request, typeConstraint(Ninja));
};

let whenAnyAncestorTaggedConstraint = (request: interfaces.Request) => {
    return traverseAncerstors(request, taggedConstraint("canThrow")(true));
};
```

The InversifyJS fluent syntax for bindings includes some already implemented common contextual constraints:

```js
interface BindingWhenSyntax<T> {
    when(constraint: (request: interfaces.Request) => boolean): interfaces.BindingOnSyntax<T>;
    whenTargetNamed(name: string): interfaces.BindingOnSyntax<T>;
    whenTargetTagged(tag: string, value: any): interfaces.BindingOnSyntax<T>;
    whenInjectedInto(parent: (Function|string)): interfaces.BindingOnSyntax<T>;
    whenParentNamed(name: string): interfaces.BindingOnSyntax<T>;
    whenParentTagged(tag: string, value: any): interfaces.BindingOnSyntax<T>;
    whenAnyAncestorIs(ancestor: (Function|string)): interfaces.BindingOnSyntax<T>;
    whenNoAncestorIs(ancestor: (Function|string)): interfaces.BindingOnSyntax<T>;
    whenAnyAncestorNamed(name: string): interfaces.BindingOnSyntax<T>;
    whenAnyAncestorTagged(tag: string, value: any): interfaces.BindingOnSyntax<T>;
    whenNoAncestorNamed(name: string): interfaces.BindingOnSyntax<T>;
    whenNoAncestorTagged(tag: string, value: any): interfaces.BindingOnSyntax<T>;
    whenAnyAncestorMatches(constraint: (request: interfaces.Request) => boolean): interfaces.BindingOnSyntax<T>;
    whenNoAncestorMatches(constraint: (request: interfaces.Request) => boolean): interfaces.BindingOnSyntax<T>;
}
```