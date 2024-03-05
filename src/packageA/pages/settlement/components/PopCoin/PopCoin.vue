<template>
  <nut-popup v-model:visible="isShow" z-index="999" position="bottom" @close="onClose" :closeable="true" :round="true">
    <view :class="$style.container" class="f_w-400">
      <view :class="$style.title">
        <view :class="$style.title_name" class="f_s-12 nut-flex nut-row-center"
          >谷子值（剩余：<text :class="$style.title_num">{{ pointBalance }}</text
          >)</view
        >
      </view>

      <view :class="$style.main">
        <view
          :class="$style['main-item']"
          class="nut-flex nut-row-left nut-col-center"
          @tap="handleChangeType(SETTLE_POINT_TYPE_USE)"
        >
          <CustomCheckBox :check="Boolean(cData.coin_type === SETTLE_POINT_TYPE_USE)" />
          <view :class="$style['item-right']" class="nut-flex nut-col-center nut-row-left">
            <text>使用</text>
            <view :class="$style['icon-input']" class="nut-flex">
              <input
                :class="$style.input_num"
                v-model="cData.coin"
                placeholder="积分"
                type="number"
                @blur="handleBlur"
              />
            </view>
            <text>谷子值，抵扣{{ deduction }}元</text>
          </view>
        </view>
        <view
          :class="$style['main-item']"
          class="nut-flex nut-row-left nut-col-center"
          @tap="handleChangeType(SETTLE_POINT_TYPE_NO_USE)"
        >
          <CustomCheckBox :check="Boolean(cData.coin_type === SETTLE_POINT_TYPE_NO_USE)" />
          <text>不使用谷子值</text>
        </view>
      </view>
      <view :class="$style.btn" class="f_s-14" hover-class="btn-hover" @tap="handleComfirm">确定</view>
    </view>
  </nut-popup>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Toast } from '@/utils/index';
import { isInteger, cloneDeep } from 'lodash';
import { usePointStore } from '@/stores';
import { SETTLE_POINT_TYPE_NO_USE, SETTLE_POINT_TYPE_USE } from '@/constants';
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';

const emits = defineEmits(['update:show', 'comfirm']);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  usableBalance: {
    type: Number,
    default: 0,
  },
});

const pointScale = computed((): number => usePointStore().scale);
const pointBalance = computed((): number => usePointStore().balance);
const deduction = computed((): number => Math.floor((cData.value.coin / pointScale.value) * 100) / 100);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});
const cData = ref<any>({ coin_type: SETTLE_POINT_TYPE_USE, coin: props.usableBalance });

watch(
  () => props.usableBalance,
  newVal => {
    cData.value.coin = newVal;
  },
);

const handleBlur = () => {
  if (!isInteger(cData.value.coin)) return Toast('请输入正确的积分数~');
  if (Number(cData.value.coin) > props.usableBalance) {
    cData.value.coin = props.usableBalance;
  }
};

const handleChangeType = (type: number = 0) => {
  cData.value.coin_type = type;
};

const handleComfirm = () => {
  const data = cloneDeep(cData.value);
  if (cData.value.coin_type === SETTLE_POINT_TYPE_USE && !isInteger(data.coin)) return;
  if (cData.value.coin_type === SETTLE_POINT_TYPE_NO_USE) {
    // 不适用积分 为0
    data.coin = 0;
  }
  emits('comfirm', { type: cData.value.coin_type, coin: data.coin });
  onClose();
};
const onClose = () => {
  emits('update:show', false);
};
</script>
<style lang="scss" module>
.container {
  padding: 22px 15px 28px 15px;
  position: relative;
  width: 375px;
  height: 279px;
  box-sizing: border-box;
  .title {
    width: 345px;
    margin-bottom: 23px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e6e6e6;
    .title_num {
      color: $Primary;
    }
  }
  .main {
    margin-bottom: 40px;
    .main-item {
      min-height: 40px;
      font-size: 12px;
      .item-right {
        .icon-input {
          width: 80px;
          height: 28px;
          background: rgba($color: $font-color, $alpha: 0.1);
          margin: 0 10px 0 5px;
          border: none;
          text-align: center;
          border-radius: 4px;
          .input_num {
            color: $Primary;
          }
        }
      }
    }
  }
  .btn {
    width: 345px;
    height: 45px;
    line-height: 45px;
    background: $primary-color;
    color: $white;
    text-align: center;
    margin: 0 auto;
    border-radius: 50px;
  }
}
</style>
