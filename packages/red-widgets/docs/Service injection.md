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

## Classes as identifiers and circular dependencies

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