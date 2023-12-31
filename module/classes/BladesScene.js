class BladesScene extends Scene {
    async registerClockKey(clockKey) {
        this.update({ [`clockKeys.${clockKey.id}`]: true });
    }
    async unregisterClockKey(clockKey) {
        if (typeof clockKey === "string") {
            this.update({ [`clockKeys.-=${clockKey}`]: null });
        }
        else {
            this.update({ [`clockKeys.-=${clockKey.id}`]: null });
        }
    }
}
export default BladesScene;
