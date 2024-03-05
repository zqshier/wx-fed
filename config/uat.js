module.exports = {
  env: {
    NODE_ENV: '"development"',
    APP_ID: '"zippo"',
    API_HOST: '"https://uat.dev.center.ugrow.cn"',
    API_HOST_OLD: '"https://membercenter.zippo.com.cn/s2"',
    API_JAVA_HOST: '"https://mc-admin-api.zippo.com.cn/fwyz"',
    CDN_OLD_HOST: '"https://membercenter.zippo.com.cn"',
    CDN_HOST: '"https://res.dev.center.ugrow.cn/zippo"',
    // SERVICE_LINK: '"https://work.weixin.qq.com/kfid/kfcd790845827bcdc9e"',
    // CORP_ID: '"ww770d344e27579508"',
    // MAILBOX_SUFFIX: '"@beiwei47.cn,@ugrow.cn"',
    COUPON_EXPIRE_MID: '"KCo8CDmpAUdT5dc20kXFiSs1AaP5DZc_TBSeARmtr54"',
    PAYMENT_MID: '"bIeOuKH-5yuhpeA42Y2V422W-wfL2Ce6QFeucCctSd4"',
    GOODS_ARRIVE_MID: '"YLNKNwQm1KCM_kc9tCOsImqBJwd0WXiBNkK9Co4cu4E"',
    ACTIVITY_START_MID: '"hNjzAYCFyd-j_VUP7uxRzJwKDpcw6fZ1pm2iCV2U35U"',
    MEDALS_MID: '"SvqV7EFUqRjjLJCeNb8V0R-673HWeJzfxi213W9a75o"',
  },
  defineConstants: {},
  plugins: [],
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    // eslint-disable-next-line no-unused-vars
    webpackChain: (chain, webpack) => {
      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [
              {
                terserOptions: {
                  compress: true, // 默认使用terser压缩
                  mangle: true,
                  keep_classnames: true, // 不改变class名称
                  keep_fnames: true, // 不改变函数名称
                },
              },
            ],
          },
        },
      });
    },
  },
  h5: {},
};
