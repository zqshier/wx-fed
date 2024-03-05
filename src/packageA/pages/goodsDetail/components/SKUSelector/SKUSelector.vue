<template>
  <view :class="$style['sku-info']">
    <!-- 其他信息 -->
    <view
      :class="[$style['info-other'], { [$style['info-other_mg']]: showExtendsInfo }]"
      class="f_s-12 f_w-400"
      v-if="showExtendsInfo"
    >
      <view :class="$style['info-other_item']" v-if="cSkusData.sn || goodsInfo?.sn">
        <text :class="$style['item_name']">货号</text>
        <text :class="$style['item_val']">{{ cSkusData.sn || goodsInfo?.sn }}</text>
      </view>
      <view :class="$style['info-other_item']" v-if="goodsInfo?.extends?.technology">
        <text :class="$style['item_name']">工艺</text>
        <text :class="$style['item_val']">{{ goodsInfo.extends?.technology }}</text>
      </view>
      <view :class="$style['info-other_item']" v-if="goodsInfo?.extends?.releaseDate">
        <text :class="$style['item_name']">上市时间</text>
        <text :class="$style['item_val']">{{ format(new Date(goodsInfo.extends?.releaseDate), 'yyyy年MM月') }}</text>
      </view>
      <view :class="[$style['info-other_item'], $style.info_comb]" v-if="pickedSKU">
        <text :class="$style['item_name']">已选规格</text>
        <text :class="$style['item_val']" v-for="comb in selectComb" :key="comb">{{ comb }}</text>
      </view>
    </view>
    <view :class="$style.container" v-if="goodsInfo?.skuConfigs && goodsInfo?.skuConfigs.length > 0">
      <view :class="$style['goods-sku']" v-for="(skus, index) in goodsInfo?.skuConfigs" :key="skus.k">
        <view :class="$style.title" v-if="goodsInfo?.skuConfigs.length > 1">{{ skus.k }}</view>
        <view :class="$style['sku-tag']" class="nut-flex nut-flex-wrap nut-col-top nut-row-left">
          <view
            class="nut-flex nut-row-center"
            :class="[$style['sku-tag-item'], $style[`${getTagActiveClass(sku, index)}`]]"
            v-for="sku in skus.values"
            :key="sku"
            @tap.stop="handleSelectComb(sku, index)"
            >{{ sku }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { GoodsInfo, GoodsInfoSkusItem, IGoodsAct, IGoodsActItems } from '@/dto/goods';
import { skuCombs } from '@/utils';
import { IEventsName, tarckEvents } from '@/utils/track';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';
import { PropType, computed, nextTick, onMounted, ref, watchEffect } from 'vue';

const path = 'packageA/pages/goodsDetail/goodsDetail';

const emits = defineEmits(['update:skuData', 'onEnterTrack', 'onLeaveTrack']);
const props = defineProps({
  data: { type: Object as PropType<GoodsInfo | null>, default: null },
  activityInfos: { type: Array as PropType<IGoodsAct[]>, default: null },
  id: { type: Number, default: 0 },
});

const selectComb = ref<string[]>([]); // 选中模块

/** 商品信息 */
const goodsInfo = computed(() => props.data);

/** 收藏的sku */
const favoriteSKUs = computed(() => {
  const skus = goodsInfo.value?.skus;
  const id = props.id;
  if (!skus || id === 0) return [];

  const result = skus.find(s => s.id === id)?.combKey;
  return result?.split('+') || [];
});

/** SKU组合库存 */
const skusSoldOut = computed(() => skuCombs(goodsInfo.value?.skuConfigs || [], goodsInfo.value?.skus || []));

/** 活动信息 */
const actInfo = computed(
  () =>
    props.activityInfos?.filter(item => item.id === goodsInfo.value?.id)[0] || {
      promotionInfo: { priceAlias: '' },
      type: '',
      promotionId: '',
      goodsItems: [],
      name: '',
      startTime: null,
      endTime: null,
    },
);

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
    priceAlias: '', // 活动名称
    sn: '', // 商品编码
    barcode: '', // 商品条码
  };

  const skuList = cloneDeep(goodsInfo.value?.skus) || [];

  skuList.filter(item => {
    const _combStr = selectComb.value.join('+');
    if (item.combKey === _combStr) {
      result = item;
    }
  });

  // 匹配价格
  const list: IGoodsActItems[] = actInfo.value.goodsItems;
  const actRes = list.filter(items => items.skuId === result.id);

  if (actRes.length > 0) {
    result.priceAlias = actInfo.value.promotionInfo.priceAlias;
    result.price = actRes[0].price;
  }

  return result;
});

const pickedSKU = computed(() => {
  const arr = selectComb.value;
  // 无多规格时第一项值为空
  return Array.isArray(arr) && arr.length > 0 && arr[0] !== null && arr[0] !== undefined && arr[0] !== '';
});

const showExtendsInfo = computed(() => {
  return (
    goodsInfo.value?.sn ||
    goodsInfo.value?.extends?.technology ||
    goodsInfo.value?.extends?.releaseDate ||
    pickedSKU.value
  );
});

watchEffect(() => {
  // goodsStore.setSkusData(cSkusData.value);
  emits('update:skuData', cSkusData.value);
});

// 获取设置选中值
const getTagActiveClass = (sku: string, index: number) => {
  console.debug(sku, index, JSON.stringify(skusSoldOut.value), JSON.stringify(selectComb.value));
  if (selectComb.value[index] !== sku) return '';
  // if (goodsSkuIsDisabled(skusSoldOut.value, selectComb.value)) return '';
  return 'tag-active';
};

const handleSelectComb = (v: string, index: number) => {
  console.debug('handleSelectComb', v, index, JSON.stringify(selectComb.value));

  if (selectComb.value[index] === v) return;

  emits('onLeaveTrack');

  for (let i = 0; i < index + 1; i++) {
    if (i !== index && !selectComb.value[i]) {
      selectComb.value[i] = '';
    } else if (i === index) {
      selectComb.value[i] = v;
    }
  }

  const goodsId = goodsInfo.value?.id;
  const skuId = cSkusData.value.id;
  nextTick(() => emits('onEnterTrack'));
  tarckEvents([{ path, event: IEventsName.GOODS_SKU_CL, properties: { goodsId, skuId } }]);
};

const findFirstSkuWithStock = () => {
  const firstSelectedSkuWithStock = skusSoldOut.value.find(item => !item.isSoldOut);

  // 默认选中第一个有货的
  if (firstSelectedSkuWithStock) {
    for (let i = 0; i < firstSelectedSkuWithStock.key.length; i++) {
      console.log('firstSelectedSkuWithStock.key', firstSelectedSkuWithStock.key[i]);
      selectComb.value[i] = firstSelectedSkuWithStock.key[i];
    }
  } else {
    const firstSkuWithStock = skusSoldOut.value[0].key;
    for (let i = 0; i < firstSkuWithStock.length; i++) {
      selectComb.value[i] = firstSkuWithStock[i];
    }
  }
};

onMounted(async () => {
  if (favoriteSKUs.value?.length > 0) {
    selectComb.value = favoriteSKUs.value;
    return;
  }

  findFirstSkuWithStock();
});
</script>
<style lang="scss" module>
@import './SKUSelector.scss';
</style>
