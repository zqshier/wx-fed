<template>
  <CustomPopup v-model:show="isShow">
    <view :class="$style.container" v-if="cSkusData?.id || goodsInfo?.id">
      <view class="nut-flex nut-row-left nut-col-top" :class="$style['goods-info']">
        <image
          :class="$style['image']"
          :src="imageProcess(cSkusData.image || goodsInfo!.image, 'S')"
          mode="aspectFill"
          :lazy-load="true"
        ></image>
        <view :class="$style['info-right']" class="nut-flex-col nut-row-left nut-col-top f_w-400">
          <view :class="$style.name" class="nut-line-1">{{ goodsInfo?.name }}</view>
          <view :class="$style.stats" class="f_s-14" v-if="cSkusData.combKey">{{ cSkusData.combKey }}</view>
          <view :class="[$style.price]" class="numfnt nut-flex nut-row-center">
            ¥{{ cSkusData.price || goodsInfo?.price }}
          </view>
        </view>
      </view>

      <view :class="$style.main" class="nut-flex nut-flex-col nut-flex-1 nut-col-top nut-row-left">
        <view :class="$style['goods-num']" class="goods-num nut-flex nut-row-between nut-col-center">
          <view :class="$style.title"> 购买数量 </view>
          <view>
            <CustomNumberBox v-model="goodsNum" :readonly="readonly" />
          </view>
        </view>
        <view :class="$style.line"></view>
      </view>
      <view :class="$style['goods-button']" class="nut-flex nut-col-top nut-row-center">
        <nut-button
          shape="square"
          size="large"
          type="primary"
          :class="$style['comfirm-pay']"
          :loading="loadingComfirm"
          @click="handleComfirm"
          >{{ btnText }}</nut-button
        >
      </view>
    </view>
  </CustomPopup>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { computed, ref } from 'vue';
import { dProps } from './props';
import { imageProcess, Toast } from '@/utils';
import { IAddCartParams } from '@/dto/cart';
import { IPresettleInfo, IPresettleParams, IPresettleParamsItems, IPromotionsParamsItems } from '@/dto/settle';
import { useGoodsStore, useCartStore } from '@/stores';
import {
  CUSTOM_PAY_TYPE_BUY,
  CUSTOM_PAY_TYPE_ADD_CART,
  OMS_CART_ERROR,
  OMS_CART_ERROR_TEXT,
  PERSETTLE_CHECKITEM_TYPE_TEXT,
} from '@/constants';
import CustomNumberBox from '../CustomNumberBox/CustomNumberBox.vue';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { getPresettleApi } from '@/api/settle';

const goodsStore = useGoodsStore();
const emits = defineEmits(['back', 'update:show', 'comfirm']);
const props = defineProps(dProps);
const goodsNum = ref<number>(1);
const loadingComfirm = ref<boolean>(false);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

/** 商品信息 */
const goodsInfo = computed(() => goodsStore.goodsInfo);

/** 活动信息 */
const actInfo = computed(
  () => goodsStore.activityInfos.filter(item => item.id === goodsInfo.value?.id)[0] || goodsStore.defActivityInfo,
);

const btnText = computed((): string => {
  let text = '确定';
  switch (props.type) {
    case CUSTOM_PAY_TYPE_ADD_CART:
      text = '加入购物车';
      break;
    case CUSTOM_PAY_TYPE_BUY:
      text = '立即购买';
      break;
  }

  return text;
});

// 选中的suk信息
const cSkusData = computed(() => {
  return goodsStore.skusData;
});

const handleComfirm = () => {
  loadingComfirm.value = true;
  if (props.type === CUSTOM_PAY_TYPE_ADD_CART) {
    // 加入购物车
    handleAddCart();
    return;
  }
  // if (props.type === CUSTOM_PAY_TYPE_UPDATE_SKU) {
  //   // 更换sku
  //   handleUpdateSku();
  //   return;
  // }
  gotoSettlementPage();
  console.log('进入下一页');
};

// 加入购物车
const handleAddCart = async () => {
  try {
    const params: IAddCartParams = {
      goodsId: goodsInfo.value?.id || 0,
      skuId: cSkusData.value.id,
      count: Number(goodsNum.value),
      selectPromotion: actInfo.value.promotionId,
    };
    await useCartStore().addShopCart(params);
    await useCartStore().getCartInfo();
    Toast('添加成功，在购物车等着你', 2000, 'none');
    onClose();
  } catch (error) {
    if (error.code && error.code === OMS_CART_ERROR[error.code.toUpperCase()]) {
      Toast(OMS_CART_ERROR_TEXT[error.code]);
    }
  } finally {
    loadingComfirm.value = false;
  }
};

const gotoSettlementPage = async () => {
  if (!goodsInfo.value) {
    loadingComfirm.value = false;
    return;
  }

  // 购买项
  const item: IPresettleParamsItems = {
    goodsId: goodsInfo.value.id,
    skuId: cSkusData.value.id,
    count: Number(goodsNum.value),
    selectPromotion: '',
  };

  // 活动
  const promotions: IPromotionsParamsItems = {
    goodsInfos: [
      {
        goodsId: goodsInfo.value.id,
        skuId: cSkusData.value.id,
        count: Number(goodsNum.value),
      },
    ],
    promotionId: actInfo.value.promotionId,
  };

  const params: IPresettleParams = {
    items: [{ ...item }],
    promotions: cSkusData.value.priceAlias ? [{ ...promotions }] : [],
    couponCodes: [],
    settleCartMode: CUSTOM_PAY_TYPE_BUY,
    couponUsed: true,
    point: 0,
  };

  let result: { item: IPresettleInfo[] } | undefined;
  try {
    result = await getPresettleApi(params);
  } catch (error) {
    console.error('error', error);
    return Toast((error?.code && OMS_CART_ERROR_TEXT[error.code]) || error?.message || '业务繁忙，请稍后再试');
  } finally {
    loadingComfirm.value = false;
  }

  console.debug('goodsDetails page getPresettleApi result=', result);
  if (!result) return;
  if (result.item?.length > 0) {
    loadingComfirm.value = false;
    return Toast(PERSETTLE_CHECKITEM_TYPE_TEXT[result.item[0].type] || '业务繁忙，请稍后再试');
  }

  const url = `/packageA/pages/settlement/settlement?sParams=${JSON.stringify(params)}`;
  Taro.navigateTo({ url });

  onClose();
};

const onClose = () => {
  emits('update:show', false);
};
</script>
<style lang="scss" module>
@import './CustomPay.scss';
</style>
