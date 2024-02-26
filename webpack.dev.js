// Import necessary Node.js path module for path operations
import path from "path";
import { fileURLToPath } from "url";
// Import the function to merge webpack configurations
import { merge } from "webpack-merge";
// Import the common webpack configuration
import common from "./webpack.common.js";
// Import the plugin for running TypeScript type checking in a separate process
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

// Convert the URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  // Set the mode to development to enable webpack's built-in optimizations for development
  mode: "development",

  // Configure how the output files are named and where they are stored
  output: {
    filename: "blades.js", // Name of the generated JavaScript bundle
    path: path.resolve(__dirname, "module") // Output directory for the bundle
  },

  // Define rules for how different types of modules (files) will be treated
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply this rule to files ending in .ts
        use: [
          {
            loader: "ts-loader", // Use ts-loader to transpile TypeScript files
            options: {
              transpileOnly: true // Skip type checking for faster builds
            }
          }
        ],
        exclude: /node_modules/ // Do not apply this rule to files in node_modules
      },
      {
        test: /\.js$/, // Apply this rule to files ending in .js
        exclude: /node_modules/, // Do not apply this rule to files in node_modules
        use: {
          loader: "babel-loader", // Use babel-loader to transpile JavaScript files
          options: {
            presets: ["@babel/preset-env"] // Use @babel/preset-env for transpiling modern JavaScript to compatible JavaScript
          }
        }
      },
      {
        test: /\.scss$/, // Apply this rule to files ending in .scss
        use: [
          "style-loader", // Injects CSS into the DOM via a <style> tag
          "css-loader", // Interprets @import and url() like import/require() and resolves them
          "sass-loader" // Loads a Sass/SCSS file and compiles it to CSS
        ]
      }
    ]
  },

  // Configure source maps for better error debugging. Allows you to see the original source code during debugging
  devtool: "eval-source-map",

  // Configuration for the webpack-dev-server, which provides live reloading
  devServer: {
    contentBase: ".", // Directory to serve content from
    hot: true // Enable Hot Module Replacement without page refresh
  },

  // Add plugins to enhance the development experience
  plugins: [
    new ForkTsCheckerWebpackPlugin() // Run TypeScript type checking in a separate process for performance
  ]
});
