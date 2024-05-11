// Importing necessary functions and types from the Vite package and the path module from Node.js
import {defineConfig, type UserConfig, type Plugin} from "vite";
import path from "path";
import fs from "fs";
import checker from "vite-plugin-checker";
import {visualizer} from "rollup-plugin-visualizer";
import {exec} from "child_process";

/** *** CHECK: *** https://vitejs.dev/guide/performance
 *
 * TypeScript: Enable:
 * - "moduleResolution": "bundler",
 * - "allowImportingTsExtensions": true
 * ... in your tsconfig.json's compilerOptions to use .ts and .tsx extensions directly in your code.
 * */

/* ==== CONFIGURATION ==== */

const FOUNDRY_VERSION = 11;
const PACKAGE_TYPE: "module"|"system" = "system";
const PACKAGE_ID = "eunos-blades";
const ENTRY_FILE_NAME = "blades";

/* --- SCSS Color Extraction --- */
// Path to the SCSS file containing color definitions
const COLOR_STYLESHEET_PATH = "src/scss/core/_colors.scss";

// Must match the SCSS variable name format, capturing 'hue', 'brightness', 'red', 'green', and 'blue' values
const COLOR_MATCH_REGEXP = /--blades-(?<hue>[a-z]+)-(?<brightness>[a-z]+)-nums:\s*(?<red>\d+),\s*(?<green>\d+),\s*(?<blue>\d+)\s*;/g;
/* --- SCSS Color Extraction --- */

/* ==== END CONFIGURATION ==== */

/**
 * Custom plugin to open Chrome with specific flags when the Vite server starts.
 */
function openChromePlugin(): Plugin {
  return {
    name:  "open-chrome",
    apply: "serve", // Only apply this plugin during development
    configResolved(chromeConfig) {
      if (chromeConfig.command === "serve") {
        // Command to open the first Chrome instance
        const command1 = `start chrome --start-maximized --remote-debugging-port=9222 --auto-open-devtools-for-tabs --user-data-dir="D:/Projects/.CODING/FoundryVTT/ChromeDevProfile_1" http://localhost:${chromeConfig.server.port}`;
        exec(command1, (error) => {
          if (error) {
            console.error("Failed to open first Chrome instance:", error);
          }
        });

        // Command to open the second Chrome instance with a different profile
        const command2 = `start chrome --start-maximized --remote-debugging-port=9223 --auto-open-devtools-for-tabs --user-data-dir="D:/Projects/.CODING/FoundryVTT/ChromeDevProfile_2" http://localhost:${chromeConfig.server.port}`;
        exec(command2, (error) => {
          if (error) {
            console.error("Failed to open second Chrome instance:", error);
          }
        });
      }
    }
  };
}

function scssVariablesToJsPlugin(): Plugin {
  return {
    name: "scss-variables-to-js",
    // This function will tell Vite that "virtual:colors" is a virtual module
    resolveId(source) {
      if (source === "virtual:colors") {
        return source; // Recognize "virtual:colors" as a module ID
      }
      return null; // Other imports are handled normally
    },
    // This function will load the content for our virtual module
    load(id) {
      if (id === "virtual:colors") {
        if (typeof COLOR_STYLESHEET_PATH !== "string") {
          console.error("Invalid SCSS file path.");
          return null;
        }
        const scssVariables: string = fs.readFileSync(COLOR_STYLESHEET_PATH, "utf-8");
        let match: RegExpExecArray | null;

        type Brightness = "brightest"|"bright"|"normal"|"dark"|"darkest"|"black";
        const colorDefs: Record<string, Partial<Record<Brightness, number[]>>> = {};

        while ((match = COLOR_MATCH_REGEXP.exec(scssVariables)) !== null) {
          const {hue, brightness, red, green, blue} = match.groups!;
          const brightnessValue = (brightness || "normal") as Brightness;
          colorDefs[hue] ??= {};
          colorDefs[hue][brightnessValue] = [parseInt(red, 10), parseInt(green, 10), parseInt(blue, 10)];
        }

        return {
          code: `export const ColorNums = ${JSON.stringify(colorDefs, null, 2)};\n`,
          map:  null
        };
      }
      return null; // Other modules are loaded normally
    }
  };
}

