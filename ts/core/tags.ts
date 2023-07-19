import Tagify from "../../lib/tagify/tagify.esm.js";
import {Tag, District, Vice, Playbook, BladesActorType} from "./constants.js";
import U from "./utilities.js";

async function _onTagifyChange(event: Event, doc: BladesDoc, targetKey: keyof BladesDoc) {
	const tagString = (event.target as HTMLInputElement).value;
	if (tagString) {
		const tags: BladesTag[] = JSON.parse(tagString).map(({value}: { value: BladesTag }) => value);
		doc.update({[targetKey]: tags});
	} else {
		doc.update({[targetKey]: []});
	}
}

const Tags = {
	InitListeners: (html: JQuery<HTMLElement>, doc: BladesDoc) => {

		function makeTagInput(elemRef: string, tags: Record<string, BladesTag[]>) {

			const elem = html.find(elemRef)[0] as HTMLInputElement;

			if (!elem) { return }

			// Create tagify instance; populate dropdown list with tags
			const tagify = new Tagify(elem, {
				enforceWhitelist: true,
				editTags: false,
				whitelist: Object.entries(tags)
					.map(([dataGroup, tagList]) => tagList
						.map((tag: BladesTag) => ({
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

			(tagify as any).dropdown.createListHTML = (optionsArr: Array<{ value: BladesTag; "data-group": string }>) => {
				const map: Record<string, unknown> = {};

				return structuredClone(optionsArr)
					.map((suggestion, idx) => {

						const value = (tagify as any).dropdown.getMappedValue.call(
							tagify,
							suggestion
						);
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

						tagHTMLString += tagify.settings.templates.dropdownItem.apply(
							tagify,
							[suggestion, idx]
						);

						return tagHTMLString;
					})
					.join("");
			};

			// Add existing tags on doc to tag element
			function findDataGroup(tag: BladesTag|string): string|false {
				for (const [group, tagList] of Object.entries(tags)) {
					if (tagList.includes(tag)) { return group }
				}
				return false;
			}

			// Check if element specifies an alternate schema target from doc.tags
			const targetKey = $(elem).data("tagTarget") ?? "system.tags";
			const curTags = [getProperty(doc, targetKey) ?? []].flat();
			eLog.checkLog("tags", "Current Tags", curTags);
			tagify.addTags(
				curTags
					.filter(findDataGroup)
					.map((tag: BladesTag) => ({
						"value": (new Handlebars.SafeString(tag)).toString(),
						"data-group": findDataGroup(tag)
					})),
				false,
				false
			);

			// Add event listener for tag changes, setting defined target
			// Wait briefly, so other tag elements' tags can be set before listener initializes
			setTimeout(() => elem.addEventListener("change", (event) => _onTagifyChange(event, doc, targetKey)), 1000);
		}

		const factions = game.actors.filter((actor) => actor.type === BladesActorType.faction && actor.name !== null).map((faction) => faction.name) as string[];

		makeTagInput(".comp-tags.tags-gm", {
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