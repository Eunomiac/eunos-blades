/* ****▌███████████████████████████████████████████████████████████████████████████▐**** *\
|*     ▌████░░░░░░░░░░░ Euno's Blades in the Dark for Foundry VTT ░░░░░░░░░░░░░████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░ by Eunomiac ░░░░░░░░░░░░░██████████████████▐     *|
|*     ▌████████████████████████████  License █ v0.1.0 ████████████████████████████▐     *|
|*     ▌██████████████████░░░░░░░░░░░░░░░░░░  ░░░░░░░░░░░░░░░░░░███████████████████▐     *|
\* ****▌███████████████████████████████████████████████████████████████████████████▐**** */

export const migrateWorld = async function () {
    ui.notifications.info(`Applying BITD Actors migration for version ${game.system.data.version}. Please be patient and do not close your game or shut down your server.`, { permanent: true });
    for (const a of game.actors.contents) {
        if (a.data.type === "character") {
            try {
                const updateData = _migrateActor(a.data);
                if (!isObjectEmpty(updateData)) {
                    console.log(`Migrating Actor entity ${a.name}`);
                    await a.update(updateData, { enforceTypes: false });
                }
            }
            catch (err) {
                console.error(err);
            }
        }
        if (a.data.type === "character" || a.data.type === "crew") {
            try {
                const updateData = _migrateTokenLink(a.data);
                if (!isObjectEmpty(updateData)) {
                    console.log(`Migrating Token Link for ${a.name}`);
                    await a.update(updateData, { enforceTypes: false });
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    for (const s of game.scenes.contents) {
        try {
            const updateData = _migrateSceneData(s.data);
            if (!isObjectEmpty(updateData)) {
                console.log(`Migrating Scene entity ${s.name}`);
                await s.update(updateData, { enforceTypes: false });
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    game.settings.set("eunos-blades", "systemMigrationVersion", game.system.data.version);
    ui.notifications.info(`BITD System Migration to version ${game.system.data.version} completed!`, { permanent: true });
};
export const _migrateSceneData = function (scene) {
    const tokens = duplicate(scene.tokens);
    return {
        tokens: tokens.map(t => {
            t.actorLink = true;
            t.actorData = {};
            return t;
        })
    };
};
function _migrateActor(actor) {
    const updateData = {};
    const { attributes } = game.system.model.Actor.character;
    for (const attribute_name of Object.keys(actor.data.attributes || {})) {
        if (typeof actor.data.attributes[attribute_name].label === "undefined") {
            updateData[`data.attributes.${attribute_name}.label`] = attributes[attribute_name].label;
        }
        for (const skill_name of Object.keys(actor.data.attributes[attribute_name].skills)) {

            if (typeof actor.data.attributes[attribute_name].skills[skill_name].label === "undefined") {
                updateData[`data.attributes.${attribute_name}.skills.${skill_name}.label`] = attributes[attribute_name].skills[skill_name].label;
                const skill_tmp = actor.data.attributes[attribute_name].skills[skill_name];
                if (Array.isArray(skill_tmp)) {
                    updateData[`data.attributes.${attribute_name}.skills.${skill_name}.value`] = [skill_tmp[0]];
                }
            }
        }
    }
    if (typeof actor.data.stress[0] !== "undefined") {
        updateData["data.stress.value"] = actor.data.stress;
        updateData["data.stress.max"] = 9;
        updateData["data.stress.max_default"] = 9;
        updateData["data.stress.name_default"] = "BITD.Stress";
        updateData["data.stress.name"] = "BITD.Stress";
    }
    if (typeof actor.data.trauma === "undefined") {
        updateData["data.trauma.list"] = actor.data.traumas;
        updateData["data.trauma.value"] = [actor.data.traumas.length];
        updateData["data.trauma.max"] = 4;
        updateData["data.trauma.max_default"] = 4;
        updateData["data.trauma.name_default"] = "BITD.Trauma";
        updateData["data.trauma.name"] = "BITD.Trauma";
    }
    return updateData;

}
function _migrateTokenLink(actor) {
    const updateData = {};
    updateData["token.actorLink"] = true;
    return updateData;
}