<template>
  <view class="nut-flex nut-row-center" v-if="!isEmpty(actName)">
    <view :class="$style['goods_activity']" class="f_s-14 f_w-400 nut-flex nut-row-between mg-bottom-30">
      <text>活动</text>
      <view class="nut-flex nut-col-center nut-row-end" @tap="handleActivity">
        <text :class="$style.ac_name"> {{ actName }} </text>
        <image :class="$style['icon-right']" src="../../../../../static/icon/arrowLeft.png" />
      </view>
    </view>
  </view>

  <!-- 选择活动 -->
  <PopActivity v-model:show="showActivity" :data="props.data" @cancel="handleCancel" />
</template>
<script setup lang="ts">
import { GoodsInfo, IGoodsAct } from '@/dto/goods';
import { cloneDeep, isEmpty } from 'lodash';
import { PropType, ref } from 'vue';
import PopActivity from '../PopActivity/PopActivity.vue';

const props = defineProps({
  data: { type: Object as PropType<GoodsInfo | null>, default: null },
  activityInfos: { type: Array as PropType<IGoodsAct[]>, default: () => [] },
});

const emits = defineEmits(['update:activityInfos']);
const showActivity = ref<boolean>(false);

const actName = ref<string>('');

const handleActivity = () => {
  showActivity.value = true;
};

const handleCancel = (row: IGoodsAct) => {
  setActivityInfos(row);
  actName.value = row.name;
};

const setActivityInfos = (actItem: IGoodsAct) => {
  const activityInfos = cloneDeep(props.activityInfos);
  const index = activityInfos.findIndex(item => item.id === props.data?.id);
  if (index === -1) {
    activityInfos.push({ ...actItem, id: props.data?.id });
    emits('update:activityInfos', activityInfos);
  } else {
    activityInfos[index] = { ...actItem, id: props.data?.id };
    emits('update:activityInfos', activityInfos);
  }
};
</script>

<style lang="scss" module>
.goods_activity {
  width: 339px;
  padding-bottom: 20px;
  margin-top: -10px;
  border-bottom: 1px solid #e6e6e6;
  .ac_name {
    color: $Secendary;
  }
}
.icon-right {
  width: 6px;
  height: 10px;
  margin-left: 8px;
}
</style>
