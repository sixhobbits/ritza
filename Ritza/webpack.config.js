// Webpack uses this to work with directories
const path = require("path");
const webpack = require("webpack");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// This is the main configuration object.
// Here you write different options and tell Webpack what to do

module.exports = (env) => {
  if (env.local === true) {
    return {
      // Path to your entry point. From this file Webpack will begin his work
      entry: [
        "./dev/assets/js/main.js",
        "./dev/assets/css/bootstrap.min.css",
        "./dev/assets/sass/custom.sass",
        "webpack/hot/dev-server",
        "webpack-dev-server/client?http://localhost:9000/",
      ],
      devServer: {
        contentBase: [
          path.join(__dirname, "./dist/"),
          path.join(__dirname, "./dist/assets/css/"),
          path.join(__dirname, "./dist/assets/js/"),
          path.join(__dirname, "./dev/assets/images/"),
        ],
        hot: false,
        host: "localhost",
        inline: true,
        compress: true,
        port: 9000,
        writeToDisk: true,
      },

      // Path and filename of your result bundle.
      // Webpack will bundle all JavaScript into this file
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "./assets/js/main.js",
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          automaticNameDelimiter: "~",
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      },

      // Default mode for Webpack is production.
      // Depending on mode Webpack will apply different things
      // minifying and other thing so let's set mode to development
      mode: "development",
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          },
          {
            test: /\.hbs$/,
            loader: "handlebars-loader",
          },
          {
            // Apply rule for .sass, .scss or .css files
            test: /\.(sa|sc|c)ss$/,
            // Set loaders to transform files.
            // The first loader will be applied after others
            use: [
              {
                // This loader resolves url() and @imports inside CSS
                loader: "css-hot-loader",
              },
              {
                // After all CSS loaders we use plugin to do his work.
                // It gets all transformed CSS and extracts it into separate
                // single bundled file
                loader: MiniCssExtractPlugin.loader,
              },
              {
                // This loader resolves url() and @imports inside CSS
                loader: "css-loader",
                options: {
                  import: true,
                },
              },
              {
                // Then we apply postCSS fixes like autoprefixer and minifying
                loader: "postcss-loader",
                options: {
                  config: {
                    path: __dirname + "/postcss.config.js",
                  },
                },
              },
              {
                // First we transform SASS to standard CSS
                loader: "sass-loader",
                options: {
                  implementation: require("sass"),
                  sassOptions: {
                    fiber: false,
                  },
                },
              },
            ],
          },
          {
            // Now we apply rule for images
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
              {
                // Using file-loader for these files
                loader: "file-loader",
                // In options we can set different things like format
                // and directory to save
                options: {
                  outputPath: "./assets/images/",
                  publicPath: "../images",
                },
              },
            ],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              {
                // Using file-loader for these files
                loader: "file-loader",
                // In options we can set different things like format
                // and directory to save
                options: {
                  outputPath: "./assets/fonts/",
                  publicPath: "../fonts",
                },
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".js", ".sass"],
      },
      plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: "./assets/css/[name].css",
          chunkFilename: "[id].css",
        }),
        new webpack.HotModuleReplacementPlugin({}),
        new CopyWebpackPlugin({
          patterns: [
            { from: "./dev/assets/images/", to: "./assets/images/" },
            { from: "./dev/assets/fonts/", to: "./assets/fonts/" },
          ],
        }),
        new HtmlWebpackPlugin({
          hash: true,
          filename: `index.html`,
          title: `Home`,
          favicon: "./dev/assets/images/favicon.png",
          inject: true,
          template: `./dev/index.hbs`,
        }),
      ], // We join our htmlPlugin array to the end
      // of our webpack plugins array.
    };
  } else {
    return {
      // Path to your entry point. From this file Webpack will begin his work
      entry: [
        "./dev/assets/js/main.js",
        "./dev/assets/css/bootstrap.min.css",
        "./dev/assets/sass/custom.sass",
      ],
      // Path and filename of your result bundle.
      // Webpack will bundle all JavaScript into this file
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "./assets/js/main.js",
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
          chunks: "all",
          minSize: 20000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          automaticNameDelimiter: "~",
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      },

      // Default mode for Webpack is production.
      // Depending on mode Webpack will apply different things
      // minifying and other thing so let's set mode to development
      mode: "development",
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          },
          {
            test: /\.hbs$/,
            loader: "handlebars-loader",
          },
          {
            // Apply rule for .sass, .scss or .css files
            test: /\.(sa|sc|c)ss$/,
            // Set loaders to transform files.
            // The first loader will be applied after others
            use: [
              {
                // This loader resolves url() and @imports inside CSS
                loader: "css-hot-loader",
              },
              {
                // After all CSS loaders we use plugin to do his work.
                // It gets all transformed CSS and extracts it into separate
                // single bundled file
                loader: MiniCssExtractPlugin.loader,
              },
              {
                // This loader resolves url() and @imports inside CSS
                loader: "css-loader",
                options: {
                  import: true,
                },
              },
              {
                // Then we apply postCSS fixes like autoprefixer and minifying
                loader: "postcss-loader",
                options: {
                  config: {
                    path: __dirname + "/postcss.config.js",
                  },
                },
              },
              {
                // First we transform SASS to standard CSS
                loader: "sass-loader",
                options: {
                  implementation: require("sass"),
                  sassOptions: {
                    fiber: false,
                  },
                },
              },
            ],
          },
          {
            // Now we apply rule for images
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
              {
                // Using file-loader for these files
                loader: "file-loader",
                // In options we can set different things like format
                // and directory to save
                options: {
                  outputPath: "./assets/images/",
                  publicPath: "../images",
                },
              },
            ],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              {
                // Using file-loader for these files
                loader: "file-loader",
                // In options we can set different things like format
                // and directory to save
                options: {
                  outputPath: "./assets/fonts/",
                  publicPath: "../fonts",
                },
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: [".js", ".sass"],
      },
      plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: "./assets/css/[name].css",
          chunkFilename: "[id].css",
        }),
        new CopyWebpackPlugin({
          patterns: [
            { from: "./dev/assets/images/", to: "./assets/images/" },
            { from: "./dev/assets/fonts/", to: "./assets/fonts/" },
          ],
        }),
        new HtmlWebpackPlugin({
          hash: true,
          filename: `index.html`,
          title: `Home`,
          favicon: "./dev/assets/images/favicon.png",
          inject: true,
          template: `./dev/index.hbs`,
        }),
      ],
    };
  }
};
