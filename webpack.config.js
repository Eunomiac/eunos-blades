import path from "path";
import { fileURLToPath } from "url";
import { readdir, stat } from "fs/promises";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

// Convert __dirname in CommonJS to work with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Async function to recursively find all .ts files in a directory
async function findModules(dir, modules = {}) {
  const files = await readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const fileStat = await stat(fullPath);

    if (fileStat.isDirectory()) {
      await findModules(fullPath, modules);
    } else if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
      // Assuming the module's entry file has the same name as its directory
      const moduleName = path.basename(path.dirname(fullPath));
      // Key: module name, Value: path to the .ts file
      modules[moduleName] = fullPath;
    }
  }

  return modules;
}

// Self-invoking async function to generate entry points
const entryPoints = (async () => {
  const entries = await findModules(path.resolve(__dirname, "src"));
  return entries;
})();

export default (async () => ({
  // Entry points for the application - where webpack starts bundling, derived from src folder structure
  entry: await entryPoints,
  // Output configuration - where to output the bundled files
  output: {
    filename: "[name]/[name].js", // Output each module to its own directory
    path: path.resolve(__dirname, "dist"),
  },
  // Mode - affects built-in optimizations; "development" for readable output, "production" for minification
  mode: "development",
  // Devtool - controls how source maps are generated, if at all. Useful for debugging.
  devtool: "source-map",
  // Module - configure how modules are treated
  module: {
    rules: [
      {
        // Test for TypeScript files using a regex
        test: /\.ts$/,
        // Use the ts-loader for transpiling TypeScript files
        use: "ts-loader",
        // Exclude node_modules directory from transpilation
        exclude: /node_modules/,
      },
      {
        // Test for CSS files
        test: /\.css$/,
        // Use style-loader and css-loader for injecting CSS into the DOM and understanding CSS imports
        use: ["style-loader", "css-loader"],
      },
      // Add more loaders here for other file types
    ],
  },
  // Resolve - configure how modules are resolved
  resolve: {
    // Automatically resolve these extensions - allows importing without specifying these extensions
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: false, // Explicitly disable code minimization
  },
  // Plugins - add additional functionality to the compilation process
  plugins: [
    // CleanWebpackPlugin - cleans the output directory before each build
    new CleanWebpackPlugin(),
    // HtmlWebpackPlugin - generates an HTML file, injects scripts into it, and outputs it to the dist directory
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Path to the HTML template
    })
  ],
}))();