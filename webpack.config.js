const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './example/index-esnext.js',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'logo/logo.png',
        to: 'logo.png'
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'webpack-atomizer-loader',
          options: {
            configPath: path.resolve('./acss.config.js')
          }
        }, {
          loader: 'babel-loader'
        }]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'example')
  },
  devServer: {
    historyApiFallback: true
  }
};
