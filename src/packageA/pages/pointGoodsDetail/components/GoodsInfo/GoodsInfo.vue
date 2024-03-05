<template>
  <view :class="$style['goods-info']" class="nut-flex nut-flex-col nut-col-top nut-row-left">
    <view :class="$style.title" class="nut-line-2 f_s-20 f_w-400">{{ goodsInfo?.goodsInfo.name }}</view>

    <view :class="$style['middle-warp']" class="nut-flex nut-row-between">
      <view :class="$style.amount" class="f_s-14 f_w-400 nut-flex">
        <text class="f_w-500 f_s-20 numfnt-medium">{{ pointStr }}</text>
        <text :class="$style.tinyFlame">小火苗</text>
        <!-- <block v-if="goodsInfo?.pointMallType === pointMallType.pointAndPrice"> -->
        <block v-if="priceStr > 0">
          <text>+</text>
          <text class="f_w-500 numfnt-medium" :class="$style.price">{{ priceStr }}</text>
          <text>元</text>
        </block>
      </view>
      <!-- 操作图标 -->
      <view :class="$style['middle-warp_icon']">
        <image :class="$style['icon-share']" src="@/static/icon/share.png" @tap="handleshowSharePop" />
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { LOGIN_TARGET } from '@/constants';
import { PointsGoodsSkusItem } from '@/dto/point';
import useLoginPop from '@/hook/useLoginPop';
import { usePointsGoodStore } from '@/stores';
import { onGoodsDetailClick } from '@/utils';
import { PropType, computed } from 'vue';

const { checkMemberLevel } = useLoginPop();

const props = defineProps({
  SKUData: {
    type: Object as PropType<PointsGoodsSkusItem>,
    default: () => {},
  },
  showSharePop: {
    type: Boolean,
    default: false,
  },
  showPosterPop: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['update:showSharePop', 'update:showPosterPop']);

const goodsStore = usePointsGoodStore();
const goodsInfo = computed(() => goodsStore.goodsInfo);

const pointStr = computed((): number => {
  return props.SKUData.pointMallSaleData?.point || 0;
});

const priceStr = computed((): number => {
  return props.SKUData.pointMallSaleData?.price || 0;
});

const handleshowSharePop = () => {
  checkMemberLevel(LOGIN_TARGET.sharePointsGoods, handleshowSharePop);
  // const target: string = LOGIN_TARGET.sharePointsGoods;
  // const flag = authFlow({ target });
  // Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
  //   if (target === decodeURIComponent(arg)) {
  //     emits('update:showSharePop', true);
  //   }
  // });
  // if (!flag) return;

  onGoodsDetailClick(
    {
      type: '积分商品',
      barcode: props.SKUData.barcode,
      sn: props.SKUData.sn,
      id: `${props.SKUData.id}`,
      price: +props.SKUData.pointMallSaleData.price || 0,
      point: props.SKUData.pointMallSaleData.point,
      name: goodsInfo.value?.goodsInfo.name || '',
    },
    '分享',
  );

  emits('update:showSharePop', true);
};
</script>

<style lang="scss" module>
.goods-info {
  position: relative;
  width: 343px;
  .amount {
    color: $Primary;
    font-family: FZLanTingHeiS-R-GB;
    .tinyFlame {
      margin: 0 4px;
    }
    .price {
      margin: 0 4px;
      font-family: 'FZLanTingHeiS-R-GB';
    }
  }
  .title {
    width: 338px;
    color: $Primary;
    line-height: 24px;
  }

  .middle-warp {
    width: 100%;
    margin: 12px 0;
    align-items: baseline;
    &_icon {
      margin-top: -12px;
    }
  }

  .icon-share {
    width: 24px;
    height: 24px;
    &_maR {
      margin-right: 16px;
    }
  }
}
</style>
