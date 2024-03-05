<template>
  <view :class="$style.layout" class="nut-flex-col nut-col-center nut-row-center">
    <view :class="$style.title" class="f_s-20 f_w-700">{{ props.title }}</view>
    <view :class="[$style.tips, `f_s-${tipsFontSize}`]">{{ props.tips }}</view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, default: '' },
  tips: { type: String, default: '' },
  tipsFontSize: { type: String, default: '14' },
});
</script>
<style lang="scss" module>
.layout {
  width: 375px;

  .title {
    line-height: 28px;
    margin-bottom: 4px;
  }
  .tips {
    color: $Tertiary;
  }
}
</style>
