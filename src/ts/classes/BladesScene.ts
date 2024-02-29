import BladesClockKey from "./BladesClockKey";


class BladesScene extends Scene {

  async registerClockKey(clockKey: BladesClockKey) {
    this.update({[`clockKeys.${clockKey.id}`]: true});
  }

  async unregisterClockKey(clockKey: BladesClockKey|IDString) {
    if (typeof clockKey === "string") {
      this.update({[`clockKeys.-=${clockKey}`]: null});
    } else {
      this.update({[`clockKeys.-=${clockKey.id}`]: null});
    }
  }
}

export default BladesScene;
