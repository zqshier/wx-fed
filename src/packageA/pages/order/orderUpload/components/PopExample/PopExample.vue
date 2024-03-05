<template>
  <CustomPopup v-model:show="isShow" position="center" :popup-style="popupStyle">
    <view :class="$style.content" class="nut-flex-col nut-col-center content" :catch-move="true">
      <scroll-view :class="$style.scroll" class="nut-flex nut-row-center nut-col-top" :scroll-y="true">
        <image
          :class="$style.image"
          :src="cdnurl('static/upload_example2.jpeg')"
          mode="widthFix"
          :lazy-load="true"
          :show-menu-by-longpress="true"
        />
      </scroll-view>
    </view>
  </CustomPopup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { pxTransform } from '@tarojs/taro';
import { cdnurl } from '@/utils';

const popupStyle = {
  width: pxTransform(320),
  height: pxTransform(480),
};

const emits = defineEmits(['update:show']);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});
</script>

<style lang="scss" module>
.content {
  width: 320px;
  height: 480px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  .title {
    color: $Primary;
    font-family: 'FZLanTingHeiS-R-GB';
  }
}
.scroll {
  width: 100%;
  height: 480px;
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
