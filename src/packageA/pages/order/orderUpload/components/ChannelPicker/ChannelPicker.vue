<template>
  <nut-popup position="bottom" :safe-area-inset-bottom="true" :round="true" v-model:visible="isShow">
    <nut-picker v-model="value" :columns="channelData" title="订单渠道" @confirm="confirm" @cancel="onClose">
    </nut-picker>
  </nut-popup>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface IColumnsInfo {
  text: string;
  value: string;
}

const channelData = ref([
  { value: '001', text: '天猫-zippo官方旗舰店' },
  { value: '002', text: '京东-ZIPPO官方旗舰店' },
  { value: '004', text: '京东-ZIPPO京东自营官方旗舰店' },
  { value: '011', text: '抖音-ZIPPO官方旗舰店' },
  { value: '019', text: '抖音-ZIPPO运动户外旗舰店' },
  { value: 'WS-DW', text: '得物-Zippo官方品牌账号' },
  { value: 'WS-TM', text: '天猫-其他店铺' },
  { value: 'WS-JD', text: '京东-其他店铺' },
  { value: 'WS-DY', text: '抖音-其他店铺' },
  { value: 'WS-PDD', text: '拼多多-其他店铺' },
  { value: 'WS-XHS', text: '小红书-其他店铺' },
  { value: 'WS-Other', text: '其他-线下经销商等' },
]);
const value = ref(['001']);

const emits = defineEmits(['update:show', 'setDta']);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: String,
    default: '',
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

const confirm = ({ selectedValue, selectedOptions }: { selectedValue: string[]; selectedOptions: IColumnsInfo[] }) => {
  const channelText = selectedOptions.map(val => val.text).join(',');
  const channelVal = selectedValue.join(',');
  emits('setDta', { channelVal, channelText });
  onClose();
};

const onClose = () => {
  emits('update:show', false);
};
</script>
