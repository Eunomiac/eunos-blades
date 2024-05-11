import BladesClockKey from "./BladesClockKey";


class BladesScene extends Scene {

  async registerClockKey(clockKey: BladesClockKey) {
    await this.update({[`clockKeys.${clockKey.id}`]: true});
  }

  async unregisterClockKey(clockKey: BladesClockKey|IDString) {
    if (typeof clockKey === "string") {
      await this.update({[`clockKeys.-=${clockKey}`]: null});
    } else {
      await this.update({[`clockKeys.-=${clockKey.id}`]: null});
    }
  }
}

interface BladesScene {
  get id(): IDString;
}

export default BladesScene;
