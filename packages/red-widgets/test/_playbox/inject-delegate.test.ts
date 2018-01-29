import { inject, injectable, Container, interfaces } from "inversify";
import "reflect-metadata";

type FactoryOfWeapon = (parent: IWeaponHolder) => IWeapon;
type FactoryOfShield = (parent: IShieldHolder) => IShield;

const TYPE = {
  OrphanWeapon: Symbol.for("OrphanWeapon"),
  OrphanShield: Symbol.for("OrphanShield"),

  FactoryOfWeapon: Symbol.for("FactoryOfWeapon"),
  FactoryOfShield: Symbol.for("FactoryOfShield"),

  WeaponHolder: Symbol.for("WeaponHolder"),
  ShieldHolder: Symbol.for("ShieldHolder")
};

interface IHolder {
  name: string;
}

interface IShield {
  parent: IShieldHolder;
}

interface IWeapon {
  parent: IWeaponHolder;
  use(): string;
  owner(): string;
}

interface IShieldHolder extends IHolder {
  name: string;
  shield: IShield;
}

interface IWeaponHolder {
  name: string;
  weapon: IWeapon;
  fight(): string;
}

@injectable()
class Weapon implements IWeapon {
  private readonly _name: string;
  public parent: IWeaponHolder;

  public constructor(name: string) {
    this._name = name;
  }

  public use() {
    return this._name;
  }

  public owner() {
    return `Owned by ${this.parent.name}!`;
  }
}

@injectable()
class Shield implements IShield {
  private readonly _name: string;
  public parent: IShieldHolder;

  public constructor(name: string) {
    this._name = name;
  }

  public use() {
    return this._name;
  }

  public owner() {
    return `Owned by ${this.parent.name}!`;
  }
}


@injectable()
class Character implements IWeaponHolder, IShieldHolder {
  public weapon: IWeapon;
  public shield: IShield;

  public name: string;
  public constructor(
    @inject(TYPE.FactoryOfWeapon) factoryOfWeapon: FactoryOfWeapon,
    @inject(TYPE.FactoryOfShield) factoryOfShield: FactoryOfShield
  ) {
    this.weapon = factoryOfWeapon(this);
    this.shield = factoryOfShield(this);
  }
  public fight() {
    return `Using ${this.weapon.use()}!`;
  }
}

const container = new Container();

// We declare a binding for Weapon so we can use it within the factory
container.bind<IWeapon>(TYPE.OrphanWeapon).to(Weapon);

container.bind<FactoryOfWeapon>(TYPE.FactoryOfWeapon).toFactory<IWeapon>(
  (ctx: interfaces.Context) => {
    return (parent: IWeaponHolder) => {
      const orphanWeapon = ctx.container.get<IWeapon>(TYPE.OrphanWeapon);
      orphanWeapon.parent = parent;
      return orphanWeapon;
    };
  });

container.bind<IShield>(TYPE.OrphanShield).to(Shield);

container.bind<FactoryOfShield>(TYPE.FactoryOfShield).toFactory<IShield>(
  (ctx: interfaces.Context) => {
    return (parent: IShieldHolder) => {
      const orphanShield = ctx.container.get<IShield>(TYPE.OrphanShield);
      orphanShield.parent = parent;
      return orphanShield;
    };
  });

// How can I make this scale to 5 or more child classes (delegates) that can be injected on a parent class??
// Where do I configure the Weapon and Shield being used (injected) !?

container.bind<IWeaponHolder>(TYPE.WeaponHolder).to(Character);
container.bind<IShieldHolder>(TYPE.ShieldHolder).to(Character);

test('Character', () => {
  const character = container.get<IWeaponHolder>(TYPE.WeaponHolder);

  const shieldOwner = character.shield.owner()
  const weaponOwner = character.weapon.owner()

  console.log(shieldOwner);
  console.log(weaponOwner);

  expect(weaponOwner).toBe(character)
  expect(shieldOwner).toBe(character)
})
