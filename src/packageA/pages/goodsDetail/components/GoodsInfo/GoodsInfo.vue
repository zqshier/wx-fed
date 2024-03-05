<template>
  <view :class="$style['goods-info']" class="nut-flex nut-flex-col nut-col-top nut-row-left">
    <view :class="$style.title" class="nut-line-2 f_s-20 f_w-400">{{ goodsInfo?.name || '' }}</view>

    <view :class="$style['middle-warp']" class="nut-flex nut-row-between">
      <view :class="$style.amount" class="f_s-20 f_w-500 nut-flex">
        <view :class="[$style['amount-top']]" class="numfnt-medium">
          <text class="num">¥</text>
          <text>{{ priceStr }}</text>
        </view>

        <view v-if="guidePriceStr" :class="$style['amount-bottom']" class="f_s-14">¥{{ guidePriceStr }}</view>
      </view>
      <view :class="$style['middle-warp_icon']">
        <image
          :class="[$style['icon-share'], $style['icon-share_maR'], { [$style['scale-up-center']]: isCollect }]"
          :src="isCollect ? require('@/static/icon/active=yes.png') : require('@/static/icon/active=no.png')"
          @tap="handlesCollect"
        />
        <image :class="$style['icon-share']" src="@/static/icon/share.png" @tap="handleshowSharePop" />
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { goodsFavorites } from '@/api/goods';
import { LOGIN_TARGET } from '@/constants';
import { GoodsInfo, GoodsInfoSkusItem, IFavoritesParams, targetType } from '@/dto/goods';
import useLoginPop from '@/hook/useLoginPop';
import { useUserStore } from '@/stores/modules/user';
import { Toast, onGoodsDetailClick } from '@/utils';
import Taro from '@tarojs/taro';
import { throttle } from 'lodash';
import { PropType, computed } from 'vue';

const { checkMemberLevel } = useLoginPop();

const props = defineProps({
  data: { type: Object as PropType<GoodsInfo | null>, default: () => {} },
  SKUData: {
    type: Object as PropType<GoodsInfoSkusItem>,
    default: () => {},
  },
  showSharePop: { type: Boolean, default: false },
  showPosterPop: { type: Boolean, default: false },
});

const emits = defineEmits(['update:showSharePop', 'update:showPosterPop']);

const goodsInfo = computed(() => props.data);
// 登录状态
const isLogedIn = computed((): Boolean => !!useUserStore().isPhone);
// 收藏
const isCollect = computed(() => (props.SKUData.favorited && isLogedIn.value) || false);
const priceStr = computed((): string => props.SKUData.price || '0.00');

const guidePriceStr = computed((): string => props.SKUData.guidePrice || '');

const handleshowSharePop = () => {
  checkMemberLevel(LOGIN_TARGET.shareGoods, handleshowSharePop);

  onGoodsDetailClick(
    {
      type: '商品',
      barcode: props.SKUData.barcode,
      sn: props.SKUData.sn,
      id: `${props.SKUData.id}`,
      price: +props.SKUData.price || 0,
      name: goodsInfo.value?.name || '',
    },
    '分享',
  );

  emits('update:showSharePop', true);
};

// 收藏
const handlesCollect = throttle(
  async () => {
    checkMemberLevel(LOGIN_TARGET.collectGoods, handlesCollect);

    !isCollect.value &&
      onGoodsDetailClick(
        {
          type: '商品',
          barcode: props.SKUData.barcode,
          sn: props.SKUData.sn,
          id: `${props.SKUData.id}`,
          price: +props.SKUData.price || 0,
          name: goodsInfo.value?.name || '',
        },
        '点赞',
      );

    const isFavorites = await favorites();
    setSkusFavorites(isFavorites);

    const toastText = isFavorites.favorited ? '收藏成功' : '取消收藏成功';
    Toast(toastText, 2000, 'none');

    if (!isFavorites.favorited) return;
    Taro.vibrateShort();
  },
  500,
  {
    leading: true,
    trailing: false,
  },
);

const favorites = async () => {
  const params: IFavoritesParams = {
    targetType: targetType.sku, // 收藏目标类型
    targetId: String(props.SKUData.id), //收藏目标ID
    favorited: !isCollect.value, //是否收藏
  };
  let result;
  try {
    result = await goodsFavorites(params);
  } catch (error) {
    console.log('goodsFavorites: error: ', error);
  }
  return result;
};

async function setSkusFavorites(data) {
  // isCollect.value = data.favorited;
  const findSkus = goodsInfo.value?.skus.find(item => item.id === props.SKUData.id);
  if (findSkus) {
    findSkus.favorited = data.favorited;
  }
}
</script>

<style lang="scss" module>
.goods-info {
  position: relative;
  width: 343px;
  .amount {
    color: $Primary;
    .amount-top {
      margin-right: 8px;
      &-color {
        color: #fe6318;
      }
      // .actName {
      //   margin-right: 4px;
      // }
    }
    .amount-bottom {
      line-height: 20px;
      position: relative;
      color: $Tertiary;
      font-family: 'CentraleSans';
      text-decoration: line-through;
    }
  }
  .title {
    width: 338px;
    color: $Primary;
    line-height: 24px;
    // margin-bottom: 10px;
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

  .scale-up-center {
    -webkit-animation: scale-up-center 0.4s;
    animation: scale-up-center 0.4s;
  }
  /* ----------------------------------------------
 * Generated by Animista on 2023-7-4 17:31:25
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */
  @keyframes scale-up-center {
    0% {
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
}
</style>
