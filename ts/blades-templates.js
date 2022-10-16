/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
	// Define template paths to load
	const templatePaths = [

		// General Partials
		"systems/eunos-blades/templates/parts/toggle-icon.hbs",
		"systems/eunos-blades/templates/parts/button-icon.hbs",

		// Actor Sheet Partials
		"systems/eunos-blades/templates/parts/coins.hbs",
		"systems/eunos-blades/templates/parts/attributes.hbs",
		"systems/eunos-blades/templates/parts/turf-list.hbs",
		"systems/eunos-blades/templates/parts/cohort-block.hbs",
		"systems/eunos-blades/templates/parts/factions.hbs",
		"systems/eunos-blades/templates/parts/active-effects.hbs"
	];

	// Load the template parts
	return loadTemplates(templatePaths);
};
