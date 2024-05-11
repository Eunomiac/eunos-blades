/** TO RUN A PERFORMANCE PROFILE ON RULES:
 * (in Powershell) -- $env:TIMING=1; npx eslint .
 */

/** TO MODIFY SETTINGS VIA ENVIRONMENT VARIABLES:
 * (in Powershell) -- $env:DEPLOYING=true; $env:FAST_LINTING=false; npx eslint . --fix
 *
 * ENVIRONMENT VARIABLES & DEFAULTS:
 *
 *  - DEPLOYING = false;         // Toggle rule changes appropriate to package deployment.
 *  - ALL_RULES_ACTIVE = false;  // Toggle (most) inactive rules ON.
 *  - FAST_LINTING = true;       // Disables performance-hungry rules: import resolution, indentation, max-len, unused vars
 *  - TYPE_SCRIPT = true;        // Toggle TypeScript extensions of base ESLint rules.
 *  - FOUNDRY = true;            // Replaces General Rules with Foundry-Recommended Rules.
 *  - JSDOC = false;             // Adds JSDoc Rules governing Documentation
 *  - FIXING_COMMENTS = false;   // Include comments in style checking rules.
 *  - IS_FIX_TASK = false;       // Set to true when running fix tasks from VSCode's tasks.json.
 */

console.clear();

// Use environment variables to toggle linting behavior.
//  Note: Default values define in-IDE linting.

const DEPLOYING = process.env.DEPLOYING === "true";                // Default to false, true if explicitly set to "true"
const ALL_RULES_ACTIVE = process.env.ALL_RULES_ACTIVE === "true";  // Default to false, true if explicitly set to "true"
const FAST_LINTING = process.env.FAST_LINTING !== "false";         // Default to true unless explicitly set to "false"
const TYPE_SCRIPT = process.env.TYPE_SCRIPT !== "false";           // Default to true unless explicitly set to "false"
const TYPE_INFO = process.env.TYPE_INFO !== "false";               // Default to true unless explicitly set to "false"
const FOUNDRY = process.env.FOUNDRY !== "false";                   // Default to true unless explicitly set to "false"
const JSDOC = process.env.JSDOC === "true";                        // Default to false, true if explicitly set to "true"
const FIXING_COMMENTS = process.env.FIXING_COMMENTS === "true";    // Default to false, true if explicitly set to "true"
const IS_FIX_TASK = process.env.IS_FIX_TASK === "true";            // Default to false, true if explicitly set to "true"

const GLOBALCONSTANTS = [
  ["CONFIG", "CONST", "foundry", "game", "canvas", "ui"],
  [
    "ActiveEffect",
    "Actor",
    "ActorSheet",
    "Actors",
    "Application",
    "ChatMessage",
    "Dialog",
    "Draggable",
    "Folder",
    "FormDataExtended",
    "Handlebars",
    "Hooks",
    "Item",
    "ItemSheet",
    "Items",
    "Macro",
    "Roll",
    "TextureLoader",
    "TokenDocument",
    "User"
  ],
  [
    "duplicate",
    "fetchWithTimeout",
    "loadTemplates",
    "getTemplate",
    "mergeObject",
    "randomID",
    "renderTemplate",
    "setProperty",
    "srcExists",
    "isObjectEmpty",
    "expandObject",
    "flattenObject"
  ],
  [
    "DEFAULT_TOKEN"
  ]
].flat();

/*

  If ALLRULESACTIVE = true, any GENERALRULES set to '0' will instead "warn".
          To ensure the rule stays off, set it to "off" instead of '0'.

  */

const TYPE_INFO_RULES = {
  base: {
    "await-thenable":      "error",
    "no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          arguments: false
        }
      }
    ],
    "no-unnecessary-type-assertion": "warn",
    "prefer-readonly":               "error"
  },
  extensions: {
    "require-await": ["warn"]
  }
};

