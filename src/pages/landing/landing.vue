<template>
  <view class="container">
    <view :class="$style.main">
      <Loading :show="showLoading" @loaded="handleEnter" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { getQrcodeParams } from '@/api/qrcode';
import { useAppStore, useBannerStore, useCatalogStore, useMissionsStore, usePointStore, useUserStore } from '@/stores';
import { cdnurl, loadCdnFontFace } from '@/utils';
import { EventDefaultProperties, IEventsName, tarckEvents } from '@/utils/track';
import Taro, { useRouter } from '@tarojs/taro';
import { onMounted, onUnmounted, ref } from 'vue';

let enterTimer: NodeJS.Timeout;
const showLoading = ref(true);
const loaded = ref<boolean>(false);
const loadingAnimated = ref<boolean>(false);
const enterUrl = ref<string>('');
// const enterTime = ref<number>(Date.now());

const userStore = useUserStore();
const queryQrcodeParams = async (code: string, scene: number) => {
  const res = await getQrcodeParams(code, scene);
  const params = res || {};
  if (params.page && !params.page.startsWith('/')) {
    params.page = `/${params.page}`;
  }
  return params;
};

const parseQueryParams = async (query: { [key: string]: any }) => {
  let scene = '';

  // 扫普通链接二维码打开小程序
  if (query.q && query.q.startsWith('http')) {
    const q = decodeURIComponent(query.q);
    const arr = q.split('/');
    scene = arr[arr.length - 1];
  }

  if (!scene && query.scene) {
    scene = query.scene;
  }

  if (scene) {
    try {
      const launchOptions = Taro.getLaunchOptionsSync();
      const params = await queryQrcodeParams(scene, launchOptions.scene);
      return Object.assign({}, query, params);
    } catch (err) {
      console.error('获取二维码参数失败', err);
    }
  }
  return query;
};

// watch(loaded, newVal => {
//   if (!newVal) {
//     check();
//   }
// });

onMounted(async () => {
  loaded.value = false;

  const router = useRouter();
  await userStore.login(router.params.uid);
  // 埋点 识别联系人
  onIdentities();

  const query: { [key: string]: any } = await parseQueryParams(router.params);
  console.debug('landing query', query);

  // 打开小程序来源跟踪
  EventDefaultProperties.$source = query.$source;
  tarckEvents([{ path: router.path, event: IEventsName.PG }]);

  // userStore.getInintNoMembers(); // 测试非会员注册

  useAppStore()
    .getSharePosterData()
    .catch(err => console.error('getSharePosterData error=', err));

  // 预加载首页Banner
  useBannerStore()
    .loadHomeBanners()
    .catch(() => 0);

  // 预加载商品分组信息
  useCatalogStore()
    .load()
    .catch(() => 0);

  usePointStore().load(); // 实时更新积分

  // 预加载任务列表
  useMissionsStore().load();

  let url = '/pages/index/index';
  const { page, ...opts } = query;

  if (page) {
    url = decodeURIComponent(page);
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }
  }

  url += `?${Object.keys(opts)
    .map(key => `${key}=${decodeURIComponent(opts[key])}`)
    .join('&')}`;

  if (query.uid) {
    userStore.trace({ introducer: query.uid });
  }

  enterUrl.value = url;
  loaded.value = true;

  loadFontFace();
  // 所有资源加载完成
  check();
});

onUnmounted(() => {
  clearInterval(enterTimer);
});

const handleEnter = () => {
  clearInterval(enterTimer);
  const duration = 5000;
  const enterTime = Date.now();
  enterTimer = setInterval(() => {
    if (Date.now() - enterTime >= duration) {
      clearInterval(enterTimer);
      loadingAnimated.value = true;
      check();
    }
  }, 100);
};

function check() {
  if (loaded.value && loadingAnimated.value) {
    console.debug('reLaunch to %s', enterUrl.value);
    Taro.reLaunch({ url: enterUrl.value });
  }
}

const loadFontFace = async () => {
  const promiseFont1 = loadCdnFontFace(cdnurl('static/CentraleSans.otf'), 'CentraleSans');
  const promiseFont2 = loadCdnFontFace(cdnurl('static/CentraleSans-Medium.otf'), 'CentraleSans-medium');
  const promiseFont3 = new Promise(resolve => {
    // resolve(loadCdnFontFace(cdnurl('static/FZLanTingHei-R-GBK.TTF'), 'FZLanTingHei-R-GBK'));
    Taro.loadFontFace({
      global: true,
      source: `url("${cdnurl('static/FZLanTingHei-R-GBK.TTF')}")`,
      scopes: ['webview', 'native'],
      family: 'FZLanTingHei-R-GBK',
      complete: res => {
        console.debug('loadFontFace FZLanTingHei-R-GBK result=', res);
        resolve(res);
      },
    } as any);
  });
  await Promise.allSettled([promiseFont1, promiseFont2, promiseFont3]);
};

const onIdentities = () => {
  if (!userStore.userInfo) return;

  const { openid, unionid, sid } = userStore.userInfo;
  const identities: { type: string; id: string }[] = [];
  const testEnv = process.env.LINK_FLOW_TEST || false;
  if (testEnv) {
    identities.push(
      { type: 'wxa.openId', id: 'ugrowtest1' },
      { type: 'wechat.unionId', id: 'ugrowtest1' },
      { type: 'encodeMiniUserId', id: 'ugrowtest1' },
    );
  } else {
    if (openid) identities.push({ type: 'wxa.openId', id: openid });
    if (unionid) identities.push({ type: 'wechat.unionId', id: unionid });
    if (sid) identities.push({ type: 'encodeMiniUserId', id: sid });
  }

  const linkflow = Taro.getApp()[`${process.env.APP_ID}`];
  console.debug('linkflow sdk', linkflow, identities);
  if (identities.length) {
    linkflow.setIdentities(identities);
  }
};
</script>

<style lang="scss" module>
@import './landing.scss';
</style>
