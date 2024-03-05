<template>
  <web-view v-if="src" :src="src" @message="handleMessage" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useShareAppMessage } from '@tarojs/taro';
import { shareOptions } from '@/utils';

const router = useRouter();
const src: string = decodeURIComponent(router.params.src || '');

function handleMessage() {}

onMounted(async () => {});

useShareAppMessage(() => {
  const shareReturn = shareOptions({ page: '/pages/webview/webview', params: { src } });
  console.debug('webview page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});
</script>