const TYPESCRIPTRULES = {
  // "@typescript-eslint"

  /* BASE: Rules that do not require changes to base ESLint rules. */
  base: {
    "array-type":         ["warn", {default: "array-simple"}],
    "ban-ts-comment":     0,
    "no-empty-interface": 0,
    // "no-explicit-any": "warn",

    "no-namespace":          "off",
    "no-non-null-assertion": "warn",
    "no-shadow":             "warn",
    "no-dupe-class-members": "error",
    "no-this-alias":         [
      "warn",
      {
        allowDestructuring: true,
        allowedNames:       ["self"]
      }
    ],
    "no-unnecessary-type-constraint": "warn",
    "no-unsafe-declaration-merging":  "off",
    ...TYPE_INFO ? TYPE_INFO_RULES.base : {}
  },

  /* EXTENSIONS: Rules that extend base ESLint rules.
        - When active, the ESLint-equivalent rule will be disabled.
        - All values must be of type = [tsValue: any, esLintOffValue?: any = "off"] */
  extensions: {
    "default-param-last": ["error"],
    // "no-unused-vars": "off"
    "no-unused-vars":     FAST_LINTING ? ["off"] : [
      ["warn", {argsIgnorePattern: "^_", varsIgnorePattern: "^_$"}]
    ],
    ...TYPE_INFO ? TYPE_INFO_RULES.extensions : {}
  },

  plugins: {
    "etc/no-assign-mutated-array": "off",
    "etc/no-deprecated":           "off",
    "etc/no-implicit-any-catch":   "off",
    "etc":                           {
      // eslint-plugin-etc
      "no-assign-mutated-array": "off",
      "no-commented-out-code":   "error",
      "no-const-enum":           "warn",
      "no-implicit-any-catch":   ["error", {allowExplicitAny: false}],
      "no-misused-generics":     "error",
      "prefer-interface":        [
        "error",
        {
          allowIntersection: true,
          allowLocal:        true
        }
      ],
      "prefer-less-than":    "warn",
      "underscore-internal": "warn",
      "throw-error":         "warn"
    }
  }
};
const GENERALRULES = {
  "accessor-pairs":        ["warn"],
  "array-callback-return": "warn",
  "array-element-newline": ["warn", "consistent"],
  "block-scoped-var":      "warn",
  "brace-style":           [
    "warn",
    "1tbs",
    {
      allowSingleLine: true
    }
  ],
  "capitalized-comments":   "off",
  "class-methods-use-this": 0,
  "comma-dangle":           ["warn", "never"],
  "consistent-return":      [
    "warn",
    {
      treatUndefinedAsUnspecified: false
    }
  ],
  "curly":                            "warn",
  "default-case":                   "warn",
  "default-param-last":             "off",
  "dot-notation":                   ["warn"],
  "eol-last":                       "off",
  "eqeqeq":                           ["warn", "always"],
  "func-names":                     0, // ["error", "as-needed"],
  "function-call-argument-newline": ["warn", "consistent"],
  "function-paren-newline":         "warn",
  "line-comment-position":          "off",
  "linebreak-style":                ["warn", "windows"],
  "lines-between-class-members":    0,
  "max-classes-per-file":           0,
  "max-len":                        "off",
  "max-lines-per-function":         "off",
  "max-params":                     "off",
  "max-statements":                 "off",
  "multiline-comment-style":        0,
  "multiline-ternary":              ["warn", "always-multiline"],
  "new-cap":                        [
    "error",
    {
      capIsNewExceptionPattern: "[A-Z]+"
    }
  ],
  "no-bitwise": [
    "error",
    {
      allow: ["~"]
    }
  ],
  "no-confusing-arrow": [
    "warn",
    {
      allowParens: true
    }
  ],
  "no-console":            0,
  "no-constant-condition": [
    "warn",
    {
      checkLoops: false
    }
  ],
  "no-continue":       0,
  "no-else-return":    0,
  "no-empty-function": 0,
  "no-eq-null":        "warn",
  "no-eval":           "warn",
  "no-extend-native":  0,
  "no-extra-bind":     "warn",
  "no-extra-parens":   [
    "warn",
    "all",
    {
      // Automatically disabled for TypeScript to allow "as" type assertions.
      conditionalAssign:           false,
      returnAssign:                false,
      enforceForArrowConditionals: false,
      nestedBinaryExpressions:     false
    }
  ],
  "no-floating-decimal":      "warn",
  "no-implicit-coercion":     "warn",
  "no-implicit-globals":      "warn",
  "no-implied-eval":          "warn",
  "no-inline-comments":       "off",
  "no-invalid-this":          0,
  "no-iterator":              "warn",
  "no-labels":                "warn",
  "no-lone-blocks":           "warn",
  "no-lonely-if":             0,
  "no-loop-func":             0,
  "no-magic-numbers":         "off", // ["error", {ignore: [-1, 0, 0.5, 1, 2]}],
  "no-mixed-operators":       "warn",
  "no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
  "no-multi-spaces":          [
    "warn",
    {
      ignoreEOLComments: true
    }
  ],
  "no-multi-str":                      "warn",
  "no-new":                            0,
  "no-param-reassign":                 0,
  "no-plusplus":                       0,
  "no-restricted-globals":             0,
  "no-restricted-syntax":              0,
  "no-return-assign":                  ["error", "except-parens"],
  "no-return-await":                   0, // Debugging is easier with this disabled, but comes with a performance hit.
  "no-tabs":                           0, /* ["warn", {    allowIndentationTabs: true
  }], */
  "no-template-curly-in-string":       "warn",
  "no-ternary":                        "off",
  "no-underscore-dangle":              0,
  "no-unreachable":                    0,
  "no-unused-vars":                    "off",
  "@typescript-eslint/no-unused-vars": "off",
  "no-use-before-define":              0,
  "no-useless-computed-key":           0,
  "no-useless-constructor":            0,
  "no-useless-escape":                 "warn",
  "no-void":                           0,
  "nonblock-statement-body-position":  ["warn", "below"],
  "object-curly-newline":              0,
  "one-var":                           0, /* ["warn", {    "var": "always",
    "let": "consecutive",
    "const": "never"
  }], */
  "one-var-declaration-per-line":      0,
  "operator-linebreak":                ["warn", "before"],
  "padded-blocks":                     "off",
  "prefer-arrow-callback":             0, // "warn",
  "prefer-const":                      [
    "warn",
    {
      destructuring: "all"
    }
  ],
  "prefer-destructuring": 0, // "warn",
  "prefer-object-spread": "warn",
  "prefer-rest-params":   "error",
  "quotes":               [
    "warn",
    "double",
    {
      avoidEscape:           true,
      allowTemplateLiterals: false
    }
  ],
  "radix":           0,
  "require-await": "off",
  "semi":            [
    "warn",
    "always",
    {
      omitLastInOneLineBlock: true
    }
  ],
  "sort-keys": "off"
};

const PLUGINRULES = {
  import: { // eslint-plugin-import
    "named":                      0,
    "no-absolute-path":         "off",
    "no-cycle":                 0,
    "no-self-import":           "error",
    "no-unresolved":            "off",
    "no-useless-path-segments": "warn"
  }
};
const DEPLOYMENTRULES = {
  "import/no-cycle":         "warn",
  "multiline-comment-style": ["warn", "starred-block"],
  "no-console":              "error",
  "no-debugger":             "error",
  "no-empty-function":       "error",
  "no-prototype-builtins":   "error",
  "no-trailing-spaces":      ["error", {ignoreComments: true}],
  "no-unused-vars":          "error"
};
const DEPLOYMENTFIXRULES = {

  "array-bracket-spacing": ["warn", "never"],
  "func-call-spacing":     ["warn", "never"],
  "indent":                FAST_LINTING ? "off" : [
    "warn",
    2,
    {
      SwitchCase:               1,
      VariableDeclarator:       "first",
      // outerIIFEBody: 1,
      // MemberExpression: 1,
      FunctionDeclaration:      {parameters: "first"},
      FunctionExpression:       {parameters: "first"},
      // StaticBlock: {
      //   body: 1
      // },
      CallExpression:           {arguments: "first"},
      ArrayExpression:          "first",
      ObjectExpression:         "first",
      ImportDeclaration:        "first",
      flatTernaryExpressions:   true,
      offsetTernaryExpressions: true,
      ignoreComments:           true
    }
  ],
  "key-spacing":   [
    "warn",
    {
      multiLine: {
        beforeColon: false,
        afterColon:  true
      },
      singleLine: {
        beforeColon: false,
        afterColon:  true
      },
      align: {
        beforeColon: false,
        afterColon:  true,
        on:          "value",
        mode:        "minimum"
      }
    }
  ],
  "keyword-spacing":      ["warn", {overrides: {catch: {before: true, after: false} } }],
  "object-curly-spacing": ["warn", "never", {arraysInObjects: true, objectsInObjects: true}],
  "quote-props":          ["warn", "consistent-as-needed"],
  "semi-spacing":         "warn",
  "spaced-comment":       [
    "warn",
    "always",
    {
      line: {
        exceptions: ["*", "~", "DEVCODE", "!DEVCODE", "/ <reference"],
        markers:    ["~"]
      },
      block: {
        exceptions: ["*", "~", "*~", "DEVCODE", "!DEVCODE"],
        markers:    ["~", "*~"],
        balanced:   true
      }
    }
  ],
  "space-before-function-paren": [
    "warn",
    {
      anonymous:  "never",
      named:      "never",
      asyncArrow: "always"
    }
  ],
  "space-unary-ops": ["warn", {words: true, nonwords: false}]
};

