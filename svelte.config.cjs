// eslint-disable-next-line @typescript-eslint/no-var-requires
const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  // Given the .cjs extension, this file is indeed treated as a CommonJS module.
  // Therefore, the use of require and module.exports is appropriate here.
  // No changes are needed in tsconfig or other configuration files for this context.
  preprocess: sveltePreprocess()
};
