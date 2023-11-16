import U from "../../core/utilities.js";
import { BladesActorType, BladesPhase, Tag, Randomizers } from "../../core/constants.js";
import BladesItemSheet from "./BladesItemSheet.js";
/*~ @@DOUBLE-BLANK@@ ~*/
import { BladesActor } from "../../documents/BladesActorProxy.js";
import { BladesScore } from "../../documents/BladesItemProxy.js";
import BladesRoll, { BladesRollOpposition } from "../../BladesRoll.js";
/*~ @@DOUBLE-BLANK@@ ~*/
/* #region BladesTipGenerator */
/*~ @@DOUBLE-BLANK@@ ~*/
// eslint-disable-next-line no-shadow
export var BladesTipContext;
(function (BladesTipContext) {
    BladesTipContext["DiceRoll"] = "DiceRoll";
    BladesTipContext["Combat"] = "Combat";
    BladesTipContext["General"] = "General";
})(BladesTipContext || (BladesTipContext = {}));
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesTipGenerator {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get Tips() {
        return {
            [BladesTipContext.DiceRoll]: [],
            [BladesTipContext.Combat]: [
                "Every combat encounter should advance the main plot, or else it's filler.",
                "Inject dialogue into combat encounters, especially from important adversaries.",
                "Combat encounters should be a challenge, but not a slog. Don't be afraid to end them early.",
                "Infiltrate/Rescue/Destroy: Use these as additional/secondary goals in combat encounters.",
                "Tell the next player in the initiative order that they're on deck.",
                "Don't trigger combats automatically: Use alternate objectives to incite the players to fight, giving them agency.",
                "Add another layer by drawing focus to collateral effects of the combat: a fire, a hostage, a collapsing building, innocents in danger"
            ],
            [BladesTipContext.General]: [
                "Rolling the dice always means SOMETHING happens.",
                "Jump straight to the action; don't waste time on establishing scenes or filler.",
                "Invoke elements of characters' backstories or beliefs to make any scene more personal."
                /*~ @@DOUBLE-BLANK@@ ~*/
            ]
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    tipContext;
    /*~ @@DOUBLE-BLANK@@ ~*/
    constructor(tipContext) {
        this.tipContext = tipContext;
    }
}
/* #endregion */
/*~ @@DOUBLE-BLANK@@ ~*/
class BladesScoreSheet extends BladesItemSheet {
    /*~ @@DOUBLE-BLANK@@ ~*/
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["eunos-blades", "sheet", "item", "score-sheet"],
            template: "systems/eunos-blades/templates/items/score-sheet.hbs",
            width: 900,
            submitOnChange: false,
            height: 970
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async generateRandomizerData(category) {
        // Generate full set of random data.
        const randomData = {
            Bargains: Object.fromEntries(Object.entries(U.sample(Randomizers.GM.Bargains
                .filter((bData) => !Object.values(this.document.system.randomizers.Bargains)
                .some((_bData) => _bData.name === bData.name || _bData.effect === bData.effect)), 3, true, (e, a) => a
                .filter((_e) => e.category === _e.category).length === 0))
                .map(([k, v]) => {
                k = `${k}`;
                Object.assign(v, { notes: "" });
                return [k, v];
            })),
            Obstacles: Object.fromEntries(Object.entries(U.sample(Randomizers.GM.Obstacles
                .filter((bData) => !Object.values(this.document.system.randomizers.Obstacles)
                .some((_bData) => _bData.name === bData.name || _bData.desc === bData.desc)), 3, true, (e, a) => a
                .filter((_e) => e.category === _e.category).length === 0))
                .map(([k, v]) => {
                k = `${k}`;
                Object.assign(v, { notes: "" });
                return [k, v];
            })),
            NPCs: Object.fromEntries(Object.entries(U.sample(Randomizers.GM.NPCs
                .filter((bData) => !Object.values(this.document.system.randomizers.NPCs)
                .some((_bData) => _bData.name === bData.name
                || _bData.description === bData.description)), 3, true, (e, a) => a
                .filter((_e) => e.arena === _e.arena).length === 0))
                .map(([k, v]) => {
                k = `${k}`;
                Object.assign(v, { notes: "" });
                return [k, v];
            })),
            Scores: Object.fromEntries(Object.entries(U.sample(Randomizers.GM.Scores
                .filter((bData) => !Object.values(this.document.system.randomizers.Scores)
                .some((_bData) => _bData.name === bData.name || _bData.desc === bData.desc)), 3, true, (e, a) => a
                .filter((_e) => e.category === _e.category).length === 0))
                .map(([k, v]) => {
                k = `${k}`;
                Object.assign(v, { notes: "" });
                return [k, v];
            }))
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // If category specified, replace all other categories with stored data
        if (category) {
            Object.keys(randomData)
                .filter((cat) => cat !== category)
                .forEach((cat) => {
                const _cat = cat;
                randomData[_cat] = this.document.system.randomizers[_cat];
            });
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Combine locked data stored in system with randomly-generated data
        const finalRandomData = {
            Bargains: {},
            Obstacles: {},
            NPCs: {},
            Scores: {}
        };
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Iterate through all randomizer categories. If system entry isLocked, use that, or use newly-generated data
        Object.keys(randomData).forEach((cat) => {
            const _cat = cat;
            Object.keys(randomData[_cat]).forEach((index) => {
                if (this.document.system.randomizers?.[_cat][index].isLocked) {
                    finalRandomData[_cat][index] = this.document.system.randomizers[_cat][index];
                }
                else {
                    finalRandomData[_cat][index] = randomData[_cat][index];
                }
            });
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Overwrite stored data with newly generated & merged randomizer data
        await this.document.update({ "system.randomizers": finalRandomData });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    getData() {
        const context = super.getData();
        /*~ @@DOUBLE-BLANK@@ ~*/
        const sheetData = {};
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Get player characters, assign simplified actionData that I probably should have coded them with from the start
        sheetData.playerCharacters = BladesActor.GetTypeWithTags(BladesActorType.pc, Tag.PC.ActivePC)
            .map((pc) => {
            return Object.assign(pc, {
                actionData: Object.fromEntries(Object.entries(pc.system.attributes)
                    .map(([attrName, attrData]) => {
                    return [
                        attrName,
                        Object.fromEntries(Object.entries(attrData)
                            .map(([actionName, actionData]) => {
                            return [
                                U.uCase(actionName).slice(0, 3),
                                actionData
                            ];
                        }))
                    ];
                }))
            });
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        // Prune system data for blank/empty opposition entries
        const validOppositions = {};
        for (const [id, data] of Object.entries(context.system.oppositions)) {
            if (!data.rollOppName && !data.rollOppSubName) {
                continue;
            }
            validOppositions[id] = data;
        }
        context.system.oppositions = validOppositions;
        /*~ @@DOUBLE-BLANK@@ ~*/
        return {
            ...context,
            ...sheetData
        };
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _toggleRandomizerLock(event) {
        const elem$ = $(event.currentTarget);
        const elemCat = elem$.data("category");
        const elemIndex = `${elem$.data("index")}`;
        const elemValue = elem$.data("value");
        if (`${elemValue}` === "true") {
            this.document.update({ [`system.randomizers.${elemCat}.${elemIndex}.isLocked`]: false });
        }
        else {
            /*~ @@DOUBLE-BLANK@@ ~*/
            this.document.update({ [`system.randomizers.${elemCat}.${elemIndex}.isLocked`]: true });
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _selectImage(event) {
        const elem$ = $(event.currentTarget);
        const imageNum = elem$.data("imgNum");
        this.document.update({ "system.imageSelected": imageNum });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _deselectOrDeleteImage(event) {
        const elem$ = $(event.currentTarget);
        const imageNum = elem$.data("imgNum");
        if (this.document.system.imageSelected === imageNum) {
            /*~ @@DOUBLE-BLANK@@ ~*/
            this.document.update({ "system.-=imageSelected": null });
            return;
        }
        const images = { ...this.document.system.images };
        this.document.update({ "system.-=images": null }).then(() => this.document.update({
            "system.images": Object.fromEntries(Object.entries(Object.values(images)
                .filter((_, i) => U.pInt(imageNum) !== i)))
        }));
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _addImage() {
        U.displayImageSelector((path) => {
            const imgIndex = U.objSize(this.document.system.images);
            return this.document.update({ [`system.images.${imgIndex}`]: path });
        }, "systems/eunos-blades/assets", this.position);
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _selectRollOpposition(event) {
        eLog.checkLog3("Select Roll Opposition", { event });
        const elem$ = $(event.currentTarget);
        const oppId = elem$.data("oppId");
        this.document.update({ "system.oppositionSelected": oppId });
        if (BladesScore.Active?.id === this.document.id && BladesRoll.Active) {
            BladesRoll.Active.rollOpposition = new BladesRollOpposition(BladesRoll.Active, this.document.system.oppositions[oppId]);
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    _triggerRandomize(event) {
        const elem$ = $(event.currentTarget);
        const category = elem$.data("category");
        if (category && category in Randomizers.GM) {
            this.generateRandomizerData(category);
        }
        else {
            this.generateRandomizerData();
        }
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _updateGMNotesOnPC(event) {
        const elem$ = $(event.currentTarget);
        const actor = BladesActor.Get(elem$.data("id"));
        if (!actor) {
            throw new Error(`Unable to retrieve actor with id '${elem$.data("id")}'`);
        }
        const updateText = event.currentTarget.innerHTML;
        eLog.checkLog3("scoreSheet", "Retrieved Text, Updating ...", { updateText });
        await actor.update({ "system.gm_notes": updateText });
        eLog.checkLog3("scoreSheet", "Updated!", { gm_notes: actor.system.gm_notes });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    activateListeners(html) {
        super.activateListeners(html);
        /*~ @@DOUBLE-BLANK@@ ~*/
        html.find("[data-action='select-image']").on({
            click: this._selectImage.bind(this),
            contextmenu: this._deselectOrDeleteImage.bind(this)
        });
        html.find("[data-action='add-image']").on({
            click: this._addImage.bind(this)
        });
        html.find(".roll-opposition-name").on({
            dblclick: this._selectRollOpposition.bind(this)
        });
        html.find(".toggle-lock").on({
            click: this._toggleRandomizerLock.bind(this)
        });
        html.find("[data-action='randomize'").on({
            click: this._triggerRandomize.bind(this)
        });
        /*~ @@DOUBLE-BLANK@@ ~*/
        html.find("textarea.pc-summary-notes-body").on({
            change: this._updateGMNotesOnPC.bind(this)
        });
    }
    /*~ @@DOUBLE-BLANK@@ ~*/
    async _onSubmit(event, params = {}) {
        eLog.checkLog3("scoreSheet", "_onSubmit()", { event, params, elemText: event.currentTarget.innerHTML });
        let isForcingRender = true;
        /*~ @@DOUBLE-BLANK@@ ~*/
        const prevPhase = this.item.system.phase;
        const submitData = await super._onSubmit(event, params);
        /*~ @@DOUBLE-BLANK@@ ~*/
        const newPhase = this.item.system.phase;
        if (prevPhase !== newPhase) {
            switch (prevPhase) {
                case BladesPhase.CharGen: {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    break;
                }
                case BladesPhase.Freeplay: {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    break;
                }
                case BladesPhase.Score: {
                    isForcingRender = false;
                    game.actors.filter((actor) => BladesActor.IsType(actor, BladesActorType.pc))
                        .forEach((actor) => actor.clearLoadout());
                    break;
                }
                case BladesPhase.Downtime: {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    break;
                }
                // No default
            }
            switch (newPhase) {
                case BladesPhase.CharGen: {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    break;
                }
                case BladesPhase.Freeplay: {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    break;
                }
                case BladesPhase.Score: {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    break;
                }
                case BladesPhase.Downtime: {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    break;
                }
                // No default
            }
        }
        if (isForcingRender) {
            game.actors.filter((actor) => actor.type === BladesActorType.pc)
                .forEach((actor) => actor.sheet?.render());
        }
        return submitData;
    }
}
/*~ @@DOUBLE-BLANK@@ ~*/
export { BladesTipGenerator };
export default BladesScoreSheet;
/*~ @@DOUBLE-BLANK@@ ~*/ 
