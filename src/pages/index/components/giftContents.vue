<template>
  <scroll-view
    :scroll-y="true"
    :show-scrollbar="false"
    :enhanced="true"
    :enable-flex="true"
    :class="$style.content_scroll"
  >
    <view :class="$style.content" class="nut-flex-col nut-col-center" v-if="list.length > 0">
      <block v-for="(item, index) in list" :key="index">
        <view :class="$style.content_item" class="nut-flex-col nut-col-center">
          <CouponItem
            v-if="item.type === 'coupon'"
            :itemData="(item.value as ICouponsItem)"
            :isGet="!!getMemberLevel"
            :showRule="true"
            :isBorder="false"
            :nameFontSize="{ fontSize: '10px' }"
            :timeFontSize="{ fontSize: '8px' }"
            :priceFontSize="{ fontSize: '14px' }"
            :couponWarpStyle="couponWarpStyle"
          />
          <PointBox v-if="item.type === 'point'" :value="(item.value as string)" :isGet="!!getMemberLevel" />
        </view>
      </block>
    </view>
  </scroll-view>
</template>
<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { INewComerGiftsInfo } from '@/dto/user';
import { useUserStore } from '@/stores';
import CouponItem from './CouponItem/CouponItem.vue';
import PointBox from '@/components/PointBox/PointBox.vue';
import { ICouponsItem } from '@/dto/coupons';
const userStore = useUserStore();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array as PropType<INewComerGiftsInfo[]>,
    default: null,
  },
});

const couponWarpStyle = {
  height: '82px',
  width: '233px',
  borderRadius: '6px',
  background: '#FFF',
  border: 'none',
  boxShadow: '0px 2.62857px 6.57143px 0px rgba(165, 165, 165, 0.65)',
};

const list = computed((): INewComerGiftsInfo[] => props.data);

const getMemberLevel = computed((): Boolean => userStore.isMemberLevel);
</script>
<style lang="scss">
.newGift {
  .nutui-iconfont {
    font-weight: 600;
    color: #444;
  }
}
</style>
<style lang="scss" module>
.content_scroll {
  width: 100%;
  max-height: 185px;
  min-height: 92px;
  margin: 16px 0;
  overflow: hidden;
  .content {
    width: 100%;
    margin-top: 3px;
    min-height: 90px;
    .content_item {
      width: 240px;
      min-height: 90px;
      // margin-bottom: 2px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
