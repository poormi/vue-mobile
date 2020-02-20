const webpack = require('webpack');
const path = require('path');
const vendors = [
  'vue',
  'vue-router',
  'vuex',
  'lodash',
  'moment',
  'axios',
  'zrender',
  'echarts'
];
 
module.exports = {
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].[chunkhash].js',
    library: '[name]_[chunkhash]'
  },
  entry: {
    vendor: vendors
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('./dll', 'manifest.json'),
      name: '[name]_[chunkhash]'
    })
  ]
}
