<template>
  <view></view>
</template>
<script setup lang="ts">
import Taro, { useRouter } from '@tarojs/taro';
import { onMounted } from 'vue';
import { routeMap } from '@/utils';

const router = useRouter();

onMounted(async () => {
  let url = '/pages/landing/landing';
  const params: string[] = [];
  const pagePath: any = routeMap(router.path);
  const query = router.params;

  params.push(`$source=扫码验真`);
  if (pagePath) params.push(`page=${pagePath}`);
  if (query) {
    for (const key of Object.keys(query)) {
      params.push(`${key}=${query[key]}`);
    }
  }
  url = `${url}?${params.join('&')}`;
  console.debug('noRegisterIndex reLaunch2 url=', url);
  Taro.reLaunch({ url });
});
</script>

<style lang="scss" module></style>
