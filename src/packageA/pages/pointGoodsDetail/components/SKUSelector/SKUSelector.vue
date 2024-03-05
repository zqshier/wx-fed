<template>
  <view :class="$style['sku-info']">
    <!-- 其他信息 -->
    <view
      :class="[$style['info-other'], { [$style['info-other_mg']]: showExtendsInfo }]"
      class="f_s-12 f_w-400"
      v-if="showExtendsInfo"
    >
      <view :class="$style['info-other_item']" v-if="goodsInfo?.sn">
        <text :class="$style['item_name']">货号</text>
        <text :class="$style['item_val']">{{ goodsInfo?.sn }}</text>
      </view>
      <view :class="$style['info-other_item']" v-if="goodsInfo?.extends?.technology">
        <text :class="$style['item_name']">工艺</text>
        <text :class="$style['item_val']">{{ goodsInfo.extends?.technology }}</text>
      </view>
      <view :class="$style['info-other_item']" v-if="goodsInfo?.extends?.releaseDate">
        <text :class="$style['item_name']">上市时间</text>
        <text :class="$style['item_val']">{{ format(new Date(goodsInfo.extends?.releaseDate), 'yyyy年MM月') }}</text>
      </view>
      <view :class="[$style['info-other_item'], $style.info_comb]" v-if="selectComb">
        <text :class="$style['item_name']">已选规格</text>
        <text :class="$style['item_val']">{{ selectComb }}</text>
      </view>
    </view>
    <view :class="$style.container" v-if="goodsInfo?.skus && goodsInfo?.skus.length > 0">
      <view :class="$style['sku-tag']" class="nut-flex nut-flex-wrap nut-col-top nut-row-left">
        <block v-for="item in goodsInfo?.skus" :key="item.id">
          <view
            v-if="item.combKey"
            class="nut-flex nut-row-center"
            :class="[$style['sku-tag-item'], $style[`${getTagActiveClass(item)}`]]"
            @tap.stop="handleSelectComb(item)"
            >{{ item.combKey }}</view
          >
        </block>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getPresettleApi } from '@/api/settle';
import {
  CUSTOM_PAY_TYPE_ADD_CART,
  CUSTOM_PAY_TYPE_BUY,
  OMS_CART_ERROR,
  OMS_CART_ERROR_TEXT,
  PERSETTLE_CHECKITEM_TYPE_TEXT,
} from '@/constants';
import { IAddCartParams } from '@/dto/cart';
import { GoodsInfoSkus, GoodsInfoSkusItem } from '@/dto/goods';
import { IPresettleParams, IPresettleParamsItems } from '@/dto/settle';
import { useCartStore, usePointsGoodStore } from '@/stores';
import { Toast } from '@/utils';
import { IEventsName, tarckEvents } from '@/utils/track';
import Taro from '@tarojs/taro';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue';

const path = 'packageA/pages/goodsDetail/goodsDetail';
const goodsStore = usePointsGoodStore();
const emits = defineEmits(['handleShop', 'onLeaveTrack', 'onEnterTrack']);

// const props = defineProps({
//   id: {
//     type: Number,
//     default: 0,
//   },
// });

const goodsNum = ref<number>(1);
const selectComb = ref<string>(''); // 选中模块
const loadingConfirm = ref<boolean>(false);

/** 商品信息 */
const goodsInfo = computed(() => goodsStore.goodsInfo?.goodsInfo);

const cSkusData = computed((): GoodsInfoSkusItem => {
  let result: GoodsInfoSkusItem = {
    comb: [],
    combKey: '',
    id: 0,
    image: '',
    isSoldOut: false,
    favorited: false,
    subscribed: false,
    price: '',
    guidePrice: '',
    priceAlias: '', // 活动名称11
    sn: '',
    barcode: '',
  };

  const skuList = cloneDeep(goodsInfo.value?.skus) || [];

  skuList.filter(item => {
    const _combStr = selectComb.value;
    if (item.combKey === _combStr) {
      result = item;
    }
  });

  return result;
});

// const pickedSKU = computed(() => {
//   const arr = selectComb.value;
//   // 无多规格时第一项值为空
//   return Array.isArray(arr) && arr.length > 0 && arr[0] !== null && arr[0] !== undefined && arr[0] !== '';
// });

