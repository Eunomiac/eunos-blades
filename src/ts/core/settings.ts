// #region IMPORTS ~
/* eslint-disable @typescript-eslint/no-unused-vars */
import U from "./utilities";
import C from "./constants";
import {UploadBladesPDF} from "./ai";
/* eslint-enable @typescript-eslint/no-unused-vars */
// #endregion ▮▮▮▮[IMPORTS]▮▮▮▮

// #region SubMenu FormApplication Definitions
class DebugSettingsSubmenu extends FormApplication {

  constructor(object = {}, formApplicationOptions = {}) {
    super(object, formApplicationOptions);
  }

  /**
 * Default Options for this FormApplication
 */
  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id:             "debug-settings-menu",
      title:          "Debug Settings",
      popOut:         true,
      template:       "systems/eunos-blades/templates/settings/debug-settings.hbs",
      classes:        ["eunos-blades", "settings"],
      width:          500,
      closeOnSubmit:  true,
      submitOnChange: false,
      submitOnClose:  true
    });
  }

  /**
  * Provide data to the template
  */
  override getData() {
    return game.settings.get("eunos-blades", "debugSettings") as FormApplication.Data<object>;
  }

  /**
   * Executes on form submission.
   * @param _event - the form submission event
   * @param formData - the form data
   */
  override async _updateObject(_event: Event, formData: Record<string, unknown>|undefined) {
    if (!formData) { return; }
    const data = expandObject(formData);
    game.settings.set("eunos-blades", "debugSettings", data);
  }
}

class OpenAISettingsSubmenu extends FormApplication {

  constructor(object = {}, formApplicationOptions = {}) {
    super(object, formApplicationOptions);
  }

  /**
 * Default Options for this FormApplication
 */
  static override get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id:             "openai-settings-menu",
      title:          "Open AI Settings",
      popOut:         true,
      template:       "systems/eunos-blades/templates/settings/openai-settings.hbs",
      classes:        ["eunos-blades", "settings"],
      width:          500,
      closeOnSubmit:  true,
      submitOnChange: false,
      submitOnClose:  true
    });
  }

  /**
  * Provide data to the template
  */
  override getData() {
    return game.settings.get("eunos-blades", "openAISettings") as FormApplication.Data<object>;
  }

  /**
   * Executes on form submission.
   * @param _event - the form submission event
   * @param formData - the form data
   */
  override async _updateObject(_event: Event, formData: Record<string, unknown>|undefined) {
    if (!formData) { return; }
    const data = expandObject(formData);
    game.settings.set("eunos-blades", "openAISettings", data);
  }

}
// class OpenAIFileUploadForm extends FormApplication {
//   constructor(object = {}, options = {}) {
//     super(object, options);
//   }

//   static override get defaultOptions() {
//     return mergeObject(super.defaultOptions, {
//       id: "openai-file-upload-form",
//       title: "Upload 'Blades in the Dark' PDF to OpenAI",
//       template: "systems/eunos-blades/templates/settings/openai-file-upload.hbs",
//       width: 400
//     });
//   }

//   // Add listeners to the form elements, specifically the file input and the submit button.
//   override activateListeners(html: JQuery<HTMLElement>) {
//     super.activateListeners(html);
//     const fileInput = html.find("input[type='file']");
//     const submitButton = html.find("button[type='submit']");
//     // Implement listeners as needed, for example, validating the file type
//   }

//   // This method handles the form submission.
//   async _updateObject(event: Event, formData: FormData) {
//     event.preventDefault();
//     const file = formData.get("file"); // Assuming your input's name is 'file'
//     if (file instanceof File) {
//       ui.notifications?.info("Uploading file to OpenAI...");
//       const fileID = await UploadBladesPDF(file);
//       if (fileID) {
//         game.settings.set("eunos-blades", "openAIBladesFile", fileID);
//       }
//       ui.notifications?.info("File upload complete!");
//     }
//   }
// }
// #endregion


