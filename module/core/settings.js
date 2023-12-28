import U from "./utilities.js";
import C from "./constants.js";
const registerSettings = function () {
    game.settings.register("eunos-blades", "debug", {
        name: "Debug Level",
        hint: "The verbosity of the debug messages to console.",
        scope: "client",
        config: true,
        type: Number,
        range: {
            min: 0,
            max: 5,
            step: 1
        },
        default: 3 // The default value for the setting
    });
    game.settings.register("eunos-blades", "debugHooks", {
        name: "Debug HOOKS",
        hint: "Whether all Hooks are logged to the console.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("eunos-blades", "openAPIModelLevel", {
        name: "AI Base Quality",
        hint: "Lower values are cheaper to run, at the cost of quality.",
        scope: "client",
        config: true,
        type: Number,
        range: {
            min: 0,
            max: 2,
            step: 1
        }
    });
    game.settings.register("eunos-blades", "blacklist", {
        name: "Debug Blacklist",
        hint: "Comma-delimited list of categories of debug messages to silence.",
        scope: "client",
        config: true,
        type: String,
        default: "" // The default value for the setting
    });
    game.settings.register("eunos-blades", "openAPIKey", {
        name: "OpenAI API Key",
        hint: "Your personal OpenAI API Key (necessary to enable AI functionality)",
        scope: "client",
        config: true,
        type: String,
        default: "" // The default value for the setting
    });
    game.settings.register("eunos-blades", "whitelist", {
        name: "Debug Whitelist",
        hint: "Comma-delimited list of categories of debug messages to promote.",
        scope: "client",
        config: true,
        type: String,
        default: "" // The default value for the setting
    });
    /**
     * Track the system version upon which point a migration was last applied
     */
    game.settings.register("eunos-blades", "systemMigrationVersion", {
        name: "System Migration Version",
        scope: "world",
        config: false,
        type: Number,
        default: 0
    });
};
/**
 *
 */
export function initTinyMCEStyles() {
    CONFIG.TinyMCE = {
        ...CONFIG.TinyMCE,
        ...{
            skin: "skin",
            skin_url: "systems/eunos-blades/css/tinymce/skin",
            content_css: `systems/eunos-blades/css/tinymce/content.css?${new Date().getTime()}`,
            font_css: "systems/eunos-blades/css/fonts.css",
            max_height: 500,
            min_height: 40,
            autoresize_overflow_padding: 0,
            autoresize_bottom_margin: 0,
            menubar: false,
            statusbar: false,
            elementPath: true,
            branding: false,
            resize: false,
            plugins: "lists image table code save autoresize searchreplace quickbars template",
            save_enablewhendirty: false,
            // Table_default_styles: {},
            style_formats: [
                {
                    title: "Headings",
                    items: [
                        { title: "Heading 1", block: "h1", wrapper: false },
                        { title: "Heading 2", block: "h2", wrapper: false },
                        { title: "Heading 3", block: "h3", wrapper: false },
                        { title: "Heading 4", block: "h4", wrapper: false }
                    ]
                },
                {
                    title: "Blocks",
                    items: [
                        { title: "Paragraph", block: "p", wrapper: false },
                        { title: "Block Quote", block: "blockquote", wrapper: true }
                        // {title: "Secret", block: "span", classes: "text-secret", attributes: {"data-is-secret": "true"}, wrapper: false}
                    ]
                },
                {
                    title: "Inline",
                    items: [
                        { title: "Bold", inline: "b", wrapper: false },
                        { title: "Italics", inline: "i", wrapper: false },
                        { title: "Underline", inline: "u", wrapper: false },
                        { title: "Secret", inline: "span", classes: "text-secret", attributes: { "data-is-secret": "true" }, wrapper: false }
                    ]
                }
            ],
            style_formats_merge: false,
            toolbar: "styles | searchreplace | formatting alignment lists elements | removeformat | code | save",
            toolbar_groups: {
                formatting: {
                    icon: "color-picker",
                    tooltip: "Formatting",
                    items: "bold italic underline"
                },
                alignment: {
                    icon: "align-left",
                    tooltip: "Alignment",
                    items: "alignleft aligncenter alignright alignjustify | outdent indent"
                },
                lists: {
                    icon: "unordered-list",
                    tooltip: "Lists",
                    items: "bullist numlist"
                },
                elements: {
                    icon: "duplicate",
                    tooltip: "Insert Element",
                    items: "tableinsertdialog image hr | template"
                }
            },
            toolbar_mode: "floating",
            quickbars_link_toolbar: false,
            quickbars_selection_toolbar: "styles | bold italic underline",
            quickbars_insert_toolbar: "hr image table",
            quickbars_table_toolbar: "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol"
        }
    };
}
/**
 *
 */
export function initCanvasStyles() {
    CONFIG.canvasTextStyle = new PIXI.TextStyle({
        align: "center",
        dropShadow: true,
        dropShadowAngle: U.degToRad(45),
        dropShadowBlur: 8,
        dropShadowColor: C.Colors.BLACK,
        dropShadowDistance: 4,
        fill: [
            C.Colors.bWHITE,
            C.Colors.bGREY
        ],
        fillGradientType: 1,
        fillGradientStops: [
            0,
            0.3
        ],
        fontFamily: "Kirsty",
        fontSize: 32,
        letterSpacing: 2,
        lineHeight: 32,
        lineJoin: "round",
        padding: 4,
        stroke: C.Colors.dBLACK,
        strokeThickness: 3,
        trim: true,
        whiteSpace: "normal",
        wordWrap: true,
        wordWrapWidth: 0.1
    });
}
export function initDOMStyles() {
    // Create a full-screen background gradient that resembles the gradient described in CONFIG-canvasTextStyles
    // This will serve as a fallback background when the canvas has been disabled or is not available
    $("body.vtt.game.system-eunos-blades")
        .append(`<div id="backsplash" style="height: 100%; width: 100%; position: absolute; z-index: -1; background: linear-gradient(35deg, ${C.Colors.GREY}, ${C.Colors.BLACK});"></div>`);
    // Append lightning-barrier background to #sidebar
    $("#interface")
        .append(`<div class="lightning-border-container">
    </div>`); /*
      <img class="border-lightning right-lightning right-lightning-a" src="systems/eunos-blades/assets/animations/chat/energy-beam.webp" />
      <img class="border-lightning right-lightning right-lightning-b" src="systems/eunos-blades/assets/animations/chat/lightning-ray.webp" />
      <img class="border-lightning right-lightning right-lightning-c" src="systems/eunos-blades/assets/animations/chat/lightning-ray.webp" />
      <img class="border-lightning left-lightning left-lightning-a" src="systems/eunos-blades/assets/animations/chat/energy-beam.webp" />
      <img class="border-lightning left-lightning left-lightning-b" src="systems/eunos-blades/assets/animations/chat/lightning-ray.webp" />
      <img class="border-lightning left-lightning left-lightning-c" src="systems/eunos-blades/assets/animations/chat/lightning-ray.webp" />
    </div>`); */
}
export default registerSettings;