/*

  If ISSTRICTFOUNDRY = true, any FOUNDRYRULES set to '0' will instead "warn".
    (To disable an annoying Foundry rule for development, set it to '0'.)

  */

const FOUNDRYRULES = {
  "array-callback-return":         "warn",
  "arrow-spacing":                 "warn",
  "comma-dangle":                  ["warn", "never"],
  "comma-style":                   "warn",
  "computed-property-spacing":     "warn",
  "constructor-super":             "error",
  "default-param-last":            "warn",
  "dot-location":                  ["warn", "property"],
  "eol-last":                      "off",
  "eqeqeq":                          ["warn", "smart"],
  "func-names":                    ["warn", "never"],
  "getter-return":                 "warn",
  "lines-between-class-members":   0, // "warn"
  "new-parens":                    ["warn", "always"],
  "no-alert":                      "warn",
  "no-array-constructor":          "warn",
  "no-class-assign":               "warn",
  "no-compare-neg-zero":           "warn",
  "no-cond-assign":                "warn",
  "no-const-assign":               "error",
  "no-constant-condition":         "warn",
  "no-constructor-return":         "warn",
  "no-delete-var":                 "warn",
  "no-dupe-args":                  "warn",
  "no-dupe-class-members":         0, // "warn",
  "no-dupe-keys":                  "warn",
  "no-duplicate-case":             "warn",
  "no-duplicate-imports":          ["warn", {includeExports: true}],
  "no-empty":                      ["warn", {allowEmptyCatch: true}],
  "no-empty-character-class":      "warn",
  "no-empty-pattern":              "warn",
  "no-func-assign":                "warn",
  "no-global-assign":              "warn",
  "no-implicit-coercion":          ["warn", {allow: ["!!"] }],
  "no-implied-eval":               "warn",
  "no-import-assign":              "warn",
  "no-invalid-regexp":             "warn",
  "no-irregular-whitespace":       "warn",
  "no-iterator":                   "warn",
  "no-lone-blocks":                "warn",
  "no-lonely-if":                  "warn",
  "no-loop-func":                  "warn",
  "no-misleading-character-class": "warn",
  "no-mixed-operators":            "warn",
  "no-multi-str":                  "warn",
  "no-new-func":                   "warn",
  "no-new-object":                 "warn",
  "no-new-symbol":                 "warn",
  "no-new-wrappers":               "warn",
  "no-nonoctal-decimal-escape":    "warn",
  "no-obj-calls":                  "warn",
  "no-octal":                      "warn",
  "no-octal-escape":               "warn",
  "no-promise-executor-return":    "warn",
  "no-proto":                      "warn",
  "no-regex-spaces":               "warn",
  "no-script-url":                 "warn",
  "no-self-assign":                "warn",
  "no-self-compare":               "warn",
  "no-setter-return":              "warn",
  "no-sequences":                  "warn",
  "no-shadow":                     0, // ["error", {"allow": ["enum"]}],
  "no-template-curly-in-string":   "warn",
  "no-this-before-super":          "error",
  "no-unexpected-multiline":       "warn",
  "no-unmodified-loop-condition":  "warn",
  "no-unneeded-ternary":           "warn",
  "no-unreachable":                "warn",
  "no-unreachable-loop":           "warn",
  "no-unsafe-negation":            ["warn", {enforceForOrderingRelations: true}],
  "no-unsafe-optional-chaining":   ["warn", {disallowArithmeticOperators: true}],
  "no-unused-expressions":         "warn",
  "no-useless-backreference":      "warn",
  "no-useless-call":               "warn",
  "no-useless-catch":              "warn",
  "no-useless-computed-key":       ["warn", {enforceForClassMembers: true}],
  "no-useless-concat":             "warn",
  "no-useless-constructor":        "warn",
  "no-useless-rename":             "warn",
  "no-useless-return":             "warn",
  "no-var":                        "warn",
  "no-void":                       ["warn", {allowAsStatement: true}], // "warn",
  "no-whitespace-before-property": "warn",
  "prefer-numeric-literals":       "warn",
  "prefer-object-spread":          "warn",
  "prefer-regex-literals":         "warn",
  "prefer-spread":                 "warn",
  "rest-spread-spacing":           ["warn", "never"],
  "semi-style":                    ["warn", "last"],
  "switch-colon-spacing":          "warn",
  "symbol-description":            "warn",
  "template-curly-spacing":        ["warn", "never"],
  "unicode-bom":                   ["warn", "never"],
  "use-isnan":                     ["warn", {enforceForSwitchCase: true, enforceForIndexOf: true}],
  "valid-typeof":                  ["warn", {requireStringLiterals: true}],
  "wrap-iife":                     ["warn", "inside"],
  "arrow-parens":                  ["warn", "always"],
  "capitalized-comments":          FIXING_COMMENTS
    ? ["warn", "always", {
      ignoreConsecutiveComments: true,
      ignorePattern:             "noinspection"
    }]
    : "off",
  "comma-spacing": "warn",
  "dot-notation":  "warn",
  "max-len":       FAST_LINTING ? "off" : ["warn", {
    code:                   120,
    ignoreComments:         !FIXING_COMMENTS,
    ignoreTrailingComments: true,
    ignoreUrls:             true,
    ignoreStrings:          true,
    ignoreTemplateLiterals: true
  }],
  "no-extra-boolean-cast":            ["warn", {enforceForLogicalOperands: true}],
  "no-extra-semi":                    "warn",
  "no-multi-spaces":                  ["warn", {ignoreEOLComments: true}],
  "no-tabs":                          "warn",
  "no-throw-literal":                 "error",
  "no-useless-escape":                "warn",
  "nonblock-statement-body-position": ["warn", "beside"],
  "one-var":                          ["warn", "never"],
  "operator-linebreak":               ["warn", "before", {
    overrides: {"=": "after", "+=": "after", "-=": "after"}
  }],
  "prefer-template":               "warn",
  "quotes":                        ["warn", "double", {avoidEscape: true, allowTemplateLiterals: false}],
  "semi":                          "warn",
  "space-before-blocks":         ["warn", "always"]
};
const JSDOCRULES = {
  "jsdoc/check-access":                            "warn",
  "jsdoc/check-alignment":                         "warn",
  "jsdoc/check-examples":                          "off",
  "jsdoc/check-indentation":                       "off",
  "jsdoc/check-line-alignment":                    "off",
  "jsdoc/check-param-names":                       "warn",
  "jsdoc/check-property-names":                    "warn",
  "jsdoc/check-syntax":                            "off",
  "jsdoc/check-tag-names":                         ["warn", {definedTags: ["category"] }],
  "jsdoc/check-types":                             "warn",
  "jsdoc/check-values":                            "warn",
  "jsdoc/empty-tags":                              "warn",
  "jsdoc/implements-on-classes":                   "warn",
  "jsdoc/match-description":                       "off",
  "jsdoc/newline-after-description":               "off",
  "jsdoc/no-bad-blocks":                           "warn",
  "jsdoc/no-defaults":                             "off",
  "jsdoc/no-types":                                "off",
  "jsdoc/no-undefined-types":                      "off",
  "jsdoc/require-description":                     "warn",
  "jsdoc/require-description-complete-sentence":   "off",
  "jsdoc/require-example":                         "off",
  "jsdoc/require-file-overview":                   "off",
  "jsdoc/require-hyphen-before-param-description": ["warn", "never"],
  "jsdoc/require-jsdoc":                           "warn",
  "jsdoc/require-param":                           "warn",
  "jsdoc/require-param-description":               "off",
  "jsdoc/require-param-name":                      "warn",
  "jsdoc/require-param-type":                      "warn",
  "jsdoc/require-property":                        "warn",
  "jsdoc/require-property-description":            "off",
  "jsdoc/require-property-name":                   "warn",
  "jsdoc/require-property-type":                   "warn",
  "jsdoc/require-returns":                         "off",
  "jsdoc/require-returns-check":                   "warn",
  "jsdoc/require-returns-description":             "off",
  "jsdoc/require-returns-type":                    "warn",
  "jsdoc/require-throws":                          "off",
  "jsdoc/require-yields":                          "warn",
  "jsdoc/require-yields-check":                    "warn",
  "jsdoc/valid-types":                             "off"
};

