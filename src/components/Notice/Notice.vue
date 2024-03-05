<template>
  <nut-popup
    v-model:visible="isShow"
    z-index="9999"
    position="center"
    round
    @close="onClose"
    pop-class="pop-class"
    overlay-class="overlay-class"
    :closeable="showCloseBtn"
    :close-on-click-overlay="closeOverlay"
  >
    <view :class="$style['notice_box']" class="nut-flex nut-flex-col nut-row-center">
      <view v-if="title" :class="$style.title" class="nut-flex nut-col-center nut-row-center f_s-18 f_w-600">{{
        title
      }}</view>

      <view :class="[$style.content, { [$style.content_pad]: !title }]">
        <slot></slot>
      </view>
      <view :class="$style.btn_row" class="nut-flex nut-row-center f_s-14 btn" v-if="showBtn">
        <block v-if="showCancelBtn">
          <nut-button v-if="cancelFunKey" type="primary" :plain="true" :class="$style.btn" @click="otherCancel">{{
            props.cancelText
          }}</nut-button>
          <nut-button v-else type="primary" :plain="true" :class="$style.btn" @click.stop="cancel">{{
            props.cancelText
          }}</nut-button>
        </block>
        <nut-button
          v-if="showComfirmBtn"
          type="primary"
          :plain="isComfirmBtnplain"
          :class="[$style.btn, $style.btn_comfirm, !showCancelBtn ? $style.btn_comfirm_long : '']"
          :style="confirmBtnStyle"
          @click="submit"
          :loading="submitLoading"
          >{{ props.submitText }}</nut-button
        >
      </view>
    </view>
  </nut-popup>
</template>

<script lang="ts" setup>
import { CSSProperties, PropType, computed } from 'vue';
// import variables from '@/scss/variables';

const props = defineProps({
  show: { type: Boolean, default: true },
  showCancel: { type: Boolean, default: true },
  showCloseBtn: { type: Boolean, default: false },
  closeOverlay: { type: Boolean, default: false },
  title: { type: String, default: '提示' },
  showBtn: { type: Boolean, default: true },
  showCancelBtn: { type: Boolean, default: true },
  showComfirmBtn: { type: Boolean, default: true },
  isComfirmBtnplain: { type: Boolean, default: true },
  submitText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  cancelFunKey: { type: Boolean, default: false },
  submitLoading: { type: Boolean, default: false },
  btnColor: { type: String, default: '' },
  confirmBtnStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
});

const emits = defineEmits(['update:show', 'close', 'otherClose', 'submit']);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const cancel = () => {
  emits('close');
};

const onClose = () => {
  emits('close');
};

const otherCancel = () => {
  emits('otherClose');
};

const submit = event => {
  console.log('event: ', event);
  emits('submit', event);
};
</script>
<style lang="scss">
.pop-class {
  border-radius: 16px;
  background: var(--popup, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(10px);
  // .nut-button::before {
  //   position: absolute;
  //   content: '';
  //   border: none;
  // }
  // .nut-button::after {
  //   position: absolute;
  //   content: '';
  //   border: none;
  // }
}
.overlay-class {
  background: var(--shade, rgba(0, 0, 0, 0.3));
}
</style>
<style lang="scss" module>
.notice_box {
  min-width: 290px;
  height: auto;
  padding: 16px;

  .title {
    // width: 280px;
    // height: 60px;
    color: $Primary;
    // border-bottom: 1px solid #e1e1e1;
  }

  .content {
    width: 100%;
    color: $Primary;
    margin: 24px 0;
    &_pad {
      margin: 24px 0 32px;
    }
  }

  .btn_row {
    width: 280px;
    min-height: 37px;
    .btn {
      width: 120px;
      height: 40px;
      margin-right: 8px;
      color: $Primary;
      background: transparent;
      &:last-child {
        margin-right: 0;
      }
    }
    .btn_comfirm {
      color: $Brand;
    }
    .btn_comfirm_long {
      width: 273px;
      height: 45px;
    }
  }
}
</style>
