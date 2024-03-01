module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  rules: {
    'unit-whitelist': ['em', 'rem', '%', 's', 'px', 'deg'],
    'block-no-empty': true,
    'at-rule-no-unknown': null,
  },
  overrides: [{
    files: ["**/*.scss"],
    customSyntax: "postcss-scss"
  }]
}