const RulesAssembly = FOUNDRY ? {...FOUNDRYRULES} : {...GENERALRULES, ...PLUGINRULES};

if (TYPE_SCRIPT) {
  RulesAssembly["no-extra-parens"] = "off"; // Have to turn off to allow TypeScript '(foo as <Type>)'-style notation.
  Object.assign(
    RulesAssembly,
    {"@typescript-eslint": TYPESCRIPTRULES.base}
  );
  Object.entries(TYPESCRIPTRULES.extensions)
    .forEach(([ruleName, [ruleVal, esLintOffVal]]) => {
      RulesAssembly["@typescript-eslint"][ruleName] = ruleVal;
      RulesAssembly[ruleName] = esLintOffVal ?? "off";
    });
}
if (JSDOC) {
  Object.assign(
    RulesAssembly,
    JSDOCRULES
  );
}
const allRules = {};
Object.keys(RulesAssembly).forEach((rule) => {
  if (RulesAssembly[rule] === 0) {
    allRules[rule] = "warn";
  }
});
const RULES = {
  ...(IS_FIX_TASK
    ? {
      "array-bracket-spacing": ["warn", "never"],
      "func-call-spacing":     ["warn", "never"],
      "indent":                  [
        "warn",
        2,
        {
          SwitchCase:               1,
          VariableDeclarator:       "first",
          // outerIIFEBody: 1,
          // MemberExpression: 1,
          FunctionDeclaration:      {parameters: "first"},
          FunctionExpression:       {parameters: "first"},
          // StaticBlock: {
          //   body: 1
          // },
          CallExpression:           {arguments: "first"},
          ArrayExpression:          "first",
          ObjectExpression:         "first",
          ImportDeclaration:        "first",
          flatTernaryExpressions:   true,
          offsetTernaryExpressions: true,
          ignoreComments:           true
        }
      ],
      "key-spacing":   [
        "warn",
        {
          multiLine: {
            beforeColon: false,
            afterColon:  true
          },
          singleLine: {
            beforeColon: false,
            afterColon:  true
          },
          align: {
            beforeColon: false,
            afterColon:  true,
            on:          "value",
            mode:        "minimum"
          }
        }
      ],
      "keyword-spacing":          ["warn", {overrides: {catch: {before: true, after: false} } }],
      "no-mixed-spaces-and-tabs": ["warn"],
      "no-multiple-empty-lines":  ["warn", {max: 2, maxEOF: 0, maxBOF: 0}],
      "no-trailing-spaces":       ["warn"],
      "object-curly-spacing":     ["warn", "never", {arraysInObjects: true, objectsInObjects: true}],
      "quote-props":              ["warn", "consistent-as-needed"],
      "semi-spacing":             "warn",
      "spaced-comment":           [
        "warn",
        "always",
        {
          line: {
            exceptions: ["*", "~", "DEVCODE", "!DEVCODE", "/ <reference"],
            markers:    ["~"]
          },
          block: {
            exceptions: ["*", "~", "*~", "DEVCODE", "!DEVCODE"],
            markers:    ["~", "*~"],
            balanced:   true
          }
        }
      ],
      "space-before-function-paren": [
        "warn",
        {
          anonymous:  "never",
          named:      "never",
          asyncArrow: "always"
        }
      ],
      "space-unary-ops": ["warn", {words: true, nonwords: false}]
    }
    : {
      ...RulesAssembly,
      ...(ALL_RULES_ACTIVE ? allRules : {}),
      ...DEPLOYMENTFIXRULES,
      ...(DEPLOYING ? DEPLOYMENTRULES : {})
    }
  ),
  "etc/no-assign-mutated-array": "off",
  "etc/no-deprecated":           "off",
  "etc/no-implicit-any-catch":   "off",
  "etc/no-internal":             "off"
};

Object.entries(RULES).forEach(([key, val]) => {
  if (val && !Array.isArray(val) && typeof val === "object") {
    Object.entries(val).forEach(([subKey, subVal]) => (RULES[`${key}/${subKey}`] = subVal));
    delete RULES[key];
  }
});

// Create a separate RULES object for JavaScript files
const JSRULES = {...RULES};
for (const rule in JSRULES) {
  if (rule.startsWith("@typescript-eslint")) {
    delete JSRULES[rule]; // remove TypeScript rules
  }
}

