<template>
  <nut-popup
    closeable
    close-icon-position="top-right"
    pop-class="pop-class"
    overlay-class="overlay-class"
    @click-close-icon="onClose"
    :safe-area-inset-bottom="true"
    :round="true"
    v-model:visible="isShow"
    :position="position || 'bottom'"
    :style="popupStyle"
    :z-index="zIndex"
    v-bind="$attrs"
  >
    <slot></slot>
    <template #close-icon>
      <image src="./../../static/icon/close.png" :class="$style.close"></image>
    </template>
  </nut-popup>
</template>

<script setup lang="ts">
import { pxTransform } from '@tarojs/taro';
import { computed } from 'vue';

const emits = defineEmits(['update:show']);
const props = defineProps(['show', 'position', 'popupStyle', 'zIndex']);

const popupStyle = {
  width: pxTransform(375),
  ...props.popupStyle,
};

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
<style lang="scss">
.pop-class {
  border-radius: 24px 24px 0 0;
  background: var(--popup, rgba(255, 255, 255, 0.8));
  // background: var(--popup, rgba(217, 217, 217, 0.8));
  backdrop-filter: blur(10px);
}
.overlay-class {
  background: var(--shade, rgba(0, 0, 0, 0.2)) !important;
}
</style>

<style lang="scss" module>
.close {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
}
</style>
