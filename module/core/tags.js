import Tagify from "../../lib/tagify/tagify.esm.js";
import { Tag, MainDistrict, OtherDistrict, Vice, Playbook, BladesActorType } from "./constants.js";
import U from "./utilities.js";
/*~ @@DOUBLE-BLANK@@ ~*/
const _onTagifyChange = (event, doc, targetKey) => {
    const tagString = event.target.value;
    if (tagString) {
        const tags = JSON.parse(tagString).map(({ value }) => value);
        doc.update({ [targetKey]: tags });
    }
    else {
        doc.update({ [targetKey]: [] });
    }
};
/*~ @@DOUBLE-BLANK@@ ~*/
const Tags = {
    InitListeners: (html, doc) => {
        /*~ @@DOUBLE-BLANK@@ ~*/
        /**
         * Applies tags and Tagify functionality to a specified HTML element.
         * @param {HTMLElement} elem The element to tagify.
         * @param {Record<string,BladesTag[]>} tags The tags, sorted into groups, to apply.
         */
        function makeTagInput(elem, tags) {
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Create tagify instance; populate dropdown list with tags
            const tagify = new Tagify(elem, {
                enforceWhitelist: true,
                editTags: false,
                whitelist: Object.entries(tags)
                    .map(([dataGroup, tagList]) => tagList
                    .map((tag) => ({
                    value: (new Handlebars.SafeString(tag)).toString(),
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
            /*~ @@DOUBLE-BLANK@@ ~*/
            tagify.dropdown.createListHTML = (optionsArr) => {
                const map = {};
                /*~ @@DOUBLE-BLANK@@ ~*/
                return structuredClone(optionsArr)
                    .map((suggestion, idx) => {
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    const value = tagify.dropdown.getMappedValue.call(tagify, suggestion);
                    let tagHTMLString = "";
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    if (!map[suggestion["data-group"]]) {
                        map[suggestion["data-group"]] = true;
                        /*~ @@DOUBLE-BLANK@@ ~*/
                        if (Object.keys(map).length) {
                            tagHTMLString += "</div>";
                        }
                        /*~ @@DOUBLE-BLANK@@ ~*/
                        tagHTMLString += `
                <div class="tagify__dropdown__itemsGroup">
                <h3>${suggestion["data-group"]}</h3>
              `;
                    }
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    suggestion.value =
                        value && typeof value === "string" ? U.escapeHTML(value) : value;
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    tagHTMLString += tagify.settings.templates.dropdownItem.apply(tagify, [suggestion, idx]);
                    /*~ @@DOUBLE-BLANK@@ ~*/
                    return tagHTMLString;
                })
                    .join("");
            };
            /*~ @@DOUBLE-BLANK@@ ~*/
            /**
             * Returns the tag group to which a tag belongs, or false if no group found.
             * @param {BladesTag|string} tag
             * @returns {string|false} Either the group containing the given tag, or false if no group found.
             */
            function findDataGroup(tag) {
                for (const [group, tagList] of Object.entries(tags)) {
                    if (tagList.includes(tag)) {
                        return group;
                    }
                }
                return false;
            }
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Check if element specifies an alternate schema target from doc.tags
            const targetKey = $(elem).data("tagTarget") ?? "system.tags";
            const curTags = [getProperty(doc, targetKey) ?? []].flat().filter(Boolean);
            tagify.addTags(curTags
                .filter(findDataGroup)
                .map((tag) => ({
                value: (new Handlebars.SafeString(tag)).toString(),
                "data-group": findDataGroup(tag)
            })), true, true);
            /*~ @@DOUBLE-BLANK@@ ~*/
            // Add event listener for tag changes, setting defined target
            // Wait briefly, so other tag elements' tags can be set before listener initializes
            setTimeout(() => elem.addEventListener("change", (event) => { _onTagifyChange(event, doc, targetKey); }), 1000);
        }
        /*~ @@DOUBLE-BLANK@@ ~*/
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
            Vices: Object.values(Vice),
            Playbooks: Object.values(Playbook),
            Inventions: Object.values(Tag.Invention),
            "Gang Types": Object.values(Tag.GangType)
        };
        const districtTags = {
            "City Districts": Object.values(MainDistrict),
            "Other Districts": Object.values(OtherDistrict)
        };
        const factionTags = { Factions: game.actors
                .filter((actor) => actor.type === BladesActorType.faction && actor.name !== null)
                .map((faction) => faction.name) };
        /*~ @@DOUBLE-BLANK@@ ~*/
        $(html).find(".tags-gm").each((_, e) => makeTagInput(e, systemTags));
        /*~ @@DOUBLE-BLANK@@ ~*/
        $(html).find(".tags-district").each((_, e) => makeTagInput(e, districtTags));
        /*~ @@DOUBLE-BLANK@@ ~*/
        $(html).find(".tags-faction").each((_, e) => makeTagInput(e, factionTags));
        /*~ @@DOUBLE-BLANK@@ ~*/
    }
};
/*~ @@DOUBLE-BLANK@@ ~*/
export default Tags;
/*~ @@DOUBLE-BLANK@@ ~*/ 
