<template>
  <nut-popup
    v-model:visible="isShow"
    style="display: flex; justify-content: center; align-items: center; background: transparent; height: 100%"
    position="bottom"
    duration="0.4"
    @tap="onClose"
  >
    <view class="nut-flex-col nut-col-center" :class="$style.layout">
      <image
        :class="$style.layout"
        :src="cdnurl('static/subscrib_bg_2.png')"
        mode="aspectFill"
        :show-menu-by-longpress="true"
      ></image>
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cdnurl } from '@/utils';

const emits = defineEmits(['update:show']);
const props = defineProps(['show']);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const onClose = () => {
  emits('update:show', false);
};
</script>

<style lang="scss" module>
.layout {
  width: 280.5px;
  height: 350.5px;
  background: transparent;
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
