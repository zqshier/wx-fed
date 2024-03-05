<template>
  <view class="container" :class="$style.bg" :style="{ backgroundImage: `url(${imageUrl})` }">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { cdnurl } from '@/utils';

defineProps({
  imageUrl: {
    type: String,
    default: `${cdnurl('static/event_list_bg.png')}`,
    required: true,
  },
});
</script>

<style lang="scss" module>
.bg {
  width: 375px;
  min-height: 100vh;
  background-position: left bottom;
  background-size: 100% 100%;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>
