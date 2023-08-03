/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

class MixinBuilder {
  constructor(superclass) { this.superclass = superclass }
  with(...mixins) { return mixins.reduce((cls, mixin = (x) => x) => mixin(cls), this.superclass) }
}
const MIX = (superclass) => new MixinBuilder(superclass);

const CloseButton = (superclass) => class extends superclass {
  activateListeners(html) {
      super.activateListeners(html);
      if (this instanceof ActorSheet) {
        console.log(`MIXED ActorSheet.activateListeners(${html})`);
      } else if (this instanceof ItemSheet) {
        console.log(`MIXED ItemSheet.activateListeners(${html})`);
      }
    }
};

const game = {
  Actors: ["ActorA", "ActorB"],
  Items: ["ItemA", "ItemB"]
};

const StaticGetAll = (superclass) => class extends superclass {
  static get All() {
    if (superclass instanceof ActorSheet) {
      return game.Actors;
    } else if (superclass instanceof ItemSheet) {
      return game.Items;
    }
    // return "NO MATCH";
    return {constructor: superclass.constructor, superclass, "THIS": this.constructor, "InstanceOf": (this.constructor instanceof SubActorSheet) || (this.constructor instanceof SubItemSheet), "Equality": (this === ActorSheet || this === ItemSheet)};
  }
}

class ActorSheet {
  activateListeners(html) {
    console.log(`ActorSheet.activateListeners(${html})`);
  }
}

class ItemSheet {
  activateListeners(html) {
    console.log(`ItemSheet.activateListeners(${html})`);
  }
}

class SubActorSheet extends MIX(ActorSheet).with(CloseButton, StaticGetAll) {

}

class SubItemSheet extends MIX(ItemSheet).with(CloseButton, StaticGetAll) {

}

const subActorSheet = new SubActorSheet();
const subItemSheet = new SubItemSheet();

console.log(SubActorSheet.All);
console.log(SubItemSheet.All);
subActorSheet.activateListeners("SubActorSheet");
subItemSheet.activateListeners("SubItemSheet");