<template>
  <view :catch-move="true">
    <CustomPopup v-model:show="isShow">
      <view
        v-if="orderList?.length"
        :class="$style.box"
        class="list_box nut-flex nut-flex-col nut-row-left nut-col-center f_s-12"
      >
        <view :class="$style.title" class="f_s-16 f_w-400">选择商品</view>

        <view :class="$style.main" class="nut-flex-col nut-row-center nut-col-center f_s-14">
          <scroll-view :scroll-y="true" :enable-flex="true" :class="$style.main_item">
            <block v-for="item in orderList" :key="item.id">
              <view
                :class="$style.main_list"
                class="border-05px-box-16 nut-flex nut-col-center nut-row-left"
                @tap="handleChoose(item)"
              >
                <CustomCheckBox v-if="item.isReversible" :check="Boolean(item.check)" :m-right="16" />
                <view :class="$style.item_no" v-else></view>
                <view :class="$style.item">
                  <OrderBox
                    :data="item"
                    :showPrice="true"
                    :showPriceEnd="true"
                    :showStatus="orderStatus === ORDER_STATUS.PENDING_SHIPMENT"
                  />
                </view>
              </view>
            </block>
          </scroll-view>
        </view>

        <view :class="$style.bottom" class="nut-flex nut-row-between nut-col-center">
          <view @tap="onAllSelect" class="sel-btn nut-flex nut-col-center nut-row-center">
            <CustomCheckBox v-if="isAllSelect" :check="Boolean(selectAll)" :m-right="6" />
            <view :class="$style.item_no" v-else></view>
            <text>全选</text>
          </view>
          <nut-button type="primary" :class="$style.btn" :disabled="isDisabled" @click="handleConfirm">确定</nut-button>
        </view>
      </view>
    </CustomPopup>
  </view>
</template>
<script lang="ts" setup>
import { ref, computed, watch, PropType } from 'vue';
import Taro, { useUnload } from '@tarojs/taro';

import { cloneDeep } from 'lodash';
import { IOrderInfoItems } from '@/dto/order';
import CustomCheckBox from '../CustomCheckBox/CustomCheckBox.vue';
import OrderBox from '../OrderItem/OrderBox.vue';
import { useReversibleStore } from '@/stores';
import { ORDER_STATUS } from '@/constants';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';

interface IOrderList extends IOrderInfoItems {
  check?: boolean;
}

const useReversible = useReversibleStore();

const emits = defineEmits(['update:show']);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array as PropType<IOrderInfoItems[]>,
    default: null,
  },
  /** 仅全部退款 */
  fullRefund: {
    type: Boolean,
    default: false,
  },
});

const orderList = ref<IOrderList[]>([]);
const selectAll = ref<boolean>(false);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const isDisabled = computed((): boolean => {
  const list = orderList.value.filter(item => item.check);
  return !list.length;
});

const filterArr = computed(() => {
  const list = orderList.value.filter(item => item.isReversible);
  return list;
});

const isAllSelect = computed((): boolean => {
  return !!filterArr.value.length;
});

const orderStatus = computed(() => {
  return useReversible.orderStatus;
});
/** 全部退款 */
const isFullRefund = computed(() => {
  return props.fullRefund;
});

watch(isShow, newVal => {
  if (newVal) {
    initData();
  } else {
    selectAll.value = false;
  }
});

useUnload(() => {
  initData();
});

const initData = () => {
  console.warn('props.data', props.data);

  orderList.value = cloneDeep(props.data);
  orderList.value.forEach(item => {
    item.check = false;
  });

  if (isFullRefund.value) {
    onAllSelect();
  }
};

const onAllSelect = () => {
  if (!orderList.value?.length || !isAllSelect.value || (isFullRefund.value && selectAll.value)) return;
  selectAll.value = !selectAll.value;
  orderList.value.forEach(itm => {
    itm.check = selectAll.value && itm.isReversible;
  });
};

const handleChoose = (item: IOrderInfoItems) => {
  const { id = 0, isReversible } = item;
  if (!id || !isReversible || isFullRefund.value) return;

  let len: number = 0;
  orderList.value.forEach(itm => {
    if (itm.id === item.id) {
      itm.check = !itm.check;
    }
    if (!itm.check) {
      selectAll.value = false;
    }
    if (itm.check) {
      len++;
    }
  });

  if (len === filterArr.value.length) {
    selectAll.value = true;
  }
};

const handleConfirm = async () => {
  const data = orderList.value.filter(itm => {
    return itm.check;
  });

  Taro.navigateTo({
    url: `/packageA/pages/order/refund/refund?data=${JSON.stringify(data)}`,
  });

  onClose();
};

const onClose = () => {
  emits('update:show', false);
};
</script>
<style lang="scss">
.nutui-iconfont {
  font-size: 12px;
}
</style>
<style lang="scss" module>
.box {
  width: 375px;

  .title {
    margin-top: 34px;
    width: 375px;
    line-height: 24px;
    text-align: center;
    color: $Primary;
  }

  .main {
    margin: 24px 0 12px 0;
    width: 375px;
    overflow: hidden;
    // background: $white;
    &_item {
      width: 375px;
      max-height: 440px;
      padding: 0 16px;
      .main_list {
        width: 343px;
        padding: 16px;
        border-radius: 8px;
        background: var(--white, #fff);
        margin-bottom: 12px;
        .item {
          width: 279px;
        }
      }
    }
  }
  .bottom {
    width: 375px;
    line-height: 50px;
    padding: 24px 16px 0 16px;
    .btn {
      width: 120px;
      height: 40px;
      border-radius: 20px;
    }
  }
  .item_no {
    margin-right: 16px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--block, #eee);
    border: 1px solid #a5a5a5;
  }
}
</style>
