import {Tagify} from "../libraries";
import {Tag, MainDistrict, OtherDistrict, Vice, Playbook, BladesActorType} from "./constants";
import U from "./utilities";

type HTMLTaggableElement = HTMLInputElement | HTMLTextAreaElement;

type TagifyPlus<T extends Tagify.BaseTagData> = Tagify<T> & {
  dropdown: {
    createListHTML: (optionsArray: T[]) => string,
    getMappedValue: (tagData: T) => string
  }
}

const _onTagifyChange = (event: Event, doc: BladesDoc, targetKey: keyof BladesDoc) => {
  const tagString = (event.target as HTMLInputElement).value;
  if (tagString) {
    const tags: BladesTag[] = JSON.parse(tagString).map(({value}: { value: BladesTag }) => value);
    doc.update({[targetKey]: tags});
  } else {
    doc.update({[targetKey]: []});
  }
};

const Tags = {
  InitListeners: (html: JQuery<HTMLElement>, doc: BladesDoc) => {

    /**
     * Applies tags and Tagify functionality to a specified HTML element.
     * @param {HTMLElement} elem The element to tagify.
     * @param {Record<string,BladesTag[]>} tags The tags, sorted into groups, to apply.
     */
    function makeTagInput(elem: HTMLTaggableElement, tags: Record<string, BladesTag[]>) {

      // Create tagify instance; populate dropdown list with tags
      const tagify = new Tagify<{value: string, "data-group": string}>(elem, {
        enforceWhitelist: true,
        editTags: false,
        whitelist: Object.entries(tags)
          .map(([dataGroup, tagList]) => tagList
            .map((tag: BladesTag) => ({
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
      }) as TagifyPlus<{value: string, "data-group": string}>;

      tagify.dropdown.createListHTML = (optionsArr: Array<{ value: BladesTag; "data-group": string }>) => {
        const map: Record<string, unknown> = {};

        return structuredClone(optionsArr)
          .map((suggestion) => {

            const value = tagify.dropdown.getMappedValue.call(
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

            suggestion.value =
              value && typeof value === "string" ? U.escapeHTML(value) : value;

            tagHTMLString += tagify.settings.templates.dropdownItem.apply(
              tagify,
              [suggestion]
            );

            return tagHTMLString;
          })
          .join("");
      };

      /**
       * Returns the tag group to which a tag belongs, or false if no group found.
       * @param {BladesTag|string} tag
       * @returns {string|false} Either the group containing the given tag, or false if no group found.
       */
      function findDataGroup(tag: BladesTag|string): string|false {
        for (const [group, tagList] of Object.entries(tags)) {
          if (tagList.includes(tag)) { return group; }
        }
        return false;
      }

      // Check if element specifies an alternate schema target from doc.tags
      const targetKey = $(elem).data("tagTarget") ?? "system.tags";
      const curTags = [getProperty(doc, targetKey) ?? []].flat().filter(Boolean);
      tagify.addTags(
        curTags
          .filter(findDataGroup)
          .map((tag: BladesTag) => ({
            value: (new Handlebars.SafeString(tag)).toString(),
            "data-group": findDataGroup(tag) as string
          })),
        true,
        true
      );

      // Add event listener for tag changes, setting defined target
      // Wait briefly, so other tag elements' tags can be set before listener initializes
      setTimeout(() => elem.addEventListener("change", (event) => { _onTagifyChange(event, doc, targetKey); }), 1000);
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
      Vices: Object.values(Vice),
      Playbooks: Object.values(Playbook),
      Inventions: Object.values(Tag.Invention),
      "Gang Types": Object.values(Tag.GangType)
    };
    const districtTags = {
      "City Districts": Object.values(MainDistrict),
      "Other Districts": Object.values(OtherDistrict)
    };
    const factionTags = {Factions: game.actors
      .filter((actor): actor is BladesActorOfType<BladesActorType.faction> & {name: string} =>
        actor.type === BladesActorType.faction && actor.name !== null)
      .map((faction) => faction.name)};

    $(html).find(".tags-gm").each((_, e) => makeTagInput(e as HTMLTaggableElement, systemTags));

    $(html).find(".tags-district").each((_, e) => makeTagInput(e as HTMLTaggableElement, districtTags));

    $(html).find(".tags-faction").each((_, e) => makeTagInput(e as HTMLTaggableElement, factionTags));

  }
};

export default Tags;