const EXPORTS = {
  root: true,
  env:  {
    browser: true,
    es2022:  true,
    node:    true,
    jquery:  true
  },
  ignorePatterns: ["./.eslintrc.cjs"],
  plugins:        ["import", "@typescript-eslint", "jsdoc", "etc"],
  extends:        [
    ALL_RULES_ACTIVE ? "eslint:all" : "eslint:recommended",
    ...(FAST_LINTING ? [] : ["plugin:import/recommended"]),
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:etc/recommended"
  ],
  parser:        "@typescript-eslint/parser",
  parserOptions: {
    project:                     true,
    requireConfigFile:           false,
    tsconfigRootDir:             __dirname,
    ecmaVersion:                 2022,
    sourceType:                  "module",
    allowImportExportEverywhere: false,
    codeFrame:                   false,
    createDefaultProgram:        true,
    ecmaFeatures:                {
      ts:            true,
      jsx:           false,
      impliedStrict: true
    }
  },
  reportUnusedDisableDirectives: DEPLOYING,
  rules:                         RULES,
  globals:                       /* ISTYPESCRIPT ? {} : */ Object.fromEntries(
    GLOBALCONSTANTS.map((constant) => [constant, "readonly"])
  ),
  overrides: [
    // {
    //   // Specify the folders you want ESLint to lint
    //   files: [
    //     "eunos-blades/**/*.{js,ts,tsx}",
    //     "app/**/*.{js,ts,tsx}",
    //     "snippets/**/*.{js,ts,tsx}",
    //     ".Webpack CODING/**/*.{js,ts,tsx}",
    //     "!!VSC_Custom_CSS/**/*.{js,ts,tsx}"
    //   ]
    // },
    {
      files:         [".eslintrc.cjs", "*.js"],
      plugins:       ["import"],
      extends:       [],
      parser:        "espree", // use the default parser for JavaScript files
      parserOptions: {
        project: undefined
      },
      rules: {
        ...JSRULES,
        "@typescript-eslint/*": "off"
      }
    }
  ],
  settings: {
    "import/resolver": {
      node: {
        paths:      ["./ts"], // replace this with the actual path to your TypeScript files
        extensions: [".ts", ".tsx", ".d.ts"] // specify TypeScript extensions
      },
      typescript: {
        // Always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        alwaysTryTypes: true,

        // Path to a TypeScript configuration file
        // Specify the path to your project's tsconfig.json
        project: "./tsconfig.json"
      }
    }
  }
};

console.log(JSON.stringify(EXPORTS, null, 2));

