const path = require('path');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: './src/live-order-board/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