const showExtendsInfo = computed(() => {
  return (
    goodsInfo.value?.sn ||
    goodsInfo.value?.extends?.technology ||
    goodsInfo.value?.extends?.releaseDate ||
    selectComb.value
  );
});

watchEffect(() => {
  goodsStore.setSkusData(cSkusData.value);
});

// 获取设置选中值
const getTagActiveClass = (sku: GoodsInfoSkus) => {
  // console.debug(sku, index, JSON.stringify(skusSoldOut.value), JSON.stringify(selectComb.value));
  if (selectComb.value !== sku.combKey) return '';
  return 'tag-active';
};

// const isHasGoNext = computed((): Boolean => {
//   // 是否可以进入下一页
//   // if (goodsSkuIsDisabled(skusSoldOut.value, selectComb.value)) return false;
//   // const _selectComb = selectComb.value.filter(item => item !== '');
//   if (selectComb.value) return true;
//   return false;
// });

const handleSelectComb = async v => {
  if (selectComb.value === v.combKey) return;
  await emits('onLeaveTrack');

  selectComb.value = v.combKey;
  nextTick(() => emits('onEnterTrack'));
};

const handleConfirm = type => {
  console.log('type: ', type);
  // if (!isHasGoNext.value) return;
  loadingConfirm.value = true;

  if (type === CUSTOM_PAY_TYPE_ADD_CART) {
    // 加入购物车
    handleAddCart(type);
    return;
  }

  gotoSettlementPage(type);
  console.log('进入下一页');
};

// 加入购物车
const handleAddCart = async type => {
  const params: IAddCartParams = {
    goodsId: goodsInfo.value?.id || 0,
    skuId: cSkusData.value.id,
    count: Number(goodsNum.value),
    selectPromotion: '',
  };
  try {
    await useCartStore().addShopCart(params);
    await useCartStore().getCartInfo();
    Toast('添加成功\r\n在购物车等着你', 2000, 'none');
    // onClose();
  } catch (error) {
    if (error.code && error.code === OMS_CART_ERROR[error.code.toUpperCase()]) {
      Toast(OMS_CART_ERROR_TEXT[error.code]);
    }
  } finally {
    loadingConfirm.value = false;
  }

  tarckEvents([{ path, event: IEventsName.CART_ADD_CL, properties: { goodsId: params.goodsId, skuId: params.skuId } }]);
  emits('handleShop', { type });
};

const gotoSettlementPage = async type => {
  if (!goodsInfo.value) {
    loadingConfirm.value = false;
    return;
  }

  // 购买项
  const item: IPresettleParamsItems = {
    goodsId: goodsInfo.value.id,
    skuId: cSkusData.value.id,
    count: Number(goodsNum.value),
    selectPromotion: '',
  };

  const params: IPresettleParams = {
    items: [{ ...item }],
    promotions: [],
    couponCodes: [],
    settleCartMode: CUSTOM_PAY_TYPE_BUY,
    couponUsed: true,
    point: 0,
  };

  let result;
  try {
    result = await getPresettleApi(params);

    // onClose();
  } catch (error) {
    console.error('error', error);

    return Toast((error?.code && OMS_CART_ERROR_TEXT[error.code]) || error?.message || '业务繁忙，请稍后再试');
  } finally {
    loadingConfirm.value = false;
  }

  if (!result) return;
  if (result.item?.length > 0) {
    loadingConfirm.value = false;
    return Toast(PERSETTLE_CHECKITEM_TYPE_TEXT[result.item[0].type] || '业务繁忙，请稍后再试');
  }
  const url = `/packageA/pages/settlement/settlement?sParams=${JSON.stringify(params)}`;
  Taro.navigateTo({
    url,
  });

  emits('handleShop', { type });
};

const findFirstSkuWithStock = () => {
  const firstSelectedSkuWithStock = goodsInfo.value?.skus.find(item => !item.isSoldOut);
  if (!firstSelectedSkuWithStock) return;
  selectComb.value = firstSelectedSkuWithStock?.combKey;
};

onMounted(async () => {
  findFirstSkuWithStock();
});

defineExpose({ handleConfirm });
</script>
<style lang="scss" module>
@import './SKUSelector.scss';
</style>