function foundryPlugin(): Plugin {
  const usesFoundryPlugin = Symbol("foundry-plugin");

  return {
    name: "foundry-plugin",

    resolveId(source) {
      if (source === "gsap/all") {
        return {
          id: "scripts/greensock/esm/all.js",

          // This is used to make sure that there's no later transformations during production.
          external: "absolute",

          meta: {
            [usesFoundryPlugin]: true
          }
        };
      }

      return null;
    },
    load(id) {
      const moduleInfo = this.getModuleInfo(id);

      if (moduleInfo == null) {
        return null;
      }

      // During a production build since all of the Foundry imports are external it never even gets here, like one might expect.
      // However development doesn't completely understand external, see https://github.com/vitejs/vite/issues/6582
      if (usesFoundryPlugin in moduleInfo.meta) {
        // By default all imports (or in this case a re-export) will get recursively handled by Vite.
        // The tag `/* @vite-ignore */` is used to avoid an error when trying to resolve `id` again.
        return `export * from /* @vite-ignore */ ${JSON.stringify(id)};`;
      }

      return null;
    }
  };
}

const foundryPort = 30000 + (FOUNDRY_VERSION * 100);
const vitePort = foundryPort + 1;

// Defining the Vite configuration object with specific settings for this project
const config: UserConfig = defineConfig({
  // Setting the root directory for the project to the "src" folder
  root:      "src",
  // Setting the base URL for the project when deployed
  base:      `/${PACKAGE_TYPE}s/${PACKAGE_ID}/`,
  // Specifying the directory where static assets are located
  publicDir: path.resolve(__dirname, "public"),
  // Configuration for the development server
  server:    {
    // Setting the port number for the development server
    port:  vitePort,
    // Automatically open the project in the browser when the server starts
    open:  false,
    // Configuring proxy rules for certain URLs
    proxy: {
      // Redirecting requests that do not start with "/systems/eunos-blades" to localhost:31100
      [`^(?!/${PACKAGE_TYPE}s/${PACKAGE_ID})`]: `http://localhost:${foundryPort}/`,
      // Special proxy configuration for WebSocket connections used by socket.io
      "/socket.io":                             {
        target: `ws://localhost:${foundryPort}`, // Target server for the proxy
        ws:     true // Enable WebSocket support
      }
    }
  },
  // Configuration for the build process
  build: {
    // Directory where the build output will be placed
    outDir:        path.resolve(__dirname, "dist"),
    // Clear the output directory before building
    emptyOutDir:   true,
    // Generate source maps for the build
    sourcemap:     true,
    // Configuration for the Terser minifier
    minify:        "terser",
    terserOptions: {
      mangle:          false, // Disable mangling of variable and function names
      keep_classnames: true, // Preserve class names
      keep_fnames:     true // Preserve function names
    },
    // Temporarily disable minification for output checking
    // minify: false,
    // Configuration for building a library
    lib: {
      name:     ENTRY_FILE_NAME, // Name of the library
      entry:    path.resolve(__dirname, `src/ts/${ENTRY_FILE_NAME}.ts`), // Entry point for the library
      formats:  ["es"], // Output format(s) for the library
      fileName: "index" // Name for the output file(s)
    }
  },
  resolve: {
    preserveSymlinks: true,
    alias:            {
      "gsap/all": "scripts/greensock/esm/all.js"
    }
  },
  plugins: [
    foundryPlugin(),
    checker({typescript: true}),
    COLOR_STYLESHEET_PATH ? scssVariablesToJsPlugin() : undefined,
    visualizer({
      gzipSize: true,
      template: "treemap"
    }),
    openChromePlugin() // Add the custom plugin here
  ].filter(Boolean)
});

// Exporting the configuration object to be used by Vite
export default config;
