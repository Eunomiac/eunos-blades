import { BladesSheet } from "./blades-sheet.js";

export class BladesClockSheet extends BladesSheet {
    
        static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "actor", "clock"],
            template: "systems/eunos-blades/templates/actors/clock-sheet.hbs",
            width: 700,
            height: 970
        });
    }
    
        
        getData() {
        var data = super.getData();
        data.editable = this.options.editable;
        const actorData = data.data;
        data.actor = actorData;
        data.data = actorData.data;
        return data;
    }
    
        
        async _updateObject(event, formData) {
        const image_path = `systems/eunos-blades/assets/progressclocks-svg/Progress Clock ${formData["data.type"]}-${formData["data.value"]}.svg`;
        formData.img = image_path;
        formData["token.img"] = image_path;
        const data = [];
        const update = {
            img: image_path,
            width: 1,
            height: 1,
            scale: 1,
            mirrorX: false,
            mirrorY: false,
            tint: "",
            displayName: 50
        };
        
        const tokens = this.actor.getActiveTokens();
        tokens.forEach((token) => {
            data.push(foundry.utils.mergeObject({ _id: token.id }, update));
        });
        await TokenDocument.updateDocuments(data, { parent: game.scenes.current });
        
        return this.object.update(formData);
    }
}