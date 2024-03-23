const ISDEPLOYING = false; // Toggle rule changes appropriate to package deployment.
const ALLRULESACTIVE = false; // Toggle (most) inactive rules ON.

const ISTYPESCRIPT = true; // Toggle TypeScript extensions of base ESLint rules.
const ISFOUNDRY = true; // Replaces General Rules with Foundry-Recommended Rules.
// const ISSTRICTFOUNDRY = false; // Adheres to ALL Foundry rules, including the annoying ones you've manually disabled.
const ISJSDOC = false; // Adds JSDoc Rules governing Documentation
const ISFIXINGCOMMENTS = false; // Include comments in style checking rules.

const GLOBALCONSTANTS = [
  ["CONFIG", "CONST", "foundry", "game", "canvas", "ui"],
  [
    "ActiveEffect",
    "Actor",
    "ActorSheet",
    "Actors",
    "Application",
    "BladesHelpers",
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

const TYPESCRIPTRULES = {
  // "@typescript-eslint"

  /* BASE: Rules that do not require changes to base ESLint rules. */
  base: {
    "array-type": ["warn", { default: "array-simple" }],
    // "await-thenable": "error", // @@ REQUIRES CONFIGURED TYPE INFORMATION @@
    "ban-ts-comment": 0,
    "no-empty-interface": 0,
    // "no-explicit-any": "warn",
    "no-namespace": "off",
    "no-non-null-assertion": "warn",
    "no-shadow": "warn",
    "no-dupe-class-members": "error",
    "no-this-alias": [
      "warn",
      {
        allowDestructuring: true,
        allowedNames: ["self"]
      }
    ],
    // "no-unnecessary-type-assertion": "warn", // @@ REQUIRES CONFIGURED TYPE INFORMATION @@
    "no-unnecessary-type-constraint": "warn",
    "no-unsafe-declaration-merging": "off"
    // "prefer-readonly": "error", // @@ REQUIRES CONFIGURED TYPE INFORMATION @@
  },

  /* EXTENSIONS: Rules that extend base ESLint rules.
        - When active, the ESLint-equivalent rule will be disabled.
        - All values must be of type = [tsValue: any, esLintOffValue?: any = "off"] */
  extensions: {
    "default-param-last": ["error"]
    // "no-unused-vars": "off"
    // "no-unused-vars": [
    //   ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_$" }],
    // ],
    // "require-await": ["warn"], // @@ REQUIRES CONFIGURED TYPE INFORMATION @@
  },

  plugins: {
    "etc/no-assign-mutated-array": "off",
    "etc/no-deprecated": "off",
    "etc/no-implicit-any-catch": "off",
    etc: {
      // eslint-plugin-etc
      "no-assign-mutated-array": "off",
      "no-commented-out-code": "error",
      "no-const-enum": "warn",
      "no-implicit-any-catch": ["error", { allowExplicitAny: false }],
      "no-misused-generics": "error",
      "prefer-interface": [
        "error",
        {
          allowIntersection: true,
          allowLocal: true
        }
      ],
      "prefer-less-than": "warn",
      "underscore-internal": "warn",
      "throw-error": "warn"
    }
  }
};
const GENERALRULES = {
  "accessor-pairs": ["warn"],
  "array-callback-return": "warn",
  "array-element-newline": ["warn", "consistent"],
  "block-scoped-var": "warn",
  "brace-style": [
    "warn",
    "1tbs",
    {
      allowSingleLine: true
    }
  ],
  "capitalized-comments": "off",
  "class-methods-use-this": 0,
  "comma-dangle": ["warn", "never"],
  "consistent-return": [
    "warn",
    {
      treatUndefinedAsUnspecified: false
    }
  ],
  curly: "warn",
  "default-case": "warn",
  "default-param-last": "off",
  "dot-notation": ["warn"],
  "eol-last": 0,
  eqeqeq: ["warn", "always"],
  "func-names": 0, // ["error", "as-needed"],
  "function-call-argument-newline": ["warn", "consistent"],
  "function-paren-newline": "warn",
  // "indent": ["warn", 2, {
  //   ArrayExpression: "first",
  //   CallExpression: {
  //     arguments: "first"
  //   },
  //   FunctionDeclaration: {
  //     parameters: "first",
  //     body: 1
  //   },
  //   FunctionExpression: {
  //     parameters: "first",
  //     body: 1
  //   },
  //   ImportDeclaration: "first",
  //   MemberExpression: 1,
  //   ObjectExpression: "first",
  //   SwitchCase: 1,
  //   VariableDeclarator: "first",
  //   flatTernaryExpressions: true,
  //   ignoreComments: !ISFIXINGCOMMENTS,
  //   offsetTernaryExpressions: true,
  //   outerIIFEBody: 1
  // }],
  "line-comment-position": "off",
  "linebreak-style": ["warn", "windows"],
  "lines-between-class-members": 0,
  "max-classes-per-file": 0,
  "max-len": "off",
  "max-lines-per-function": "off",
  "max-params": "off",
  "max-statements": "off",
  "multiline-comment-style": 0,
  "multiline-ternary": ["warn", "always-multiline"],
  "new-cap": [
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
  "no-console": 0,
  "no-constant-condition": [
    "warn",
    {
      checkLoops: false
    }
  ],
  "no-continue": 0,
  "no-else-return": 0,
  "no-empty-function": 0,
  "no-eq-null": "warn",
  "no-eval": "warn",
  "no-extend-native": 0,
  "no-extra-bind": "warn",
  "no-extra-parens": [
    "warn",
    "all",
    {
      // Automatically disabled for TypeScript to allow "as" type assertions.
      conditionalAssign: false,
      returnAssign: false,
      enforceForArrowConditionals: false,
      nestedBinaryExpressions: false
    }
  ],
  "no-floating-decimal": "warn",
  "no-implicit-coercion": "warn",
  "no-implicit-globals": "warn",
  "no-implied-eval": "warn",
  "no-inline-comments": "off",
  "no-invalid-this": 0,
  "no-iterator": "warn",
  "no-labels": "warn",
  "no-lone-blocks": "warn",
  "no-lonely-if": 0,
  "no-loop-func": 0,
  "no-magic-numbers": "off", // ["error", {ignore: [-1, 0, 0.5, 1, 2]}],
  "no-mixed-operators": "warn",
  "no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
  "no-multi-spaces": [
    "warn",
    {
      ignoreEOLComments: true
    }
  ],
  "no-multi-str": "warn",
  "no-multiple-empty-lines": "warn",
  "no-new": 0,
  "no-param-reassign": 0,
  "no-plusplus": 0,
  "no-restricted-globals": 0,
  "no-restricted-syntax": 0,
  "no-return-assign": ["error", "except-parens"],
  "no-return-await": 0, // Debugging is easier with this disabled, but comes with a performance hit.
  "no-tabs": 0, /* ["warn", {    allowIndentationTabs: true
  }], */
  "no-template-curly-in-string": "warn",
  "no-ternary": "off",
  "no-trailing-spaces": "warn",
  "no-underscore-dangle": 0,
  "no-unreachable": 0,
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "no-use-before-define": 0,
  "no-useless-computed-key": 0,
  "no-useless-constructor": 0,
  "no-useless-escape": "warn",
  "no-void": 0,
  "nonblock-statement-body-position": ["warn", "below"],
  "object-curly-newline": 0,
  "object-curly-spacing": ["warn", "never"],
  "one-var": 0, /* ["warn", {    "var": "always",
    "let": "consecutive",
    "const": "never"
  }], */
  "one-var-declaration-per-line": 0,
  "operator-linebreak": ["warn", "before"],
  "padded-blocks": "off",
  "prefer-arrow-callback": 0, // "warn",
  "prefer-const": [
    "warn",
    {
      destructuring: "all"
    }
  ],
  "prefer-destructuring": 0, // "warn",
  "prefer-object-spread": "warn",
  "prefer-rest-params": "error",
  "quote-props": [
    "warn",
    "consistent-as-needed",
    {
      keywords: true
    }
  ],
  quotes: [
    "warn",
    "double",
    {
      avoidEscape: true,
      allowTemplateLiterals: false
    }
  ],
  radix: 0,
  "require-await": "off",
  semi: [
    "warn",
    "always",
    {
      omitLastInOneLineBlock: true
    }
  ],
  "sort-keys": "off", /*  ["warn", "asc", {    caseSensitive: true,
    natural: true,
    minKeys: 20
  }], */
  "space-before-function-paren": [
    "warn",
    {
      anonymous: "never",
      named: "never",
      asyncArrow: "always"
    }
  ],
  "spaced-comment": [
    "warn",
    "always",
    {
      line: {
        exceptions: ["*", "~", "DEVCODE", "!DEVCODE", "/ <reference"],
        markers: ["~"]
      },
      block: {
        exceptions: ["*", "~", "*~", "DEVCODE", "!DEVCODE"],
        markers: ["~", "*~"],
        balanced: true
      }
    }
  ]
};
const PLUGINRULES = {
  import: { // eslint-plugin-import
    named: 0,
    "no-absolute-path": "off",
    "no-cycle": 0,
    "no-self-import": "error",
    "no-unresolved": "off",
    "no-useless-path-segments": "warn"
  }
};
const DEPLOYMENTRULES = {
  "import/no-cycle": "warn",
  "multiline-comment-style": ["warn", "starred-block"],
  "no-console": "error",
  "no-debugger": "error",
  "no-empty-function": "error",
  "no-prototype-builtins": "error",
  "no-trailing-spaces": "error",
  "no-unused-vars": "error"
};

/*

  If ISSTRICTFOUNDRY = true, any FOUNDRYRULES set to '0' will instead "warn".
    (To disable an annoying Foundry rule for development, set it to '0'.)

  */

const FOUNDRYRULES = {
  "array-bracket-spacing": ["warn", "never"],
  "array-callback-return": "warn",
  "arrow-spacing": "warn",
  "comma-dangle": ["warn", "never"],
  "comma-style": "warn",
  "computed-property-spacing": "warn",
  "constructor-super": "error",
  "default-param-last": "warn",
  "dot-location": ["warn", "property"],
  "eol-last": ["error", "always"],
  eqeqeq: ["warn", "smart"],
  "func-call-spacing": "warn",
  "func-names": ["warn", "never"],
  "getter-return": "warn",
  "lines-between-class-members": 0, // "warn"
  "new-parens": ["warn", "always"],
  "no-alert": "warn",
  "no-array-constructor": "warn",
  "no-class-assign": "warn",
  "no-compare-neg-zero": "warn",
  "no-cond-assign": "warn",
  "no-const-assign": "error",
  "no-constant-condition": "warn",
  "no-constructor-return": "warn",
  "no-delete-var": "warn",
  "no-dupe-args": "warn",
  "no-dupe-class-members": 0, // "warn",
  "no-dupe-keys": "warn",
  "no-duplicate-case": "warn",
  "no-duplicate-imports": ["warn", {includeExports: true}],
  "no-empty": ["warn", {allowEmptyCatch: true}],
  "no-empty-character-class": "warn",
  "no-empty-pattern": "warn",
  "no-func-assign": "warn",
  "no-global-assign": "warn",
  "no-implicit-coercion": ["warn", {allow: ["!!"]}],
  "no-implied-eval": "warn",
  "no-import-assign": "warn",
  "no-invalid-regexp": "warn",
  "no-irregular-whitespace": "warn",
  "no-iterator": "warn",
  "no-lone-blocks": "warn",
  "no-lonely-if": "warn",
  "no-loop-func": "warn",
  "no-misleading-character-class": "warn",
  "no-mixed-operators": "warn",
  "no-multi-str": "warn",
  "no-multiple-empty-lines": "warn",
  "no-new-func": "warn",
  "no-new-object": "warn",
  "no-new-symbol": "warn",
  "no-new-wrappers": "warn",
  "no-nonoctal-decimal-escape": "warn",
  "no-obj-calls": "warn",
  "no-octal": "warn",
  "no-octal-escape": "warn",
  "no-promise-executor-return": "warn",
  "no-proto": "warn",
  "no-regex-spaces": "warn",
  "no-script-url": "warn",
  "no-self-assign": "warn",
  "no-self-compare": "warn",
  "no-setter-return": "warn",
  "no-sequences": "warn",
  "no-shadow": 0, // ["error", {"allow": ["enum"]}],
  "no-template-curly-in-string": "warn",
  "no-this-before-super": "error",
  "no-unexpected-multiline": "warn",
  "no-unmodified-loop-condition": "warn",
  "no-unneeded-ternary": "warn",
  "no-unreachable": "warn",
  "no-unreachable-loop": "warn",
  "no-unsafe-negation": ["warn", {enforceForOrderingRelations: true}],
  "no-unsafe-optional-chaining": ["warn", {disallowArithmeticOperators: true}],
  "no-unused-expressions": "warn",
  "no-useless-backreference": "warn",
  "no-useless-call": "warn",
  "no-useless-catch": "warn",
  "no-useless-computed-key": ["warn", {enforceForClassMembers: true}],
  "no-useless-concat": "warn",
  "no-useless-constructor": "warn",
  "no-useless-rename": "warn",
  "no-useless-return": "warn",
  "no-var": "warn",
  "no-void": ["warn", { allowAsStatement: true }], // "warn",
  "no-whitespace-before-property": "warn",
  "prefer-numeric-literals": "warn",
  "prefer-object-spread": "warn",
  "prefer-regex-literals": "warn",
  "prefer-spread": "warn",
  "rest-spread-spacing": ["warn", "never"],
  "semi-spacing": "warn",
  "semi-style": ["warn", "last"],
  "space-unary-ops": ["warn", {words: true, nonwords: false}],
  "switch-colon-spacing": "warn",
  "symbol-description": "warn",
  "template-curly-spacing": ["warn", "never"],
  "unicode-bom": ["warn", "never"],
  "use-isnan": ["warn", {enforceForSwitchCase: true, enforceForIndexOf: true}],
  "valid-typeof": ["warn", {requireStringLiterals: true}],
  "wrap-iife": ["warn", "inside"],
  "arrow-parens": ["warn", "always"],
  "capitalized-comments": ISFIXINGCOMMENTS
    ? ["warn", "always", {
      ignoreConsecutiveComments: true,
      ignorePattern: "noinspection"
    }]
    : "off",
  "comma-spacing": "warn",
  "dot-notation": "warn",
  indent: ["warn", 2, {SwitchCase: 1}],
  "key-spacing": "warn",
  "keyword-spacing": ["warn", {overrides: {catch: {before: true, after: false}}}],
  "max-len": ["warn", {
    code: 120,
    ignoreComments: !ISFIXINGCOMMENTS,
    ignoreTrailingComments: true,
    ignoreUrls: true,
    ignoreStrings: true,
    ignoreTemplateLiterals: true
  }],
  "no-extra-boolean-cast": ["warn", {enforceForLogicalOperands: true}],
  "no-extra-semi": "warn",
  "no-multi-spaces": ["warn", {ignoreEOLComments: true}],
  "no-tabs": "warn",
  "no-throw-literal": "error",
  "no-trailing-spaces": "warn",
  "no-useless-escape": "warn",
  "nonblock-statement-body-position": ["warn", "beside"],
  "one-var": ["warn", "never"],
  "operator-linebreak": ["warn", "before", {
    overrides: {"=": "after", "+=": "after", "-=": "after"}
  }],
  "prefer-template": "warn",
  "quote-props": ["warn", "as-needed", {keywords: false}],
  quotes: ["warn", "double", {avoidEscape: true, allowTemplateLiterals: false}],
  semi: "warn",
  "space-before-blocks": ["warn", "always"],
  "space-before-function-paren": ["warn", {
    anonymous: "never",
    named: "never",
    asyncArrow: "always"
  }],
  "spaced-comment": "warn"
};
const JSDOCRULES = {
  "jsdoc/check-access": "warn",
  "jsdoc/check-alignment": "warn",
  "jsdoc/check-examples": "off",
  "jsdoc/check-indentation": "off",
  "jsdoc/check-line-alignment": "off",
  "jsdoc/check-param-names": "warn",
  "jsdoc/check-property-names": "warn",
  "jsdoc/check-syntax": "off",
  "jsdoc/check-tag-names": ["warn", {definedTags: ["category"]}],
  "jsdoc/check-types": "warn",
  "jsdoc/check-values": "warn",
  "jsdoc/empty-tags": "warn",
  "jsdoc/implements-on-classes": "warn",
  "jsdoc/match-description": "off",
  "jsdoc/newline-after-description": "off",
  "jsdoc/no-bad-blocks": "warn",
  "jsdoc/no-defaults": "off",
  "jsdoc/no-types": "off",
  "jsdoc/no-undefined-types": "off",
  "jsdoc/require-description": "warn",
  "jsdoc/require-description-complete-sentence": "off",
  "jsdoc/require-example": "off",
  "jsdoc/require-file-overview": "off",
  "jsdoc/require-hyphen-before-param-description": ["warn", "never"],
  "jsdoc/require-jsdoc": "warn",
  "jsdoc/require-param": "warn",
  "jsdoc/require-param-description": "off",
  "jsdoc/require-param-name": "warn",
  "jsdoc/require-param-type": "warn",
  "jsdoc/require-property": "warn",
  "jsdoc/require-property-description": "off",
  "jsdoc/require-property-name": "warn",
  "jsdoc/require-property-type": "warn",
  "jsdoc/require-returns": "off",
  "jsdoc/require-returns-check": "warn",
  "jsdoc/require-returns-description": "off",
  "jsdoc/require-returns-type": "warn",
  "jsdoc/require-throws": "off",
  "jsdoc/require-yields": "warn",
  "jsdoc/require-yields-check": "warn",
  "jsdoc/valid-types": "off"
};

const RulesAssembly = ISFOUNDRY ? {...FOUNDRYRULES} : {...GENERALRULES, ...PLUGINRULES};

if (ISTYPESCRIPT) {
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
if (ISJSDOC) {
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
const RULES = Object.assign(
  RulesAssembly,
  ALLRULESACTIVE ? allRules : {},
  ISDEPLOYING ? DEPLOYMENTRULES : {}
);
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
  env: {
    browser: true,
    es2022: true,
    node: true,
    jquery: true
  },
  plugins: ["import", "@typescript-eslint", "jsdoc", "etc"],
  extends: [
    ALLRULESACTIVE ? "eslint:all" : "eslint:recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:etc/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2022,
    sourceType: "module",
    allowImportExportEverywhere: false,
    codeFrame: false,
    createDefaultProgram: true,
    ecmaFeatures: {
      ts: true,
      jsx: false,
      impliedStrict: true
    }
  },
  reportUnusedDisableDirectives: true,
  rules: {
    ...RULES,
    "etc/no-assign-mutated-array": "off",
    "etc/no-deprecated": "off",
    "etc/no-implicit-any-catch": "off",
    "etc/no-internal": "off"
  },
  globals: /* ISTYPESCRIPT ? {} : */ Object.fromEntries(
    GLOBALCONSTANTS.map((constant) => [constant, "readonly"])
  ),
  overrides: [
    {
      files: [".eslintrc.js", "*.js"],
      plugins: ["import"],
      extends: [],
      parser: "espree", // use the default parser for JavaScript files
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
        paths: ["./ts"], // replace this with the actual path to your TypeScript files
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

// console.clear();
// console.log(JSON.stringify(EXPORTS, null, 2));

module.exports = EXPORTS;
