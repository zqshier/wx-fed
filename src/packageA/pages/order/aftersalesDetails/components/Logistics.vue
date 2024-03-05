<template>
  <view :class="$style.box_width" class="f_s-14 f_w-400">
    <view :class="$style.company" class="nut-flex nut-row-between">
      <text>物流公司</text>
      <view
        :class="[$style.company_val, expName ? $style['company_val-color'] : '']"
        class="nut-flex nut-row-right"
        @tap="handleSelect"
      >
        <text>{{ expName || '请选择' }}</text>
        <image v-if="!isFillUpTime" :class="$style['icon-right']" src="@/static/icon/arrowLeft.png" />
      </view>
    </view>

    <view :class="[$style.company, { [$style['company_border']]: isFillUpTime }]" class="nut-flex nut-row-between">
      <text>物流单号</text>
      <view :class="$style.company_val">
        <input
          v-model="logisticNo"
          :class="[$style['company_val-color'], $style['company_val-input']]"
          type="text"
          :disabled="logisticInfo.logisticNo"
          placeholder="请输入物流单号"
          placeholder-class="input_box"
        />
      </view>
    </view>

    <view v-if="!isFillUpTime" :class="$style.box_btn" class="f_s-12 nut-flex nut-row-center" @tap="handleSubmit"
      >提交</view
    >
  </view>

  <nut-popup
    position="bottom"
    pop-class="pop-class"
    overlay-class="overlay-class"
    :safe-area-inset-bottom="true"
    :round="true"
    v-model:visible="showPop"
  >
    <nut-picker :columns="columns" title="物流选择" @confirm="confirm" @cancel="showPop = false"> </nut-picker>
  </nut-popup>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Toast } from '@/utils';
import { isEmpty } from 'lodash';
import { fillLogisticInfo } from '@/api/aftersales';
import { IFillLogisticInfoParams } from '@/dto/aftersales';

const emits = defineEmits(['refresh']);
const props = defineProps({
  afterSaleNo: {
    type: String,
    default: '',
  },
  isFillUpTime: {
    type: Boolean,
    default: false,
  },
  logisticInfo: {
    type: Object,
    default: null,
  },
});

const showPop = ref<boolean>(false);
const expName = ref<string>('');
const expVal = ref<string>('');
/** 物流No 773192270892555 */
const logisticNo = ref<string>(props.logisticInfo.logisticNo || '');
const columns = ref([
  { text: '圆通速递', value: 'YTO' },
  { text: '中通快递', value: 'ZTO' },
  { text: '百世快递', value: 'BEST' },
  { text: '韵达快递', value: 'YUNDA' },
  { text: '顺丰速运', value: 'SF' },
  { text: '中国邮政速递物流', value: 'EMS' },
  { text: '品骏快递', value: 'PJ' },
  { text: '德邦快递', value: 'DB' },
  { text: '申通快递', value: 'STO' },
  { text: '安能物流', value: 'ANE' },
  { text: '优速快递', value: 'UCE' },
  { text: '京东快递', value: 'JDL' },
  { text: '天天快递', value: 'HHTT' },
  { text: '极兔快递', value: 'JTSD' },
]);

const handleSubmit = async () => {
  if (props.isFillUpTime) return;

  if (isEmpty(expVal.value)) {
    return Toast('请选择物流公司');
  }

  if (isEmpty(logisticNo.value)) {
    return Toast('请输入物流单号');
  }

  if (logisticNo.value.length < 10) {
    return Toast('请输入正确的物流单号');
  }

  const params: IFillLogisticInfoParams = {
    afterSaleNo: props.afterSaleNo,
    logisticCode: expVal.value,
    logisticNo: logisticNo.value,
  };

  try {
    await fillLogisticInfo(params);
    emits('refresh');
  } catch (error) {
    console.log('error: ', error);
    Toast('提交失败');
  }
};

const handleSelect = () => {
  if (props.logisticInfo.logisticCode) return;
  showPop.value = true;
};

const confirm = ({ selectedValue, selectedOptions }) => {
  expName.value = selectedOptions[0].text;
  expVal.value = selectedValue.join(',');
  showPop.value = false;
};

onMounted(() => {
  const data = columns.value.find(item => item.value === props.logisticInfo.logisticCode);
  expName.value = data?.text || '';
});
</script>

<style>
.input_box {
  color: #989898;
  /* display: flex;
  justify-content: flex-end; */
}
.nut-picker__right {
  color: #251715;
}
.pop-class {
  border-radius: 24px 24px 0px 0px;
  background: white;
  backdrop-filter: blur(10px);
}
.overlay-class {
  background: var(--shade, rgba(0, 0, 0, 0.2));
}
</style>
<style lang="scss" module>
.box_btn {
  margin-top: 16px;
  width: 100%;
  height: 40px;
  color: #ffffff;
  border-radius: 20px;
  background: var(--primary, #333);
}
.company {
  color: $Primary;
  font-family: 'FZLanTingHei-R-GBK';
  width: 100%;
  padding: 16px 0;
  border-bottom: 0.5px solid var(--divide, #d9d9d9);
  &_border {
    border-bottom: none;
    padding-bottom: 0;
  }
}
.company_val {
  width: 233px;
  margin: 2px 0;
  &-color {
    color: $Primary;
  }
  &-input {
    text-align: right;
    width: 100%;
    font-family: 'FZLanTingHei-R-GBK';
  }
}
.icon-right {
  width: 16px;
  height: 16px;
}
.box_width {
  width: 100%;
}
</style>
