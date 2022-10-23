/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
        "systems/eunos-blades/templates/parts/toggle-icon.hbs",
        "systems/eunos-blades/templates/parts/button-icon.hbs",
        "systems/eunos-blades/templates/parts/coins.hbs",
        "systems/eunos-blades/templates/parts/attributes.hbs",
        "systems/eunos-blades/templates/parts/turf-list.hbs",
        "systems/eunos-blades/templates/parts/cohort-block.hbs",
        "systems/eunos-blades/templates/parts/factions.hbs",
        "systems/eunos-blades/templates/parts/active-effects.hbs"
    ];
    return loadTemplates(templatePaths);
};