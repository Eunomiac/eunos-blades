/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

import Tagify from "../../lib/tagify/tagify.esm.js";
import { Tag, MainDistrict, OtherDistrict, Vice, Playbook, BladesActorType } from "./constants.js";
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
        function makeTagInput(elem, tags) {
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
            const curTags = [getProperty(doc, targetKey) ?? []].flat().filter(Boolean);
            tagify.addTags(curTags
                .filter(findDataGroup)
                .map((tag) => ({
                "value": (new Handlebars.SafeString(tag)).toString(),
                "data-group": findDataGroup(tag)
            })), true, true);

            setTimeout(() => elem.addEventListener("change", async (event) => await _onTagifyChange(event, doc, targetKey)), 1000);
        }
        const systemTags = {
            "System Tags": Object.values(Tag.System),
            "Gear Tags": [
                ...Object.values(Tag.Gear),
                ...Object.values(Tag.GearCategory)
            ],
            "Actor Tags": [
                ...Object.values(Tag.PC),
                ...Object.values(Tag.NPC)
            ],
            "Vices": Object.values(Vice),
            "Playbooks": Object.values(Playbook),
            "Inventions": Object.values(Tag.Invention),
            "Gang Types": Object.values(Tag.GangType)
        };
        const districtTags = {
            "City Districts": Object.values(MainDistrict),
            "Other Districts": Object.values(OtherDistrict)
        };
        const factionTags = { Factions: game.actors
                .filter((actor) => actor.type === BladesActorType.faction && actor.name !== null)
                .map((faction) => faction.name) };
        $(html).find(".tags-gm").each((_, e) => makeTagInput(e, systemTags));
        $(html).find(".tags-district").each((_, e) => makeTagInput(e, districtTags));
        $(html).find(".tags-faction").each((_, e) => makeTagInput(e, factionTags));
    }
};
export default Tags;
//# sourceMappingURL=tags.js.map
//# sourceMappingURL=tags.js.map
