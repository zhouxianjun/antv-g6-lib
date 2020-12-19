module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals({
        'lodash': {
          commonjs: 'lodash',//如果我们的库运行在Node.js环境中，import _ from 'lodash'等价于const _ = require('lodash')
          commonjs2: 'lodash',//同上
          amd: 'lodash',//如果我们的库使用require.js等加载,等价于 define(["lodash"], factory);
          root: '_' // 这个为lodash暴露的变量
        },
        '@antv/g6': {
          commonjs: '@antv/g6',//如果我们的库运行在Node.js环境中，import _ from 'lodash'等价于const _ = require('lodash')
          commonjs2: '@antv/g6',//同上
          amd: '@antv/g6',//如果我们的库使用require.js等加载,等价于 define(["lodash"], factory);
          root: 'G6' // 这个为lodash暴露的变量
        }
      });
    }
  }
};
