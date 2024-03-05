import Components from 'unplugin-vue-components/webpack';
import NutUIResolver from '@nutui/nutui-taro/dist/resolver';

const path = require('path');

const config = {
  projectName: 'ugrow',
  date: '2022-8-10',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['taro-plugin-pinia', '@tarojs/plugin-html'],
  sass: {
    resource: [path.resolve(__dirname, '..', 'src/scss/custom_theme.scss')],
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        Components({
          resolvers: [NutUIResolver({ taro: true })],
        }),
      );
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
  },
  h5: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        Components({
          resolvers: [NutUIResolver({ taro: true })],
        }),
      );
    },
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-taro', 'icons-vue-taro'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
};

module.exports = function (merge) {
  let cfg;
  // APP_ENV 对应不同的开发环境: dev, prod
  if (process.env.APP_ENV === 'uat') {
    cfg = merge({}, config, require('./uat'));
  } else if (process.env.NODE_ENV === 'development' || process.env.APP_ENV === 'dev') {
    cfg = merge({}, config, require('./dev'));
  } else {
    cfg = merge({}, config, require('./prod'));
  }
  cfg.sass.data += `$cdn-base-url:${cfg.env.CDN_HOST};`;

  if (process.env.VUE_DEVTOOLS) {
    cfg.plugins.push('@tarojs/plugin-vue-devtools');
  }
  return cfg;
};
