/** ALTERNATE CONFIGURATION FILE FOR FIXING INDENTATION ACROSS ALL FILES **/

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jquery: true
  },
  plugins: ["@typescript-eslint"],
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
  rules: {
    indent: [
      "error",
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: "first",
        // outerIIFEBody: 1,
        // MemberExpression: 1,
        FunctionDeclaration: {parameters: "first"},
        FunctionExpression: {parameters: "first"},
        // StaticBlock: {
        //   body: 1
        // },
        CallExpression: {arguments: "first"},
        ArrayExpression: "first",
        ObjectExpression: "first",
        ImportDeclaration: "first",
        flatTernaryExpressions: true,
        offsetTernaryExpressions: true,
        ignoreComments: true
      }
    ]
  }
};