const registerSettings = function() {

  // #region Debug Settings ~
  game.settings.registerMenu("eunos-blades", "debugSettingsMenu", {
    name:       "Debug Settings",
    label:      "Open Debug Settings",
    hint:       "Configure settings related to debugging.",
    icon:       "fa-duotone fa-ban-bug",
    type:       DebugSettingsSubmenu,
    restricted: true
  });
  game.settings.register("eunos-blades", "debugSettings", {
    scope:   "world",
    config:  false,
    type:    Object,
    default: {
      debugLevel: 3,
      debugHooks: false,
      whitelist:  "",
      blacklist:  ""
    }
  });
  // #endregion

  // #region AI Settings ~
  game.settings.registerMenu("eunos-blades", "openAISettingsMenu", {
    name:       "OpenAI Settings",
    label:      "Open AI Integration",
    hint:       "Configure settings related to integration with AI for content generation during play.",
    icon:       "fa-duotone fa-brain-circuit",
    type:       OpenAISettingsSubmenu,
    restricted: true
  });

  game.settings.register("eunos-blades", "openAISettings", {
    scope:   "world",
    config:  false,
    type:    Object,
    default: {
      apiKey: "",
      models: {
        text:   "gpt-3.5-turbo",
        speech: "tts-1-hd",
        image:  "gpt-4-vision-preview"
      },
      fileID: ""
    }
  });
  // #endregion

  /**
   * Track the system version upon which point a migration was last applied
   */
  game.settings.register("eunos-blades", "systemMigrationVersion", {
    name:    "System Migration Version",
    scope:   "world",
    config:  false,
    type:    Number,
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
      skin:                        "skin",
      skin_url:                    "systems/eunos-blades/tinymce/skin",
      content_css:                 `systems/eunos-blades/tinymce/content.css?${new Date().getTime()}`,
      font_css:                    "systems/eunos-blades/fonts.css",
      max_height:                  500,
      min_height:                  40,
      autoresize_overflow_padding: 0,
      autoresize_bottom_margin:    0, // 25,
      menubar:                     false,
      statusbar:                   false, // True,
      elementPath:                 true,
      branding:                    false,
      resize:                      false,
      plugins:                     "lists image table code save autoresize searchreplace quickbars template",
      save_enablewhendirty:        false,
      // Table_default_styles: {},
      style_formats:               [
        {
          title: "Headings",
          items: [
            {title: "Heading 1", block: "h1", wrapper: false},
            {title: "Heading 2", block: "h2", wrapper: false},
            {title: "Heading 3", block: "h3", wrapper: false},
            {title: "Heading 4", block: "h4", wrapper: false}
          ]
        },
        {
          title: "Blocks",
          items: [
            {title: "Paragraph", block: "p", wrapper: false},
            {title: "Block Quote", block: "blockquote", wrapper: true}
            // {title: "Secret", block: "span", classes: "text-secret", attributes: {"data-is-secret": "true"}, wrapper: false}
          ]
        },
        {
          title: "Inline",
          items: [
            {title: "Bold", inline: "b", wrapper: false},
            {title: "Italics", inline: "i", wrapper: false},
            {title: "Underline", inline: "u", wrapper: false},
            {title: "Secret", inline: "span", classes: "text-secret", attributes: {"data-is-secret": "true"}, wrapper: false}
          ]
        }
      ],
      style_formats_merge: false,
      toolbar:             "styles | searchreplace | formatting alignment lists elements | removeformat | code | save",
      toolbar_groups:      {
        formatting: {
          icon:    "color-picker",
          tooltip: "Formatting",
          items:   "bold italic underline"
        },
        alignment: {
          icon:    "align-left",
          tooltip: "Alignment",
          items:   "alignleft aligncenter alignright alignjustify | outdent indent"
        },
        lists: {
          icon:    "unordered-list",
          tooltip: "Lists",
          items:   "bullist numlist"
        },
        elements: {
          icon:    "duplicate",
          tooltip: "Insert Element",
          items:   "tableinsertdialog image hr | template"
        }
      },
      toolbar_mode:                "floating",
      quickbars_link_toolbar:      false,
      quickbars_selection_toolbar: "styles | bold italic underline",
      quickbars_insert_toolbar:    "hr image table",
      quickbars_table_toolbar:     "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol"
    }
  };
}

/**
 *
 */
export function initCanvasStyles() {
  CONFIG.canvasTextStyle = new PIXI.TextStyle({
    align:              "center",
    dropShadow:         true,
    dropShadowAngle:    U.degToRad(45),
    dropShadowBlur:     8,
    dropShadowColor:    C.Colors.BLACK,
    dropShadowDistance: 4,
    fill:               [
      C.Colors.bWHITE,
      C.Colors.bGREY
    ],
    fillGradientType:  1,
    fillGradientStops: [
      0,
      0.3
    ],
    fontFamily:      "Kirsty",
    fontSize:        32,
    letterSpacing:   2,
    lineHeight:      32,
    lineJoin:        "round",
    padding:         4,
    stroke:          C.Colors.dBLACK,
    strokeThickness: 3,
    trim:            true,
    whiteSpace:      "normal",
    wordWrap:        true,
    wordWrapWidth:   0.1
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
