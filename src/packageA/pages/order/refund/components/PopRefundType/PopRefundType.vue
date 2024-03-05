<template>
  <view :catch-move="true">
    <CustomPopup v-model:show="isShow">
      <view :class="$style.box" class="nut-flex nut-flex-col nut-row-left nut-col-center f_s-16 f_w-400">
        <view :class="$style.title">退款类型</view>
        <view :class="$style.main" class="nut-flex nut-flex-col nut-row-left nut-col-top f_s-14">
          <block v-for="item in list" :key="item.name">
            <view
              :class="$style.main_list"
              class="nut-flex nut-col-center nut-row-between"
              @tap="handleChooseReson(item)"
            >
              <view>
                <view class="mg-bottom-2">{{ item.name }}</view>
                <view :class="$style['main_list-explain']" class="f_s-12">{{ item.explain }}</view>
              </view>
              <CustomCheckBox
                :check="Boolean(item.check)"
                borderColor="#A5A5A5"
                :modes-icon="TYPE_ICON.ROUND"
                :m-right="0"
              />
            </view>
          </block>
        </view>
        <nut-button shape="round" size="large" type="primary" :class="$style.btn" @click="handleCancel"
          >确认</nut-button
        >
      </view>
    </CustomPopup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { RefundType } from '@/dto/aftersales';
import { TYPE_ICON } from '@/dto/order';

interface Ilist {
  name: string;
  explain: string;
  check: number;
  type: RefundType;
}

const emits = defineEmits(['update:show', 'cancel']);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  orderNo: {
    type: String,
    default: '',
  },
});

const list = ref<Ilist[]>([
  { name: '我要退货退款', explain: '已收到货，需要退还收到的货物', type: RefundType.MONEY_GOODS, check: 0 },
  {
    name: '我要退款（不需要退货）',
    explain: '没收到货，或与卖家协商同意不退货只退款',
    type: RefundType.MONEY_ONLY,
    check: 0,
  },
]);
const remark = ref<string>('');

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const handleChooseReson = (item: Ilist) => {
  list.value.forEach(itm => {
    itm.check = 0;
    if (itm.name === item.name) {
      itm.check = 1;
      remark.value = item.name;
    }
  });
};

const handleCancel = async () => {
  const chooseVal = list.value.find(item => {
    return item.check === 1;
  });

  emits('cancel', chooseVal);
  onClose();
};

const onClose = () => {
  emits('update:show', false);
};
</script>

<style lang="scss" module>
.box {
  width: 375px;
  height: 268px;
  padding-bottom: 20px;
  .title {
    width: 375px;
    height: 54px;
    line-height: 54px;
    color: $font-color;
    text-align: center;
    padding-bottom: 20px;
    margin-top: 12px;
  }
  .main {
    width: 375px;
    padding: 0 16px;
    margin-bottom: 16px;
    &_title {
      width: 343px;
      line-height: 50px;
      color: $Tertiary;
      border-bottom: 1px solid #e6e6e6;
    }
    .main_list {
      width: 343px;
      height: 42px;
      margin-bottom: 16px;
      &-explain {
        color: $Tertiary;
      }
    }
  }
  .btn {
    width: 343px;
  }
}
</style>
