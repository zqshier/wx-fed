<template>
  <view :catch-move="true">
    <CustomPopup v-model:show="isShow">
      <view :class="$style.box" class="nut-flex nut-flex-col nut-row-left nut-col-center f_s-12">
        <view :class="$style.title" class="f_s-16">取消订单</view>
        <view :class="$style.tips">{{ tips }}</view>
        <view :class="$style.main" class="nut-flex nut-flex-col nut-row-left nut-col-top f_s-14">
          <scroll-view :scroll-y="true" :class="$style.main_item">
            <block v-for="item in list" :key="item.name">
              <view
                :class="$style.main_list"
                class="nut-flex nut-col-center nut-row-between"
                @tap="handleChooseReson(item)"
              >
                <text>{{ item.name }}</text>
                <CustomCheckBox
                  :check="Boolean(item.check)"
                  borderColor="#A5A5A5"
                  :modes-icon="TYPE_ICON.ROUND"
                  :m-right="0"
                />
              </view>
            </block>
          </scroll-view>
        </view>
        <nut-button
          shape="round"
          size="large"
          type="primary"
          :class="$style.btn"
          :loading="loadingDel"
          :disabled="!remark"
          @click="handleCancel"
          >确认</nut-button
        >
      </view>
    </CustomPopup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ORDER_STATUS } from '@/constants';
import { Toast } from '@/utils/index';
import { getOrdersCancelApi } from '@/api/order';
import { isEmpty } from 'lodash';
import CustomCheckBox from '../CustomCheckBox/CustomCheckBox.vue';
import { TYPE_ICON } from '@/dto/order';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';

interface Ilist {
  name: string;
  check: number;
}
interface IOrderNos {
  name: string;
  orderNo: string;
}
const emits = defineEmits(['update:show', 'refresh']);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  orderNo: {
    type: String,
    default: '',
  },
  isPointsOrder: {
    type: Boolean,
    default: false,
  },
});

const list = ref<Ilist[]>([
  { name: '不想要了', check: 0 },
  { name: '价格有点贵', check: 0 },
  { name: '暂时不需要了', check: 0 },
  { name: '拍错', check: 0 },
  { name: '余额不足', check: 0 },
  { name: '忘记使用优惠券', check: 0 },
]);
const orderNos = ref<IOrderNos[]>([]);
const remark = ref<string>('');
const loadingDel = ref<boolean>(false);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const tips = computed(() => {
  return props.isPointsOrder
    ? '取消订单后无法恢复，小火苗退回后可在有效期内使用'
    : '取消订单后无法恢复，优惠券可退回并在有效期内使用';
});

watch(
  () => props.orderNo,
  newValue => {
    const info = checkOrderNo(newValue);
    initData(isEmpty(info) ? '' : info?.name || '');
  },
);

watch(
  () => props.isPointsOrder,
  newValue => {
    if (!newValue) return;
    list.value.splice(4, 2, { name: '收货信息填写有误', check: 0 }, { name: '商品款式选择错误', check: 0 });
  },
);

const checkOrderNo = (orderNo: string) => {
  const _orderNos: IOrderNos[] = orderNos.value.filter(item => item.orderNo === orderNo);
  if (isEmpty(_orderNos)) {
    return null;
  } else {
    return _orderNos[0];
  }
};

const initData = (name: string = '') => {
  list.value = list.value.map((item: Ilist) => {
    item.check = item.name === name ? 1 : 0;
    return item;
  });
};

const handleChooseReson = (item: Ilist) => {
  list.value.forEach(itm => {
    itm.check = 0;
    if (itm.name === item.name) {
      itm.check = 1;
      remark.value = item.name;
    }
  });
  handleUpdateOrderNos();
};

const handleUpdateOrderNos = () => {
  const info = checkOrderNo(props.orderNo);
  if (info) {
    orderNos.value = orderNos.value.map((data: IOrderNos) => {
      data.orderNo === info.orderNo ? (data.name = remark.value) : '';
      return data;
    });
  } else {
    orderNos.value.push({ orderNo: props.orderNo, name: remark.value });
  }
};

const handleDelOrderNos = () => {
  const info = checkOrderNo(props.orderNo);
  if (info) {
    orderNos.value.splice(
      orderNos.value.findIndex(v => v.orderNo === info.orderNo),
      1,
    );
  }
};

const handleCancel = async () => {
  if (!remark.value) {
    return Toast('请选择取消原因');
  }
  loadingDel.value = true;

  let result;

  try {
    result = await getOrdersCancelApi({ orderNo: props.orderNo, cancelMemo: remark.value });
  } catch (error) {
    console.log('error: ', error);
    Toast(error.message);
  } finally {
    loadingDel.value = false;
  }

  if (!result) return;
  emits('refresh', ORDER_STATUS.CANCELED);
  handleDelOrderNos();
  onClose();
  Toast('取消订单成功');
};

const onClose = () => {
  emits('update:show', false);
  remark.value = '';
};
</script>

<style lang="scss" module>
.box {
  width: 375px;
  padding-bottom: 8px;
  font-family: 'FZLanTingHei-R-GBK';
  .title {
    width: 375px;
    height: 54px;
    line-height: 54px;
    color: $font-color;
    text-align: center;
  }
  .tips {
    width: 312px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: $Tertiary;
    border-radius: 16px;
    // background: #eee;
    background: #e6e6e6;
  }
  .main {
    width: 375px;
    padding: 0 15px;
    &_title {
      width: 345px;
      line-height: 50px;
      color: $Tertiary;
      border-bottom: 1px solid #e6e6e6;
    }
    &_item {
      width: 345px;
      height: 280px;
      padding: 16px 0;
      .main_list {
        width: 345px;
        height: 40px;
      }
    }
  }
  .btn {
    width: 345px;
    height: 40px;
  }
}
</style>
