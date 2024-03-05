<template>
  <view :catch-move="true">
    <CustomPopup v-model:show="isShow">
      <view :class="$style.box" class="nut-flex nut-flex-col nut-row-left nut-col-center f_s-16">
        <view :class="$style.title">退款原因</view>
        <view :class="$style.main" class="f_s-14">
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
import { TYPE_ICON } from '@/dto/order';

interface Ilist {
  name: string;
  check: number;
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
  { name: '不想要了', check: 0 },
  { name: '协商一致退款', check: 0 },
  { name: '缺货', check: 0 },
  { name: '未按约定时间发货', check: 0 },
  { name: '其他', check: 0 },
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

  emits('cancel', chooseVal?.name);
  onClose();
};

const onClose = () => {
  emits('update:show', false);
};
</script>

<style lang="scss" module>
.box {
  width: 375px;
  height: 350px;
  padding-bottom: 20px;
  .title {
    width: 375px;
    line-height: 24px;
    margin: 32px 0 16px 0;
    color: $font-color;
    text-align: center;
  }
  .main {
    width: 375px;
    padding: 0 16px;
    margin-bottom: 16px;
    &_title {
      width: 343px;
      line-height: 40px;
      color: $Tertiary;
    }
    .main_list {
      width: 343px;
      height: 40px;
    }
  }
  .btn {
    width: 345px;
  }
}
</style>
