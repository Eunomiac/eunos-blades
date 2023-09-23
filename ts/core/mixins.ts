import {Playbook, BladesItemType} from "./constants.js";
import BladesActor from "../blades-actor.js";
import BladesItem from "../blades-item.js";

// type Constructor = new (...args: readonly any[]) => {};

// type ConstructorOf<T extends BladesActor|BladesItem> = new (...args: readonly any[]) => T;

// type ApplyMixin<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>, MixinClass extends ConstructorOf<T>> = Superclass & MixinClass;
// type MixinType<T extends BladesActor|BladesItem, MixinClass extends ConstructorOf<T>> = <Superclass extends ConstructorOf<T>>(superclass: Superclass) => ApplyMixin<T, Superclass, MixinClass>;

// class MixinBuilder<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>> {
//   superclass: Superclass;

//   constructor(superclass: Superclass) { this.superclass = superclass }
//   with<Mixins extends ReadonlyArray<MixinType<T, any>>>(...mixins: Mixins): ApplyMixins<T, Superclass, Mixins> {
//     return mixins.reduce(
//       (cls, mixin = (x) => x) => mixin(cls),
//       this.superclass
//     ) as ApplyMixins<T, Superclass, Mixins>;
//   }
// }

// type ApplyMixins<
//   T extends BladesActor|BladesItem,
//   Superclass extends ConstructorOf<T>,
//   Mixins extends ReadonlyArray<MixinType<T, any>>
// > = Mixins extends [infer Mixin extends MixinType<T, any>, ...infer Rest extends ReadonlyArray<MixinType<T, any>>] ?
//   ApplyMixins<T, CalculateMixin<T, Superclass, Mixin>, Rest> :
//   Superclass;

// type CalculateMixin<
//   T extends BladesActor|BladesItem,
//   Superclass extends ConstructorOf<T>,
//   Mixin extends MixinType<T, any>
// > = (Mixin extends (superclass: Superclass) => (infer MixinClass extends ConstructorOf<T>) ? ApplyMixin<T, Superclass, MixinClass> : never)

// const MIX = <T extends BladesActor|BladesItem>(superclass: ConstructorOf<T>) => new MixinBuilder<T, ConstructorOf<T>>(superclass);

type ConstructorOf<T extends BladesActor|BladesItem> = new (...args: readonly any[]) => T;

type ApplyMixin<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>, MixinClass extends ConstructorOf<T>> = Superclass & MixinClass;
type MixinType<T extends BladesActor|BladesItem, MixinClass extends ConstructorOf<T>> = <Superclass extends ConstructorOf<T>>(superclass: Superclass) => ApplyMixin<T, Superclass, MixinClass>;

class MixinBuilder<T extends BladesActor|BladesItem, Superclass extends ConstructorOf<T>> {
  superclass: Superclass;

  constructor(superclass: Superclass) { this.superclass = superclass }
  with<Mixins extends ReadonlyArray<MixinType<T, any>>>(...mixins: Mixins): ApplyMixins<T, Superclass, Mixins> {
    return mixins.reduce(
      (cls, mixin = (x) => x) => mixin(cls),
      this.superclass
    ) as ApplyMixins<T, Superclass, Mixins>;
  }
}

type ApplyMixins<
  T extends BladesActor|BladesItem,
  Superclass extends ConstructorOf<T>,
  Mixins extends ReadonlyArray<MixinType<T, any>>
> = Mixins extends [infer Mixin extends MixinType<T, any>, ...infer Rest extends ReadonlyArray<MixinType<T, any>>] ?
  ApplyMixins<T, CalculateMixin<T, Superclass, Mixin>, Rest> :
  Superclass;

type CalculateMixin<
  T extends BladesActor|BladesItem,
  Superclass extends ConstructorOf<T>,
  Mixin extends MixinType<T, any>
> = (Mixin extends (superclass: Superclass) => (infer MixinClass extends ConstructorOf<T>) ? ApplyMixin<T, Superclass, MixinClass> : never)

const MIX = <T extends BladesActor|BladesItem>(superclass: ConstructorOf<T>) => new MixinBuilder<T, ConstructorOf<T>>(superclass);

export const HasPlaybook = (superclass: ConstructorOf<BladesActor>) => class extends superclass {

  get playbookName() {
    return this.playbook?.name as (BladesTag & Playbook) | undefined;
  }
  get playbook(): BladesItemOfType<BladesItemType.crew_playbook|BladesItemType.playbook>|undefined {
    return this.activeSubItems.find((item): item is BladesItemOfType<BladesItemType.crew_playbook|BladesItemType.playbook> => BladesItem.IsType(item, BladesItemType.playbook, BladesItemType.crew_playbook));
  }

};


export default MIX;