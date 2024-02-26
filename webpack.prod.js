// Import the function to merge webpack configurations. This allows us to combine the common configuration with production-specific settings.
import { merge } from "webpack-merge";
// Import Node.js path module to handle file paths. This is used to specify the output directory.
import path from "path";
import { fileURLToPath } from "url";
// Import the common webpack configuration so we can merge it with the production-specific configuration.
import common from "./webpack.common.js";
// Import autoprefixer for adding vendor prefixes to CSS classes
import autoprefixer from "autoprefixer";
// Import the CleanWebpackPlugin, which is used to clean the /dist folder before each build, ensuring that only the latest files are deployed.
import { CleanWebpackPlugin } from "clean-webpack-plugin";
// Import MiniCssExtractPlugin to extract CSS into separate files. This is better for caching and parallel loading in production.
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// Import CssMinimizerPlugin for optimizing and minifying CSS files.
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
// Import TerserPlugin for minifying JavaScript files. This helps reduce file size and improve loading times.
import TerserPlugin from "terser-webpack-plugin";

// Convert the URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to asynchronously load plugins, including CopyPlugin
async function loadPlugins() {
  const { default: CopyPlugin } = await import("copy-webpack-plugin");

  return [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    }),
    new CopyPlugin({
      patterns: [
        { from: "templates", to: "dist/templates" },
        { from: "assets", to: "dist/assets" }
      ]
    })
  ];
}

async function createWebpackProductionConfig() {
  const plugins = await loadPlugins();
  merge(common, {
    // Set the mode to 'production'. This enables optimizations like minification and tree shaking out of the box.
    mode: "production",

    // Configure how the output files are named and where they are stored.
    output: {
      filename: "blades.js", // The name of the output bundle.
      path: path.resolve(__dirname, "dist", "module") // The output directory as an absolute path.
    },

    // Define rules for how different types of modules (files) will be treated.
    module: {
      rules: [
        // Rule for JavaScript files.
        {
          test: /\.js$/,
          exclude: /node_modules/, // Exclude the node_modules directory to speed up the build process.
          use: {
            loader: "babel-loader", // Use babel-loader to transpile JavaScript files.
            options: {
              presets: ["@babel/preset-env"] // Use @babel/preset-env preset for compatibility with a wide range of browsers.
            }
          }
        },
        // Rule for TypeScript files.
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-typescript"] // Use both @babel/preset-env and @babel/preset-typescript for TypeScript files.
              }
            },
            "ts-loader" // Use ts-loader to handle TypeScript files. Since type checking is done in development, we focus on transpilation here.
          ]
        },
        // Rule for SCSS files.
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, // Extract CSS into separate files.
            "css-loader", // Translates CSS into CommonJS.
            {
              loader: "postcss-loader", // Use postcss-loader for processing CSS with PostCSS.
              options: {
                postcssOptions: {
                  plugins: [
                    autoprefixer // Automatically add vendor prefixes to CSS.
                  ]
                }
              }
            },
            "sass-loader" // Compiles Sass to CSS.
          ]
        }
      ]
    },

    // Configuration for plugins used in the production build.
    plugins,

    // Configuration for optimizing the output bundle.
    optimization: {
      minimizer: [
        new TerserPlugin(), // Minify JavaScript files.
        new CssMinimizerPlugin() // Minify CSS files.
      ]
    }
  });
}

export default createWebpackProductionConfig();
