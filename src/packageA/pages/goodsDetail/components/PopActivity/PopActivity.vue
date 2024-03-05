<template>
  <view :catch-Move="true">
    <nut-popup
      v-model:visible="isShow"
      z-index="9999"
      position="bottom"
      :round="true"
      :closeable="true"
      :safe-area-inset-bottom="true"
      @close="onClose"
    >
      <view :class="$style.box" class="nut-flex nut-flex-col nut-row-left nut-col-center f_s-12">
        <view :class="$style.title">活动</view>
        <view :class="$style.main" class="nut-flex nut-flex-col nut-row-left nut-col-top f_s-14">
          <scroll-view :scroll-y="true" :class="$style.main_item">
            <block v-for="item in actList" :key="item.name">
              <view
                :class="$style.main_list"
                class="nut-flex nut-col-center nut-row-left"
                @tap="handleChooseReson(item)"
              >
                <CustomCheckBox :check="Boolean(item.check)" :m-right="16" />
                <view :class="$style.list_title" class="nut-flex nut-row-between">
                  <text>{{ item.name }}</text>
                  <view
                    v-if="item.promotionId"
                    :class="$style.list_detail"
                    class="nut-flex"
                    @tap.stop="goActGoodsList(item.promotionId)"
                  >
                    <text>查看详情</text>
                    <image :class="$style['icon-right']" src="../../../../../static/icon/arrowLeft.png" />
                  </view>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
        <nut-button shape="round" size="large" type="primary" :class="$style.btn" @click="handleCancel"
          >确认</nut-button
        >
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';
import { GoodsInfo, IGoodsAct } from '@/dto/goods';
import Taro from '@tarojs/taro';
import { PropType, computed, onMounted, ref } from 'vue';

interface IActList extends IGoodsAct {
  check?: boolean;
}

const props = defineProps({
  data: { type: Object as PropType<GoodsInfo | null>, default: null },

  show: {
    type: Boolean,
    default: true,
  },
  orderNo: {
    type: String,
    default: '',
  },
});

const goodsInfo = computed(() => props.data);

// const actList = computed(() => goodsInfo.value?.availablePromotions || []);

const emits = defineEmits(['update:show', 'cancel']);

const actList = ref<IActList[]>(goodsInfo.value?.availablePromotions || []);
const noSeleAct = {
  promotionInfo: {},
  type: '',
  promotionId: '',
  goodsItems: [],
  startTime: null,
  endTime: null,
  name: '不参加任何优惠活动',
  check: false,
};

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const handleChooseReson = (item: IActList) => {
  actList.value.forEach(itm => {
    itm.check = false;
    if (itm.promotionId === item.promotionId) {
      itm.check = true;
    }
  });
};

const handleCancel = async () => {
  const result = await setActInfo();
  emits('cancel', result);
  onClose();
};

// 默认选择第一个活动
const setActInfo = () => {
  const chooseVal = actList.value.find(item => {
    return item.check === true;
  });
  // goodsStore.setActivityInfo(chooseVal || noSeleAct);
  // goodsStore.setActivityInfos(chooseVal || noSeleAct, goodsInfo.value?.id);
  return chooseVal;
};

const onClose = () => {
  emits('update:show', false);
};

const goActGoodsList = id => {
  Taro.navigateTo({
    url: `/packageA/pages/activityGoods/activityGoods?id=${id}`,
  });
};

onMounted(() => {
  // eventCenter.on(getCurrentInstance().router!.onShow, () => {
  //   console.warn('onShow');
  //   handleCancel();
  // });

  const list = actList.value;

  if (list && list.length < 1) return;

  list.forEach((item, index) => {
    item.check = false;
    if (index === 0) {
      item.check = true;
    }
  });

  list.push(noSeleAct);

  handleCancel();
});
</script>

<style lang="scss" module>
.box {
  width: 375px;
  height: 356px;
  background: $white;
  padding-bottom: 20px;
  .title {
    width: 375px;
    height: 54px;
    line-height: 54px;
    color: $font-color;
    text-align: center;
    padding-bottom: 20px;
  }

  .main {
    width: 375px;
    padding: 0 15px;
    margin-bottom: 20px;
    background: $white;
    &_title {
      width: 345px;
      line-height: 50px;
      color: $Tertiary;
      border-bottom: 1px solid #e6e6e6;
    }
    .main_list {
      width: 345px;
      height: 52px;
      border-bottom: 1px solid #e6e6e6;
      .list_title {
        width: 100%;
      }
      .list_detail {
        color: $Secendary;
      }
      .icon-right {
        width: 6px;
        height: 10px;
        margin-left: 8px;
      }
    }
    &_item {
      margin-top: 15px;
      border-top: 2rpx solid #e6e6e6;
      width: 345px;
      height: 200px;
    }
  }
  .btn {
    width: 345px;
  }
}
</style>
