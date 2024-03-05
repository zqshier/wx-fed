<template>
  <nut-popup
    pop-class="settle-coupon-layout"
    v-model:visible="isShow"
    z-index="999"
    position="bottom"
    @close="onClose"
    :closeable="true"
    :round="true"
  >
    <view :class="$style.container" class="nut-flex nut-flex-col nut-row-center">
      <view :class="$style.title">
        <PopTitle title="订单备注" />
      </view>
      <view :class="$style.content">
        <textarea
          placeholder="如有特殊需求可先联系在线客服"
          placeholderStyle="font-weight: 400;color: #989898;"
          :class="$style['content-text']"
          type="text"
          :value="memoVal"
          @input="getMemoVal"
        />
      </view>
      <view :class="$style.btn" class="f_s-14" hover-class="btn-hover" @tap="handleComfirm">确定</view>
    </view>
  </nut-popup>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

import PopTitle from '@/components/PopTitle/PopTitle.vue';

const emits = defineEmits(['update:show', 'comfirm']);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});

const memoVal = ref<string>('');

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const getMemoVal = e => {
  memoVal.value = e.detail.value || '';
};

const handleComfirm = () => {
  emits('comfirm', memoVal.value);
  onClose();
};

const onClose = () => {
  emits('update:show', false);
};
</script>
<style lang="scss" module>
.container {
  position: relative;
  width: 375px;
  max-height: 529px;
  background: $white;
  padding-bottom: 34px;
  .title {
    width: 100%;
    margin-bottom: 30px;
  }
  .content {
    margin-bottom: 280px;
    padding: 12px 18px 14px 18px;
    width: 345px;
    height: 86px;
    background: rgba($color: $font-color, $alpha: 0.1);
    border-radius: 16px;
    &-text {
      text-align: start;
      width: 100%;
      height: 100%;
    }
  }
  .btn {
    width: 345px;
    height: 45px;
    line-height: 45px;
    background: $primary-color;
    color: $white;
    font-size: 14px;
    text-align: center;
    margin: 0 auto;
    border-radius: 50px;
  }
  .empty-box {
    width: 375px;
    height: 449px;
  }
}
</style>
<style lang="scss">
.coin-layout {
  .nut-icon-close {
    color: $white;
  }
}
</style>
