const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: './styles.js',
  output: {
    filename: 'mscr.js',
    path: path.resolve(__dirname, 'public'),
  },
  watchOptions: {
    ignored: ['**/node_modules', '**/public', '**/font'],
  },
  plugins: [new MiniCssExtractPlugin({
    filename: 'styles.css',
  })],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader:"css-loader",
            options:{
              url: false
            }
          },
          {
            loader:"sass-loader",
            options: {
              sourceMap: true,
            }  
          }
        ],
      }
    ],
  },
};