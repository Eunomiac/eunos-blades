export const registerSystemSettings = function () {
    
        game.settings.register("eunos-blades", "systemMigrationVersion", {
        "name": "System Migration Version",
        "scope": "world",
        "config": false,
        "type": Number,
        "default": 0
    });
};