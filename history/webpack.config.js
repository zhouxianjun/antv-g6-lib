const path = require('path');

console.log(path.resolve(__dirname, './dist'));

module.exports = {
  mode: 'production',
  entry: {
    'history': './lib/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].min.js',
    libraryTarget: 'umd'
  },
  externals: {
    'lodash': {
      commonjs: 'lodash',//如果我们的库运行在Node.js环境中，import _ from 'lodash'等价于const _ = require('lodash')
      commonjs2: 'lodash',//同上
      amd: 'lodash',//如果我们的库使用require.js等加载,等价于 define(["lodash"], factory);
      root: '_' // 这个为lodash暴露的变量
    }
  },
  module: {
    rules: [
      {                             // jsx配置
        test: /(\.jsx|\.js)$/,
        use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: '8081',
    open: true,
    overlay: true
  },
  devtool: 'cheap-module-source-map',
  plugins: [
  ]
};
