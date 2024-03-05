import { setupStore, useUserStore } from '@/stores';
import { MyProxy as trackProxy } from '@/utils/track';
import Taro from '@tarojs/taro';
import { createApp } from 'vue';
import './app.scss';
import { routeMap } from './utils';

trackProxy();
const linkflow = require('./utils/lf-wx-miniapp.min.js');

linkflow.setup({
  name: process.env.APP_ID,
  token: 'MTAwMDA0NC0zOTEzM2U2Ny01NmRhLTRhNjAtYmU2OS0yZDRkZWNjNjYwMzQ=', //必填，用于识别埋点小程序的连接
  defaultPath: 'pages/index/index',
  server_url: 'https://cdp.linkflowtech.com', //必填，埋点数据收集的后端服务器地址
  utm_stractegy: 'OVERWRITE',
  //'OVERWRITE' | 'SESSION' | 'MAX_AGE'    默认 OVERWRITE
  //OVERWRITE: 一直使用前一次存储的utm直到新的utm进来
  //SESSION: utm值只在本次launch的过程中有效，下次重新初始化SDK时，不会从存储中获取utm
  //MAX_AGE: 一个组utm值进来的时候，记录当时的时间戳，等到下次SDK初始的时候，从存储中获取utm的值，并且比较时间戳是否在有效范围内，如果在有效范围内这使用该utm，该有效性检查只在SDK初始化时候进行，在本次launch中间不会再次检查这组utm的有效性
  utm_max_age: 720, //默认720h
  auto_anonymous_id: false, //默认值 true，如果为false的话，SDK不会自动生成anonymouseId，如果没有identitiy被设置，SDK则不会发送message到后台
  auto_track: {
    app_launch: true, //自动追踪onAppLaunch事件，默认值为true
    app_show: true, //自动追踪onAppShow事件，默认值为true
    app_hide: true, //自动追踪onAppHide事件，默认值为true
    page_show: true, //自动追踪onPageShow事件，默认值为true
    page_share: true, //自动追踪onPageShare事件，默认值为true
    page_leave: true, //自动追踪离开页面事件，此事件会记录页面的停留时长，默认值为false
  },
});

const App = createApp({
  // 对应 onLaunch
  onLaunch(options) {
    console.debug('app onLaunch', options);

    const updateManager = Taro.getUpdateManager();
    updateManager.onUpdateReady(() => {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success(res) {
          if (res.confirm) updateManager.applyUpdate();
        },
      });
    });
  },
  async onShow(options) {
    console.debug('app onshow', options);
    console.debug('Taro.getAccountInfoSync()', JSON.stringify(Taro.getAccountInfoSync()));
    const userStore = useUserStore();
    userStore.setOnShowOptions(options);
    await userStore.getUsersProfile();
  },

  onPageNotFound(res) {
    console.debug('onPageNotFound', res);
    const params: string[] = [];
    const { path, query } = res;
    const pagePath: any = routeMap(path);
    if (pagePath) params.push(`page=${pagePath}`);
    if (query) {
      for (const key of Object.keys(query)) {
        params.push(`${key}=${query[key]}`);
      }
    }
    Taro.redirectTo({ url: '/pages/landing/landing?' + params.join('&') });
  },
});
setupStore(App);
export default App;
