export default class BladesHelpers {
    /**
   * Identifies duplicate items by type and returns a array of item ids to remove
   *
   * @param {Object} item_data
   * @param {Document} actor
   * @returns {Array}
   *
   */
    static removeDuplicatedItemType(item_data, actor) {
        const dupe_list = [], distinct_types = ["crew_reputation", "class", "vice", "background", "heritage"], allowed_types = ["item"], should_be_distinct = distinct_types.includes(item_data.type);
        // If the Item has the exact same name - remove it from list.
        // Remove Duplicate items from the array.
        actor.items.forEach(i => {
            const has_double = (item_data.type === i.data.type);
            if (((i.name === item_data.name) || (should_be_distinct && has_double)) && !(allowed_types.includes(item_data.type)) && (item_data._id !== i.id)) {
                dupe_list.push(i.id);
            }
        });
        return dupe_list;
    }
    /**
   * Get a nested dynamic attribute.
   * @param {Object} obj
   * @param {string} property
   */
    // @ts-expect-error Fuck.
    static getNestedProperty(obj, property) { return property.split(".").reduce((r, e) => r[e], obj); }
    /**
   * Add item functionality
   */
    static _addOwnedItem(event, actor) {
        event.preventDefault();
        const a = event.currentTarget;
        const item_type = a.dataset.itemType;
        const data = {
            name: randomID(),
            type: item_type
        };
        return actor.createEmbeddedDocuments("Item", [data]);
    }
    /**
   * Get the list of all available ingame items by Type.
   *
   * @param {string} item_type
   * @param {Object} game
   */
    static async getAllItemsByType(item_type, game) {
        let list_of_items = [], game_items = [], compendium_items = [];
        game_items = game.items.filter(e => e.type === item_type).map(e => { return e.data; });
        const pack = game.packs.find(e => e.metadata.name === item_type);
        if (!pack) {
            return [];
        }
        const compendium_content = await pack.getDocuments();
        compendium_items = compendium_content.map(e => { return e.data; });
        list_of_items = game_items.concat(compendium_items);
        list_of_items.sort(function (a, b) {
            const nameA = a.name.toUpperCase(), nameB = b.name.toUpperCase();
            return nameA.localeCompare(nameB);
        });
        return list_of_items;
    }
    static async getIconMap(item_type) {
        item_type = [item_type].flat();
        const iconEntries = await Promise.all(item_type
            .map(async (iType) => {
            const pack = game.packs.find(e => e.metadata.name === iType);
            if (!pack) {
                throw new Error(`No compendium pack with type '${iType}' found.`);
            }
            const compendium_content = await pack.getDocuments();
            // @ts-expect-error Temp
            return compendium_content.map((item) => [item.name, item.img]);
        }));
        return Object.fromEntries(iconEntries.flat(1));
    }
    static async changeItemNamesAndIcons() {
        // Assemble Icon Map from "class", "background", "crew_type", "faction".
        const iconMap = await BladesHelpers.getIconMap(["class", "background", "crew_type", "faction"]);
        // For given item types, go through pack and REMOVE parenthetical prefix but assign appropriate icon.
        // Crew Abilities
        const crewAbilityCompendium = await getPackItems("crew_ability");
        crewAbilityCompendium.forEach((abilityItem) => {
            // @ts-expect-error Temp
            const className = abilityItem.system.class;
            abilityItem.update({
                name: abilityItem.name?.replace(/^\(.*?\)\s+/, ""),
                img: iconMap[className].replace(/\/icons\//, "/icons/crew-ability-icons/")
            });
        });
        // Crew Upgrades
        const crewUpgradeCompendium = await getPackItems("crew_upgrade");
        crewUpgradeCompendium.forEach((upgradeItem) => {
            // @ts-expect-error Temp
            const className = upgradeItem.system.class;
            upgradeItem.update({
                name: upgradeItem.name?.replace(/^\(.*?\)\s+/, ""),
                img: className in iconMap
                    ? iconMap[className].replace(/\/icons\//, "/icons/crew-upgrade-icons/")
                    : "systems/eunos-blades/assets/icons/crew-upgrade-icons/default.svg"
            });
        });
        // Items
        const itemsCompendium = await getPackItems("item");
        itemsCompendium.forEach((item) => {
            // @ts-expect-error Temp
            const className = item.system.class;
            item.update({
                name: item.name?.replace(/^\(.*?\)\s+/, ""),
                img: className in iconMap
                    ? iconMap[className].replace(/\/icons\//, "/icons/item-icons/")
                    : "systems/eunos-blades/assets/icons/item-icons/default.svg"
            });
        });
        return;
        async function getPackItems(item_type) {
            const pack = game.packs.find(e => e.metadata.name === item_type);
            if (!pack) {
                throw new Error(`No compendium pack with type '${item_type}' found.`);
            }
            return pack.getDocuments();
        }
        // Scoundrel Abilities
        const abilityCompendium = await getPackItems("ability");
        abilityCompendium.forEach((abilityItem) => {
            // @ts-expect-error Temp
            const className = abilityItem.system.class;
            abilityItem.update({ img: iconMap[className].replace(/\/icons\//, "/icons/ability-icons/") });
        });
    }
    /* -------------------------------------------- */
    /**
   * Returns the label for attribute.
   *
   * @param {string} attribute_name
   * @returns {string}
   */
    static getAttributeLabel(attribute_name) {
        const attribute_labels = {};
        const attributes = game.system.model.Actor.character.attributes;
        for (const att_name in attributes) {
            attribute_labels[att_name] = attributes[att_name].label;
            for (const skill_name in attributes[att_name].skills) {
                attribute_labels[skill_name] = attributes[att_name].skills[skill_name].label;
            }
        }
        return attribute_labels[attribute_name];
    }
    /**
   * Returns true if the attribute is an action
   *
   * @param {string} attribute_name
   * @returns {Boolean}
   */
    static isAttributeAction(attribute_name) {
        const attributes = game.system.model.Actor.character.attributes;
        return !(attribute_name in attributes);
    }
    /* -------------------------------------------- */
    /**
   * Creates options for faction clocks.
   *
   * @param {int[]} sizes
   *  array of possible clock sizes
   * @param {int} default_size
   *  default clock size
   * @param {int} current_size
   *  current clock size
   * @returns {string}
   *  html-formatted option string
   */
    static createListOfClockSizes(sizes, default_size, current_size) {
        let text = "";
        sizes.forEach(size => {
            text += `<option value="${size}"`;
            if (!(current_size) && (size === default_size)) {
                text += " selected";
            }
            else if (size === current_size) {
                text += " selected";
            }
            text += `>${size}</option>`;
        });
        return text;
    }
}
export function registerHandlebarHelpers() {
    // Is the value Turf side.
    Handlebars.registerHelper("is_turf_side", function isTurfSide(value, options) {
        if (["left", "right", "top", "bottom"].includes(value)) {
            // @ts-expect-error MIGRATION PAINS
            return options.fn(this);
        }
        else {
            // @ts-expect-error MIGRATION PAINS
            return options.inverse(this);
        }
    });
    // Multiboxes.
    Handlebars.registerHelper("multiboxes", function multiboxes(selected, options) {
        // @ts-expect-error MIGRATION PAINS
        let html = options.fn(this);
        // Fix for single non-array values.
        if (!Array.isArray(selected)) {
            selected = [selected];
        }
        if (typeof selected !== "undefined") {
            // @ts-expect-error MIGRATION PAINS
            selected.forEach(selected_value => {
                if (selected_value !== false) {
                    const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected_value));
                    const rgx = new RegExp(' value=\"' + escapedValue + '\"');
                    html = html.replace(rgx, "$& checked=\"checked\"");
                }
            });
        }
        return html;
    });
    // Trauma Counter
    Handlebars.registerHelper("traumacounter", function traumacounter(selected, options) {
        // @ts-expect-error MIGRATION PAINS
        const html = options.fn(this);
        let count = 0;
        for (const trauma in selected) {
            if (selected[trauma] === true) {
                count++;
            }
        }
        if (count > 4) {
            count = 4;
        }
        const rgx = new RegExp(' value=\"' + count + '\"');
        return html.replace(rgx, "$& checked=\"checked\"");
    });
    // NotEquals handlebar.
    // @ts-expect-error MIGRATION PAINS
    Handlebars.registerHelper("noteq", (a, b, options) => (a !== b ? options.fn(this) : ""));
    // ReputationTurf handlebar.
    Handlebars.registerHelper("repturf", (turfs_amount, options) => {
        // @ts-expect-error MIGRATION PAINS
        let html = options.fn(this), turfs_amount_int = parseInt(turfs_amount);
        // Can't be more than 6.
        if (turfs_amount_int > 6) {
            turfs_amount_int = 6;
        }
        for (let i = 13 - turfs_amount_int; i <= 12; i++) {
            const rgx = new RegExp(' value=\"' + i + '\"');
            html = html.replace(rgx, "$& disabled=\"disabled\"");
        }
        return html;
    });
    Handlebars.registerHelper("crew_vault_coins", (max_coins, options) => {
        // @ts-expect-error MIGRATION PAINS
        let html = options.fn(this);
        for (let i = 1; i <= max_coins; i++) {
            html += "<input type=\"radio\" id=\"crew-coins-vault-" + i + "\" name=\"data.vault.value\" value=\"" + i + "\"><label for=\"crew-coins-vault-" + i + "\"></label>";
        }
        return html;
    });
    Handlebars.registerHelper("crew_experience", (actor, options) => {
        // @ts-expect-error MIGRATION PAINS
        let html = options.fn(this);
        for (let i = 1; i <= 10; i++) {
            html += `<input type="radio" id="crew-${actor._id}-experience-${i}" name="data.experience" value="${i}" dtype="Radio"><label for="crew-${actor._id}-experience-${i}"></label>`;
        }
        return html;
    });
    // Enrich the HTML replace /n with <br>
    Handlebars.registerHelper("html", (options) => {
        const text = options.hash.text.replace(/\n/g, "<br />");
        return new Handlebars.SafeString(text);
    });
    // "N Times" loop for handlebars.
    //  Block is executed N times starting from n=1.
    //
    // Usage:
    // {{#times_from_1 10}}
    //   <span>{{this}}</span>
    // {{/times_from_1}}
    Handlebars.registerHelper("times_from_1", (n, block) => {
        let accum = "";
        for (let i = 1; i <= n; ++i) {
            accum += block.fn(i);
        }
        return accum;
    });
    // "N Times" loop for handlebars.
    //  Block is executed N times starting from n=0.
    //
    // Usage:
    // {{#times_from_0 10}}
    //   <span>{{this}}</span>
    // {{/times_from_0}}
    Handlebars.registerHelper("times_from_0", (n, block) => {
        let accum = "";
        for (let i = 0; i <= n; ++i) {
            accum += block.fn(i);
        }
        return accum;
    });
    // Concat helper
    // https://gist.github.com/adg29/f312d6fab93652944a8a1026142491b1
    // Usage: (concat 'first 'second')
    Handlebars.registerHelper("concat", function () {
        let outStr = "";
        for (const arg in arguments) {
            if (typeof arguments[arg] !== "object") {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });
    /**
   * @inheritDoc
   * Takes label from Selected option instead of just plain value.
   */
    Handlebars.registerHelper("selectOptionsWithLabel", (choices, options) => {
        const localize = options.hash.localize ?? false;
        let selected = options.hash.selected ?? null;
        const blank = options.hash.blank || null;
        selected = selected instanceof Array ? selected.map(String) : [String(selected)];
        // Create an option
        const option = (key, object) => {
            if (localize) {
                object.label = game.i18n.localize(object.label);
            }
            const isSelected = selected.includes(key);
            html += `<option value="${key}" ${isSelected ? "selected" : ""}>${object.label}</option>`;
        };
        // Create the options
        let html = "";
        if (blank) {
            option("", blank);
        }
        Object.entries(choices).forEach(e => option(...e));
        return new Handlebars.SafeString(html);
    });
    /**
   * Create appropriate Blades clock
   */
    Handlebars.registerHelper("blades-clock", (parameter_name, type, current_value, uniq_id) => {
        let html = "";
        if (current_value === null || current_value === "null") {
            current_value = 0;
        }
        if (parseInt(current_value) > parseInt(type)) {
            current_value = type;
        }
        // Label for 0
        html += `<label class="clock-zero-label" for="clock-0-${uniq_id}}"><i class="fab fa-creative-commons-zero nullifier"></i></label>`;
        html += `<div id="blades-clock-${uniq_id}" class="blades-clock clock-${type} clock-${type}-${current_value}" style="background-image:url('systems/eunos-blades/assets/progressclocks-svg/Progress Clock ${type}-${current_value}.svg');">`;
        const zero_checked = (parseInt(current_value) === 0) ? 'checked="checked"' : "";
        html += `<input type="radio" value="0" id="clock-0-${uniq_id}}" name="${parameter_name}" ${zero_checked}>`;
        for (let i = 1; i <= parseInt(type); i++) {
            const checked = (parseInt(current_value) === i) ? 'checked="checked"' : "";
            html += `
        <input type="radio" value="${i}" id="clock-${i}-${uniq_id}" name="${parameter_name}" ${checked}>
        <label for="clock-${i}-${uniq_id}"></label>
      `;
        }
        html += "</div>";
        return html;
    });
    /**
     * Remove class indicators from item names
     */
    Handlebars.registerHelper("removeClassPrefix", (classStr) => classStr.replace(/^\(.*?\)\s*/, ""));
    /**
     * Count number of non-null, non-undefined elements in an array or values of an object.
     */
    Handlebars.registerHelper("count", (arr) => Object.values(arr)
        .filter((val) => val !== null && val !== undefined)
        .length);
}
