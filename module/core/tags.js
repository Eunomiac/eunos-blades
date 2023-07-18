/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import Tagify from "../../lib/tagify/tagify.esm.js";
import { Tag, District, Vice, Playbook, BladesActorType } from "./constants.js";
import U from "./utilities.js";
async function _onTagifyChange(event, doc, targetKey) {
    const tagString = event.target.value;
    if (tagString) {
        const tags = JSON.parse(tagString).map(({ value }) => value);
        doc.update({ [targetKey]: tags });
    }
    else {
        doc.update({ [targetKey]: [] });
    }
}
const Tags = {
    InitListeners: (html, doc) => {
        function makeTagInput(elemRef, tags) {
            const elem = html.find(elemRef)[0];
            if (!elem) {
                return;
            }
            const tagify = new Tagify(elem, {
                enforceWhitelist: true,
                editTags: false,
                whitelist: Object.entries(tags)
                    .map(([dataGroup, tagList]) => tagList
                    .map((tag) => ({
                    "value": (new Handlebars.SafeString(tag)).toString(),
                    "data-group": dataGroup
                })))
                    .flat(),
                dropdown: {
                    enabled: 0,
                    maxItems: 10000,
                    placeAbove: false,
                    appendTarget: html[0]
                }
            });
            tagify.dropdown.createListHTML = (optionsArr) => {
                const map = {};
                return structuredClone(optionsArr)
                    .map((suggestion, idx) => {
                    const value = tagify.dropdown.getMappedValue.call(tagify, suggestion);
                    let tagHTMLString = "";
                    if (!map[suggestion["data-group"]]) {
                        map[suggestion["data-group"]] = true;
                        if (Object.keys(map).length) {
                            tagHTMLString += "</div>";
                        }
                        tagHTMLString += `
								<div class="tagify__dropdown__itemsGroup">
								<h3>${suggestion["data-group"]}</h3>
							`;
                    }
                    suggestion.value
                        = value && typeof value === "string" ? U.escapeHTML(value) : value;
                    tagHTMLString += tagify.settings.templates.dropdownItem.apply(tagify, [suggestion, idx]);
                    return tagHTMLString;
                })
                    .join("");
            };
            function findDataGroup(tag) {
                for (const [group, tagList] of Object.entries(tags)) {
                    if (tagList.includes(tag)) {
                        return group;
                    }
                }
                return false;
            }
            const targetKey = $(elem).data("tagTarget") ?? "system.tags";
            const curTags = [getProperty(doc, targetKey) ?? []].flat();
            eLog.checkLog("tags", "Current Tags", curTags);
            tagify.addTags(curTags
                .filter(findDataGroup)
                .map((tag) => ({
                "value": (new Handlebars.SafeString(tag)).toString(),
                "data-group": findDataGroup(tag)
            })), false, false);

            setTimeout(() => elem.addEventListener("change", (event) => _onTagifyChange(event, doc, targetKey)), 1000);
        }
        const factions = game.actors.filter((actor) => actor.type === BladesActorType.faction && actor.name !== null).map((faction) => faction.name);
        makeTagInput(".comp-tags tags-gm", {
            "System Tags": Object.values(Tag.System),
            "Item Tags": Object.values(Tag.Item),
            "Actor Tags": [
                ...Object.values(Tag.PC),
                ...Object.values(Tag.NPC)
            ],
            "Vices": Object.values(Vice),
            "Playbooks": Object.values(Playbook)
        });
        makeTagInput(".tags-district", {
            Districts: Object.values(District)
        });
        makeTagInput(".tags-faction", {
            Factions: factions
        });
    }
};
export default Tags;