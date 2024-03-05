<template>
  <view class="f_s-18 f_w-600 nut-flex nut-row-center" catchMove :class="$style.pop_title">{{ props.title }}</view>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>
<style lang="scss" module>
.pop_title {
  margin-top: 30px;
}
</style>
