<template>
  <view :class="$style.rating" v-if="isConfigured">
    <view :class="$style.rating_title" class="f_s-16 f_4-400 mg-bottom-16">用户评分</view>
    <view :class="$style.rating_exponent" class="f_s-12 f_4-400 nut-flex mg-bottom-16">
      <view :class="$style.exponent_title">推荐指数</view>

      <Rate v-model:value="starYes" v-model:isRate="isRating" />
    </view>

    <view :class="$style.rating_exponent" class="f_s-12 f_4-400 nut-flex nut-col-top" v-if="tagsList.length > 0">
      <view :class="$style.exponent_title">选择标签</view>
      <view :class="$style['tag-warp']" class="nut-flex nut-flex-wrap">
        <view
          :class="[$style['tag-warp_item'], { [$style['item-select']]: selectedTags.includes(item) }]"
          class="nut-flex nut-row-center"
          v-for="item in tagsList"
          :key="item"
          @tap="handleTag(item)"
          >{{ item }}</view
        >
      </view>
    </view>

    <view :class="$style.rating_btn" class="nut-flex nut-row-center f_s-12 f_4-400" v-if="!isRating">
      <nut-button
        :class="[$style.btn, { [$style['btn-submit']]: isSubmitting }]"
        :loading="loadingSubmit"
        @tap="handleSubmit"
        >提交</nut-button
      >
    </view>
  </view>
</template>
<script setup lang="ts">
import { ratingInfoApi, ratingSubmitApi } from '@/api/goods';
import { LOGIN_TARGET } from '@/constants';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/dto/events';
import { GoodsInfoSkusItem, IRatingSubmitParams } from '@/dto/goods';
import useLoginPop from '@/hook/useLoginPop';
import Rate from '@/packageA/components/Rate/Rate.vue';
import { Toast } from '@/utils';
import { getRefererPath } from '@/utils/track/config';
import { getApp } from '@tarojs/taro';
import { isEmpty } from 'lodash';
import { PropType, computed, ref, watch } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];

const props = defineProps({
  goodsId: { type: Number, default: 0 },
  cSkuData: { type: Object as PropType<GoodsInfoSkusItem>, default: () => {} },
});

const starYes = ref(0);
const selectedTags = ref<string[]>([]);
const ratingInfo = ref();
const isRating = ref<boolean>(false); // 是否评分
const loadingSubmit = ref<boolean>(false);

// 选中的suk信息
const saleSkuData = computed(() => props.cSkuData);

const isSubmitting = computed(() => starYes.value && selectedTags.value.length > 0);

// 是否配置
const isConfigured = computed(() => {
  if (!ratingInfo.value) return false;
  return !isEmpty(ratingInfo.value.cfg);
});

// 标签列表
const tagsList = computed(() => {
  if (!isConfigured.value) return;
  return ratingInfo.value?.cfg?.tags;
});

watch(
  () => saleSkuData.value.id,
  newVal => {
    getRatingInfo(newVal);
  },
  { immediate: true },
);

/**
 * 选择标签
 * @param tagId 选择的index
 */
const handleTag = (item: string) => {
  if (isRating.value) return;

  const index = selectedTags.value.indexOf(item);
  if (index === -1) {
    selectedTags.value.push(item);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

const { checkMemberLevel } = useLoginPop();
// 提交评分
const handleSubmit = async () => {
  if (!isSubmitting.value) return;

  checkMemberLevel(LOGIN_TARGET.ratingGoods, handleSubmit);
  // const target: string = LOGIN_TARGET.ratingGoods;
  // const flag = authFlow({ target });
  // Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
  //   if (target === decodeURIComponent(arg)) {
  //     handleSubmit();
  //   }
  // });
  // if (!flag) return;

  const params: IRatingSubmitParams = {
    itemId: props.goodsId, // 商品id
    skuId: saleSkuData.value.id, //  sku id
    star: starYes.value, // 推荐指数
    chooseTags: selectedTags.value, // 选择的标签
  };

  let result;

  loadingSubmit.value = true;

  try {
    result = await ratingSubmitApi(params);
    Toast('提交成功');
    isRating.value = true;
  } catch (error) {
    console.error('handleSubmitRating err=', error);
  } finally {
    loadingSubmit.value = false;
  }

  if (result) {
    onProductReviewTrack();
    for (const tag of selectedTags.value) {
      onProductTagReviewTrack(tag);
    }
  }
};

// 获取评分信息
async function getRatingInfo(skuId) {
  if (skuId === 0) return;

  let result;
  try {
    result = await ratingInfoApi({ itemId: props.goodsId, skuId });
  } catch (error) {
    console.error('getRatingInfo err=', error);
    return;
  }

  ratingInfo.value = result;
  selectedTags.value = result.chooseTags;
  starYes.value = result.star;

  if (result.chooseTags.length > 0 && result.star > 0) {
    isRating.value = true;
  } else {
    isRating.value = false;
  }
}

const onProductReviewTrack = () => {
  if (!linkflow) return;
  // 埋点 商品评价
  const { barcode: skuId = '', sn: outerSkuId = '', price: currentPrice = 0, id } = saleSkuData.value;
  const recommendationIndex = starYes.value;
  const triggerPagePath = getRefererPath();
  linkflow.track({
    event: ELinkflowEventsName.Product_Comment,
    props: {
      skuId,
      outerSkuId,
      miniSkuId: `${id}`,
      recommendationIndex,
      currentPrice,
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
};

const onProductTagReviewTrack = (tagName: string) => {
  if (!linkflow) return;
  // 埋点 商品评价标签
  const { barcode: skuId = '', sn: outerSkuId = '', id } = saleSkuData.value;
  linkflow.track({
    event: ELinkflowEventsName.ProductTag_Comment,
    props: { skuId, outerSkuId, miniSkuId: `${id}`, tagName } as ILinkflowEventsProps,
  });
};
</script>

<style lang="scss" module>
.rating {
  width: 100%;
  border-top: 0.5px solid #d9d9d9;
  padding: 16px 0;
  // padding-bottom: 16px;
  &_title {
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    line-height: 24px;
  }
  &_exponent {
    font-family: 'FZLanTingHei-R-GBK';
    color: $Tertiary;
    .exponent_title {
      width: 64px;
      color: $Secendary;
    }
    .icon-rate {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
  .tag-warp {
    width: 279px;
    &_item {
      height: 24px;
      padding: 0px 12px;
      border-radius: 24px;
      border: 1px solid $Secendary;
      color: $Primary;
      margin: 0 8px 8px 0;
    }
    .item-select {
      background: #f00;
      border: 1px solid #f00;
      color: #fff;
    }
  }
  .rating_btn {
    margin-top: 16px;
    width: 100%;
    .btn {
      width: 215px;
      height: 32px;
      border-radius: 20px;
      background: rgba($color: $Primary, $alpha: 0.6);
      color: #fff;
      font-family: 'FZLanTingHei-R-GBK';
      line-height: 18px;
      border: none;
      &-submit {
        background: $Primary;
      }
    }
  }
}
</style>
