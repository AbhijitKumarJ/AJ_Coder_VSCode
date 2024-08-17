const path = require('path');

module.exports = {
  entry: './src/webview/index.tsx',
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'dist'),
    filename: 'webview.js'
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};