module.exports = EXPORTS;
// module.exports = {
//   root: true,
//   env:  {
//     browser: true,
//     es2022:  true,
//     node:    true,
//     jquery:  true
//   },
//   ignorePatterns: [
//     "./.eslintrc.cjs"
//   ],
//   plugins: [
//     "import",
//     "@typescript-eslint",
//     "jsdoc",
//     "etc"
//   ],
//   extends: [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/eslint-recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:@typescript-eslint/recommended-type-checked",
//     "plugin:@typescript-eslint/stylistic",
//     "plugin:@typescript-eslint/stylistic-type-checked",
//     "plugin:etc/recommended"
//   ],
//   parser:        "@typescript-eslint/parser",
//   parserOptions: {
//     project:                     true,
//     requireConfigFile:           false,
//     tsconfigRootDir:             "D:\\Projects\\.CODING\\FoundryVTT\\Foundryv11DevData\\Data\\systems\\eunos-blades",
//     ecmaVersion:                 2022,
//     sourceType:                  "module",
//     allowImportExportEverywhere: false,
//     codeFrame:                   false,
//     createDefaultProgram:        true,
//     ecmaFeatures:                {
//       ts:            true,
//       jsx:           false,
//       impliedStrict: true
//     }
//   },
//   reportUnusedDisableDirectives: false,
//   rules:                         {
//     "array-callback-return": "warn",
//     "arrow-spacing":         "warn",
//     "comma-dangle":          [
//       "warn",
//       "never"
//     ],
//     "comma-style":               "warn",
//     "computed-property-spacing": "warn",
//     "constructor-super":         "error",
//     "default-param-last":        "off",
//     "dot-location":              [
//       "warn",
//       "property"
//     ],
//     "eol-last": "off",
//     "eqeqeq":   [
//       "warn",
//       "smart"
//     ],
//     "func-names": [
//       "warn",
//       "never"
//     ],
//     "getter-return":               "warn",
//     "lines-between-class-members": 0,
//     "new-parens":                  [
//       "warn",
//       "always"
//     ],
//     "no-alert":              "warn",
//     "no-array-constructor":  "warn",
//     "no-class-assign":       "warn",
//     "no-compare-neg-zero":   "warn",
//     "no-cond-assign":        "warn",
//     "no-const-assign":       "error",
//     "no-constant-condition": "warn",
//     "no-constructor-return": "warn",
//     "no-delete-var":         "warn",
//     "no-dupe-args":          "warn",
//     "no-dupe-class-members": 0,
//     "no-dupe-keys":          "warn",
//     "no-duplicate-case":     "warn",
//     "no-duplicate-imports":  [
//       "warn",
//       {
//         includeExports: true
//       }
//     ],
//     "no-empty": [
//       "warn",
//       {
//         allowEmptyCatch: true
//       }
//     ],
//     "no-empty-character-class": "warn",
//     "no-empty-pattern":         "warn",
//     "no-func-assign":           "warn",
//     "no-global-assign":         "warn",
//     "no-implicit-coercion":     [
//       "warn",
//       {
//         allow: [
//           "!!"
//         ]
//       }
//     ],
//     "no-implied-eval":               "warn",
//     "no-import-assign":              "warn",
//     "no-invalid-regexp":             "warn",
//     "no-irregular-whitespace":       "warn",
//     "no-iterator":                   "warn",
//     "no-lone-blocks":                "warn",
//     "no-lonely-if":                  "warn",
//     "no-loop-func":                  "warn",
//     "no-misleading-character-class": "warn",
//     "no-mixed-operators":            "warn",
//     "no-multi-str":                  "warn",
//     "no-new-func":                   "warn",
//     "no-new-object":                 "warn",
//     "no-new-symbol":                 "warn",
//     "no-new-wrappers":               "warn",
//     "no-nonoctal-decimal-escape":    "warn",
//     "no-obj-calls":                  "warn",
//     "no-octal":                      "warn",
//     "no-octal-escape":               "warn",
//     "no-promise-executor-return":    "warn",
//     "no-proto":                      "warn",
//     "no-regex-spaces":               "warn",
//     "no-script-url":                 "warn",
//     "no-self-assign":                "warn",
//     "no-self-compare":               "warn",
//     "no-setter-return":              "warn",
//     "no-sequences":                  "warn",
//     "no-shadow":                     0,
//     "no-template-curly-in-string":   "warn",
//     "no-this-before-super":          "error",
//     "no-unexpected-multiline":       "warn",
//     "no-unmodified-loop-condition":  "warn",
//     "no-unneeded-ternary":           "warn",
//     "no-unreachable":                "warn",
//     "no-unreachable-loop":           "warn",
//     "no-unsafe-negation":            [
//       "warn",
//       {
//         enforceForOrderingRelations: true
//       }
//     ],
//     "no-unsafe-optional-chaining": [
//       "warn",
//       {
//         disallowArithmeticOperators: true
//       }
//     ],
//     "no-unused-expressions":    "warn",
//     "no-useless-backreference": "warn",
//     "no-useless-call":          "warn",
//     "no-useless-catch":         "warn",
//     "no-useless-computed-key":  [
//       "warn",
//       {
//         enforceForClassMembers: true
//       }
//     ],
//     "no-useless-concat":      "warn",
//     "no-useless-constructor": "warn",
//     "no-useless-rename":      "warn",
//     "no-useless-return":      "warn",
//     "no-var":                 "warn",
//     "no-void":                [
//       "warn",
//       {
//         allowAsStatement: true
//       }
//     ],
//     "no-whitespace-before-property": "warn",
//     "prefer-numeric-literals":       "warn",
//     "prefer-object-spread":          "warn",
//     "prefer-regex-literals":         "warn",
//     "prefer-spread":                 "warn",
//     "rest-spread-spacing":           [
//       "warn",
//       "never"
//     ],
//     "semi-style": [
//       "warn",
//       "last"
//     ],
//     "switch-colon-spacing":   "warn",
//     "symbol-description":     "warn",
//     "template-curly-spacing": [
//       "warn",
//       "never"
//     ],
//     "unicode-bom": [
//       "warn",
//       "never"
//     ],
//     "use-isnan": [
//       "warn",
//       {
//         enforceForSwitchCase: true,
//         enforceForIndexOf:    true
//       }
//     ],
//     "valid-typeof": [
//       "warn",
//       {
//         requireStringLiterals: true
//       }
//     ],
//     "wrap-iife": [
//       "warn",
//       "inside"
//     ],
//     "arrow-parens": [
//       "warn",
//       "always"
//     ],
//     "capitalized-comments":  "off",
//     "comma-spacing":         "warn",
//     "dot-notation":          "warn",
//     "max-len":               "off",
//     "no-extra-boolean-cast": [
//       "warn",
//       {
//         enforceForLogicalOperands: true
//       }
//     ],
//     "no-extra-semi":   "warn",
//     "no-multi-spaces": [
//       "warn",
//       {
//         ignoreEOLComments: true
//       }
//     ],
//     "no-tabs":                          "warn",
//     "no-throw-literal":                 "error",
//     "no-useless-escape":                "warn",
//     "nonblock-statement-body-position": [
//       "warn",
//       "beside"
//     ],
//     "one-var": [
//       "warn",
//       "never"
//     ],
//     "operator-linebreak": [
//       "warn",
//       "before",
//       {
//         overrides: {
//           "=":  "after",
//           "+=": "after",
//           "-=": "after"
//         }
//       }
//     ],
//     "prefer-template": "warn",
//     "quotes":          [
//       "warn",
//       "double",
//       {
//         avoidEscape:           true,
//         allowTemplateLiterals: false
//       }
//     ],
//     "semi":                "warn",
//     "space-before-blocks": [
//       "warn",
//       "always"
//     ],
//     "no-extra-parens":       "off",
//     "no-unused-vars":        "off",
//     "require-await":         "off",
//     "array-bracket-spacing": [
//       "warn",
//       "never"
//     ],
//     "func-call-spacing": [
//       "warn",
//       "never"
//     ],
//     "indent":      "off",
//     "key-spacing": [
//       "warn",
//       {
//         multiLine: {
//           beforeColon: false,
//           afterColon:  true
//         },
//         singleLine: {
//           beforeColon: false,
//           afterColon:  true
//         },
//         align: {
//           beforeColon: false,
//           afterColon:  true,
//           on:          "value",
//           mode:        "minimum"
//         }
//       }
//     ],
//     "keyword-spacing": [
//       "warn",
//       {
//         overrides: {
//           catch: {
//             before: true,
//             after:  false
//           }
//         }
//       }
//     ],
//     "object-curly-spacing": [
//       "warn",
//       "never",
//       {
//         arraysInObjects:  true,
//         objectsInObjects: true
//       }
//     ],
//     "quote-props": [
//       "warn",
//       "consistent-as-needed"
//     ],
//     "semi-spacing":   "warn",
//     "spaced-comment": [
//       "warn",
//       "always",
//       {
//         line: {
//           exceptions: [
//             "*",
//             "~",
//             "DEVCODE",
//             "!DEVCODE",
//             "/ <reference"
//           ],
//           markers: [
//             "~"
//           ]
//         },
//         block: {
//           exceptions: [
//             "*",
//             "~",
//             "*~",
//             "DEVCODE",
//             "!DEVCODE"
//           ],
//           markers: [
//             "~",
//             "*~"
//           ],
//           balanced: true
//         }
//       }
//     ],
//     "space-before-function-paren": [
//       "warn",
//       {
//         anonymous:  "never",
//         named:      "never",
//         asyncArrow: "always"
//       }
//     ],
//     "space-unary-ops": [
//       "warn",
//       {
//         words:    true,
//         nonwords: false
//       }
//     ],
//     "etc/no-assign-mutated-array":   "off",
//     "etc/no-deprecated":             "off",
//     "etc/no-implicit-any-catch":     "off",
//     "etc/no-internal":               "off",
//     "@typescript-eslint/array-type": [
//       "warn",
//       {
//         default: "array-simple"
//       }
//     ],
//     "@typescript-eslint/ban-ts-comment":        0,
//     "@typescript-eslint/no-empty-interface":    0,
//     "@typescript-eslint/no-namespace":          "off",
//     "@typescript-eslint/no-non-null-assertion": "warn",
//     "@typescript-eslint/no-shadow":             "warn",
//     "@typescript-eslint/no-dupe-class-members": "error",
//     "@typescript-eslint/no-this-alias":         [
//       "warn",
//       {
//         allowDestructuring: true,
//         allowedNames:       [
//           "self"
//         ]
//       }
//     ],
//     "@typescript-eslint/no-unnecessary-type-constraint": "warn",
//     "@typescript-eslint/no-unsafe-declaration-merging":  "off",
//     "@typescript-eslint/await-thenable":                 "error",
//     "@typescript-eslint/no-misused-promises":            [
//       "error",
//       {
//         checksVoidReturn: {
//           arguments: false
//         }
//       }
//     ],
//     "@typescript-eslint/no-unnecessary-type-assertion": "warn",
//     "@typescript-eslint/prefer-readonly":               "error",
//     "@typescript-eslint/default-param-last":            "error",
//     "@typescript-eslint/no-unused-vars":                "off",
//     "@typescript-eslint/require-await":                 "warn"
//   },
//   globals: {
//     CONFIG:           "readonly",
//     CONST:            "readonly",
//     foundry:          "readonly",
//     game:             "readonly",
//     canvas:           "readonly",
//     ui:               "readonly",
//     ActiveEffect:     "readonly",
//     Actor:            "readonly",
//     ActorSheet:       "readonly",
//     Actors:           "readonly",
//     Application:      "readonly",
//     BladesHelpers:    "readonly",
//     ChatMessage:      "readonly",
//     Dialog:           "readonly",
//     Draggable:        "readonly",
//     Folder:           "readonly",
//     FormDataExtended: "readonly",
//     Handlebars:       "readonly",
//     Hooks:            "readonly",
//     Item:             "readonly",
//     ItemSheet:        "readonly",
//     Items:            "readonly",
//     Macro:            "readonly",
//     Roll:             "readonly",
//     TextureLoader:    "readonly",
//     TokenDocument:    "readonly",
//     User:             "readonly",
//     duplicate:        "readonly",
//     fetchWithTimeout: "readonly",
//     loadTemplates:    "readonly",
//     getTemplate:      "readonly",
//     mergeObject:      "readonly",
//     randomID:         "readonly",
//     renderTemplate:   "readonly",
//     setProperty:      "readonly",
//     srcExists:        "readonly",
//     isObjectEmpty:    "readonly",
//     expandObject:     "readonly",
//     flattenObject:    "readonly",
//     DEFAULT_TOKEN:    "readonly"
//   },
//   // "overrides": [
//   //   {
//   //     "files": [
//   //       ".eslintrc.cjs",
//   //       "*.js"
//   //     ],
//   //     "plugins": [
//   //       "import"
//   //     ],
//   //     "extends": [],
//   //     "parser": "@typescript-eslint/parser",
//   //     "parserOptions": {},
//   //     "project": true,
//   //     "rules": {
//   //       "array-callback-return": "warn",
//   //       "arrow-spacing": "warn",
//   //       "comma-dangle": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "comma-style": "warn",
//   //       "computed-property-spacing": "warn",
//   //       "constructor-super": "error",
//   //       "default-param-last": "off",
//   //       "dot-location": [
//   //         "warn",
//   //         "property"
//   //       ],
//   //       "eol-last": "off",
//   //       "eqeqeq": [
//   //         "warn",
//   //         "smart"
//   //       ],
//   //       "func-names": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "getter-return": "warn",
//   //       "lines-between-class-members": 0,
//   //       "new-parens": [
//   //         "warn",
//   //         "always"
//   //       ],
//   //       "no-alert": "warn",
//   //       "no-array-constructor": "warn",
//   //       "no-class-assign": "warn",
//   //       "no-compare-neg-zero": "warn",
//   //       "no-cond-assign": "warn",
//   //       "no-const-assign": "error",
//   //       "no-constant-condition": "warn",
//   //       "no-constructor-return": "warn",
//   //       "no-delete-var": "warn",
//   //       "no-dupe-args": "warn",
//   //       "no-dupe-class-members": 0,
//   //       "no-dupe-keys": "warn",
//   //       "no-duplicate-case": "warn",
//   //       "no-duplicate-imports": [
//   //         "warn",
//   //         {
//   //           "includeExports": true
//   //         }
//   //       ],
//   //       "no-empty": [
//   //         "warn",
//   //         {
//   //           "allowEmptyCatch": true
//   //         }
//   //       ],
//   //       "no-empty-character-class": "warn",
//   //       "no-empty-pattern": "warn",
//   //       "no-func-assign": "warn",
//   //       "no-global-assign": "warn",
//   //       "no-implicit-coercion": [
//   //         "warn",
//   //         {
//   //           "allow": [
//   //             "!!"
//   //           ]
//   //         }
//   //       ],
//   //       "no-implied-eval": "warn",
//   //       "no-import-assign": "warn",
//   //       "no-invalid-regexp": "warn",
//   //       "no-irregular-whitespace": "warn",
//   //       "no-iterator": "warn",
//   //       "no-lone-blocks": "warn",
//   //       "no-lonely-if": "warn",
//   //       "no-loop-func": "warn",
//   //       "no-misleading-character-class": "warn",
//   //       "no-mixed-operators": "warn",
//   //       "no-multi-str": "warn",
//   //       "no-new-func": "warn",
//   //       "no-new-object": "warn",
//   //       "no-new-symbol": "warn",
//   //       "no-new-wrappers": "warn",
//   //       "no-nonoctal-decimal-escape": "warn",
//   //       "no-obj-calls": "warn",
//   //       "no-octal": "warn",
//   //       "no-octal-escape": "warn",
//   //       "no-promise-executor-return": "warn",
//   //       "no-proto": "warn",
//   //       "no-regex-spaces": "warn",
//   //       "no-script-url": "warn",
//   //       "no-self-assign": "warn",
//   //       "no-self-compare": "warn",
//   //       "no-setter-return": "warn",
//   //       "no-sequences": "warn",
//   //       "no-shadow": 0,
//   //       "no-template-curly-in-string": "warn",
//   //       "no-this-before-super": "error",
//   //       "no-unexpected-multiline": "warn",
//   //       "no-unmodified-loop-condition": "warn",
//   //       "no-unneeded-ternary": "warn",
//   //       "no-unreachable": "warn",
//   //       "no-unreachable-loop": "warn",
//   //       "no-unsafe-negation": [
//   //         "warn",
//   //         {
//   //           "enforceForOrderingRelations": true
//   //         }
//   //       ],
//   //       "no-unsafe-optional-chaining": [
//   //         "warn",
//   //         {
//   //           "disallowArithmeticOperators": true
//   //         }
//   //       ],
//   //       "no-unused-expressions": "warn",
//   //       "no-useless-backreference": "warn",
//   //       "no-useless-call": "warn",
//   //       "no-useless-catch": "warn",
//   //       "no-useless-computed-key": [
//   //         "warn",
//   //         {
//   //           "enforceForClassMembers": true
//   //         }
//   //       ],
//   //       "no-useless-concat": "warn",
//   //       "no-useless-constructor": "warn",
//   //       "no-useless-rename": "warn",
//   //       "no-useless-return": "warn",
//   //       "no-var": "warn",
//   //       "no-void": [
//   //         "warn",
//   //         {
//   //           "allowAsStatement": true
//   //         }
//   //       ],
//   //       "no-whitespace-before-property": "warn",
//   //       "prefer-numeric-literals": "warn",
//   //       "prefer-object-spread": "warn",
//   //       "prefer-regex-literals": "warn",
//   //       "prefer-spread": "warn",
//   //       "rest-spread-spacing": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "semi-style": [
//   //         "warn",
//   //         "last"
//   //       ],
//   //       "switch-colon-spacing": "warn",
//   //       "symbol-description": "warn",
//   //       "template-curly-spacing": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "unicode-bom": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "use-isnan": [
//   //         "warn",
//   //         {
//   //           "enforceForSwitchCase": true,
//   //           "enforceForIndexOf": true
//   //         }
//   //       ],
//   //       "valid-typeof": [
//   //         "warn",
//   //         {
//   //           "requireStringLiterals": true
//   //         }
//   //       ],
//   //       "wrap-iife": [
//   //         "warn",
//   //         "inside"
//   //       ],
//   //       "arrow-parens": [
//   //         "warn",
//   //         "always"
//   //       ],
//   //       "capitalized-comments": "off",
//   //       "comma-spacing": "warn",
//   //       "dot-notation": "warn",
//   //       "max-len": "off",
//   //       "no-extra-boolean-cast": [
//   //         "warn",
//   //         {
//   //           "enforceForLogicalOperands": true
//   //         }
//   //       ],
//   //       "no-extra-semi": "warn",
//   //       "no-multi-spaces": [
//   //         "warn",
//   //         {
//   //           "ignoreEOLComments": true
//   //         }
//   //       ],
//   //       "no-tabs": "warn",
//   //       "no-throw-literal": "error",
//   //       "no-useless-escape": "warn",
//   //       "nonblock-statement-body-position": [
//   //         "warn",
//   //         "beside"
//   //       ],
//   //       "one-var": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "operator-linebreak": [
//   //         "warn",
//   //         "before",
//   //         {
//   //           "overrides": {
//   //             "=": "after",
//   //             "+=": "after",
//   //             "-=": "after"
//   //           }
//   //         }
//   //       ],
//   //       "prefer-template": "warn",
//   //       "quotes": [
//   //         "warn",
//   //         "double",
//   //         {
//   //           "avoidEscape": true,
//   //           "allowTemplateLiterals": false
//   //         }
//   //       ],
//   //       "semi": "warn",
//   //       "space-before-blocks": [
//   //         "warn",
//   //         "always"
//   //       ],
//   //       "no-extra-parens": "off",
//   //       "no-unused-vars": "off",
//   //       "require-await": "off",
//   //       "array-bracket-spacing": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "func-call-spacing": [
//   //         "warn",
//   //         "never"
//   //       ],
//   //       "indent": "off",
//   //       "key-spacing": [
//   //         "warn",
//   //         {
//   //           "multiLine": {
//   //             "beforeColon": false,
//   //             "afterColon": true
//   //           },
//   //           "singleLine": {
//   //             "beforeColon": false,
//   //             "afterColon": true
//   //           },
//   //           "align": {
//   //             "beforeColon": false,
//   //             "afterColon": true,
//   //             "on": "value",
//   //             "mode": "minimum"
//   //           }
//   //         }
//   //       ],
//   //       "keyword-spacing": [
//   //         "warn",
//   //         {
//   //           "overrides": {
//   //             "catch": {
//   //               "before": true,
//   //               "after": false
//   //             }
//   //           }
//   //         }
//   //       ],
//   //       "object-curly-spacing": [
//   //         "warn",
//   //         "never",
//   //         {
//   //           "arraysInObjects": true,
//   //           "objectsInObjects": true
//   //         }
//   //       ],
//   //       "quote-props": [
//   //         "warn",
//   //         "consistent-as-needed"
//   //       ],
//   //       "semi-spacing": "warn",
//   //       "spaced-comment": [
//   //         "warn",
//   //         "always",
//   //         {
//   //           "line": {
//   //             "exceptions": [
//   //               "*",
//   //               "~",
//   //               "DEVCODE",
//   //               "!DEVCODE",
//   //               "/ <reference"
//   //             ],
//   //             "markers": [
//   //               "~"
//   //             ]
//   //           },
//   //           "block": {
//   //             "exceptions": [
//   //               "*",
//   //               "~",
//   //               "*~",
//   //               "DEVCODE",
//   //               "!DEVCODE"
//   //             ],
//   //             "markers": [
//   //               "~",
//   //               "*~"
//   //             ],
//   //             "balanced": true
//   //           }
//   //         }
//   //       ],
//   //       "space-before-function-paren": [
//   //         "warn",
//   //         {
//   //           "anonymous": "never",
//   //           "named": "never",
//   //           "asyncArrow": "always"
//   //         }
//   //       ],
//   //       "space-unary-ops": [
//   //         "warn",
//   //         {
//   //           "words": true,
//   //           "nonwords": false
//   //         }
//   //       ],
//   //       "etc/no-assign-mutated-array": "off",
//   //       "etc/no-deprecated": "off",
//   //       "etc/no-implicit-any-catch": "off",
//   //       "etc/no-internal": "off",
//   //       "@typescript-eslint/*": "off"
//   //     }
//   //   }
//   // ],
//   settings: {
//     "import/resolver": {
//       node: {
//         paths: [
//           "./ts"
//         ],
//         extensions: [
//           ".ts",
//           ".tsx",
//           ".d.ts"
//         ]
//       },
//       typescript: {
//         alwaysTryTypes: true,
//         project:        "./tsconfig.json"
//       }
//     }
//   }
// };
