<template>
  <CustomPopup v-model:show="isShow">
    <view :class="$style.container" class="nut-flex nut-flex-col nut-col-top nut-row-left">
      <view :class="$style.title">
        <PopTitle title="优惠券" />
      </view>
      <nut-tabs class="pointmall_tabs" v-model="tabsValue" background="transparent">
        <nut-tab-pane
          :title="`${data.tabName}(${data.list?.length})`"
          :pane-key="index"
          v-for="(data, index) in couponData"
          :key="index"
        >
          <block v-if="isLoading">
            <block v-if="data.list && data.list.length > 0">
              <scroll-view :class="$style.main" class="nut-flex nut-row-center nut-col-center" :scroll-y="true">
                <view :class="$style['main-item']" class="nut-flex nut-flex-col nut-row-center nut-col-center">
                  <view
                    :class="$style['main-list']"
                    class="nut-flex nut-col-center nut-row-center"
                    v-for="(item, indexs) in data.list"
                    :key="item.code"
                    @tap="handleSelect(item)"
                  >
                    <block v-if="tabsValue === '0'">
                      <CouponBox :itemData="item" :showRule="true">
                        <template v-slot:btn>
                          <CustomCheckBox :check="Boolean(selectCouponCode == item.code)" :m-right="10" />
                        </template>
                      </CouponBox>
                    </block>

                    <CouponBox
                      v-if="tabsValue === '1'"
                      :index="indexs"
                      :itemData="item"
                      :page="COMPONENTS_COUPON_TYPE.COUPON_CENTER"
                      @userStateChanged="userStateChanged"
                    />
                  </view>
                </view>
              </scroll-view>
              <view :class="$style['btn-wrap']">
                <view :class="$style.btn" hover-class="btn-hover" @click="handleComfirm">确定</view>
              </view>
            </block>
            <view :class="$style['empty-box']" class="nut-flex nut-col-center nut-row-center" v-else>
              <DefaultPage
                imgWidth="48"
                imgHeight="48"
                imgMbottom="20"
                :icon="require('@/static/icon/no-coupon.png')"
                tip="暂无优惠券"
              />
            </view>
            <view v-if="!isLoading" :class="$style.load" class="nut-flex nut-row-center">
              <Loading1 />
            </view>
          </block>
        </nut-tab-pane>
      </nut-tabs>
    </view>
  </CustomPopup>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ICouponsItem } from '@/dto/coupons';
import { isEmpty } from 'lodash';

import PopTitle from '@/components/PopTitle/PopTitle.vue';
import CouponBox from '@/components/CouponBox/CouponBox.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';
import { COMPONENTS_COUPON_TYPE } from '@/constants';
import { Loading1 } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';

interface ICouponData {
  tabName: string;
  list: ICouponsItem[] | null;
  loaded: boolean;
}

const emits = defineEmits(['update:show', 'comfirm', 'refresh']);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  couponCodes: {
    type: Array<string>,
    default: [],
  },
  couponUsableList: {
    type: Object,
    default: () => {},
  },
});

const tabsValue = ref<string>('0');
const selectCouponCode = ref<string>('');
const couponData = ref<ICouponData[]>([
  { tabName: '可用优惠券', list: [], loaded: false },
  { tabName: '可领优惠券', list: [], loaded: false },
]);
const isLoading = ref<boolean>(false);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

watch(isShow, async newVal => {
  if (newVal) {
    initData();
  }
});

onMounted(() => {
  initData();
});

function userStateChanged(val: number, index: number, result) {
  console.log('val: ', val, result);

  const data = couponData.value;
  if (!data[1].list || !result) return;

  Taro.nextTick(() => {
    data[0].list?.push(result);
    handleSelect(result);
    data[1].list?.splice(index, 1);
  });

  const list = {
    couponList: data[0].list,
    getCanClaimCouponList: data[1].list,
  };
  emits('refresh', list);
}

const initData = async () => {
  if (isEmpty(props.couponUsableList)) return;

  couponData.value[0].list = props.couponUsableList.couponList;
  couponData.value[1].list = props.couponUsableList.getCanClaimCouponList.map(item => {
    return { ...item, userState: 1 };
  });

  selectCouponCode.value = props.couponCodes[0];

  isLoading.value = true;
};

const handleSelect = (item: ICouponsItem) => {
  selectCouponCode.value = item.code || '';
};

const handleComfirm = () => {
  emits('comfirm', selectCouponCode.value);
  onClose();
};
const onClose = () => {
  emits('update:show', false);
};
</script>

<style lang="scss">
.pointmall_tabs {
  width: 100%;

  .nut-tab-pane {
    padding: 0;
    padding-top: 8px;
    background: transparent;
  }

  .nut-tabs__titles-item {
    color: $Secendary;
    font-family: 'FZLanTingHeiS-R-GB';
    font-size: 14px;
    font-weight: 400;
    &.active {
      font-weight: 600;
      .nut-tabs__titles-item__line {
        width: 95px;
        height: 2px;
        background: #f00;
      }
    }
  }
}

.coin-layout {
  .nut-icon-close {
    color: $white;
  }
}

::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>
<style lang="scss" module>
.container {
  position: relative;
  width: 375px;
  height: 600px;
  .title {
    width: 100%;
    margin-bottom: 8px;
  }
  .main {
    width: 375px;
    height: 420px;
    .main-item {
      width: 375px;
      .main-list {
        width: 100%;
      }
    }
  }
  .btn-wrap {
    width: 375px;
    padding: 8px 16px;
  }
  .btn {
    width: 343px;
    height: 40px;
    line-height: 40px;
    background: $primary-color;
    color: $white;
    font-size: 14px;
    text-align: center;
    margin: 0 auto;
    border-radius: 50px;
  }
  .empty-box {
    width: 375px;
    height: 449px;
  }
  .load {
    margin-top: 200px;
  }
}
</style>
