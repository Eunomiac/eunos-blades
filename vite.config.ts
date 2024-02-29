// Importing necessary functions and types from the Vite package and the path module from Node.js
import { defineConfig, type UserConfig } from "vite";
import path from "path";

// Defining the Vite configuration object with specific settings for this project
const config: UserConfig = defineConfig({
  // Setting the root directory for the project to the "src" folder
  root: "src/",
  // Setting the base URL for the project when deployed
  base: "/systems/eunos-blades/",
  // Specifying the directory where static assets are located
  publicDir: path.resolve(__dirname, "public"),
  // Configuration for the development server
  server: {
    // Setting the port number for the development server
    port: 30001,
    // Automatically open the project in the browser when the server starts
    open: true,
    // Configuring proxy rules for certain URLs
    proxy: {
      // Redirecting requests that do not start with "/systems/eunos-blades" to localhost:30000
      "^(?!/systems/eunos-blades)": "http://localhost:30000/",
      // Special proxy configuration for WebSocket connections used by socket.io
      "/socket.io": {
        target: "ws://localhost:30000", // Target server for the proxy
        ws: true // Enable WebSocket support
      }
    }
  },
  // Configuration for the build process
  build: {
    // Directory where the build output will be placed
    outDir: path.resolve(__dirname, "dist"),
    // Clear the output directory before building
    emptyOutDir: true,
    // Generate source maps for the build
    sourcemap: true,
    // Configuration for the Terser minifier
    terserOptions: {
      mangle: false, // Disable mangling of variable and function names
      keep_classnames: true, // Preserve class names
      keep_fnames: true // Preserve function names
    },
    // Temporarily disable minification for output checking
    // minify: false,
    // Configuration for Rollup (used by Vite under the hood)
    rollupOptions: {
      // Specify external modules that shouldn't be bundled
      external: ["gsap/all"]
    },
    // Configuration for building a library
    lib: {
      name: "blades", // Name of the library
      entry: path.resolve(__dirname, "src/ts/blades.ts"), // Entry point for the library
      formats: ["es"], // Output format(s) for the library
      fileName: "blades" // Name for the output file(s)
    }
  },
  resolve: {
    alias: {
      "gsap/all": path.resolve("D:/LTSC Programs/FoundryVTT/Foundry Virtual Tabletop/resources/app/public/scripts/greensock/esm/all.js")
    }
  }
});

// Exporting the configuration object to be used by Vite
export default config;
