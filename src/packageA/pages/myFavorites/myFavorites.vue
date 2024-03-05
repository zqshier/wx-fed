<template>
  <BackgroundImage>
    <CustomBar title="我的收藏" />

    <view :class="$style.main" class="iphone-end nut-flex-col nut-col-center nut-row-center">
      <view v-if="isLoading && favoritesList && favoritesList.length > 0">
        <view :class="$style['product-warp']" v-for="(item, index) in favoritesList" :key="item.createdAt">
          <nut-swipe :ref="viewRefSwipe" @open="open" @close="close" :name="String(index)">
            <view :class="$style['product-item']" class="box nut-flex rounded_corners-8">
              <ProductInfo :data="item.target" :showProductQuantity="false" />
            </view>

            <template #right>
              <view :class="$style['product-danger']" class="nut-flex nut-row-center">
                <view
                  :class="$style['product-danger_content']"
                  class="nut-flex nut-row-center f_w-600"
                  @tap="handleDel(item.target.id)"
                  >一</view
                >
                <view
                  :class="[$style['product-danger_content'], $style['content_cart']]"
                  class="nut-flex nut-row-center"
                  @tap="handleAddCart(item.target, index)"
                >
                  <image :class="$style.img" src="@/static/icon/cart_white.png" mode="aspectFill"></image>
                </view>
              </view>
            </template>
          </nut-swipe>
        </view>
      </view>
      <view
        :class="$style.empty_box"
        class="nut-flex nut-flex-1 nut-flex-col nut-col-center nut-row-center"
        v-if="isLoading && favoritesList && favoritesList.length === 0"
      >
        <DefaultPage
          imgWidth="48"
          imgHeight="48"
          imgMbottom="16"
          tip="还没有收藏过宝贝哦"
          :icon="cdnurl('static/no-fav.png')"
        />
      </view>
    </view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import ProductInfo from './components/ProductInfo/ProductInfo.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import { Toast, cdnurl } from '@/utils';
import { useDidShow, useReachBottom } from '@tarojs/taro';
import { IFavorites, IFavoritesParams, targetType } from '@/dto/goods';
import { goodsFavorites, goodsFavoritesList } from '@/api/goods';
import { useCartStore } from '@/stores';
import { OMS_CART_ERROR, OMS_CART_ERROR_TEXT } from '@/constants';
import { IAddCartParams } from '@/dto/cart';
import { IEventsName, tarckEvents } from '@/utils/track';

const listParams = reactive({
  page: 1,
  perPage: 20,
  targetType: targetType.sku,
});
const finished = ref(false);
const isLoading = ref<boolean>(false);
const favoritesList = ref<IFavorites[]>();
const refSwipe = ref<any>([]);
const swipeIndex = ref<number>(-1); // 已滑动元素

// 挂载dom元素
const viewRefSwipe = el => {
  if (el) {
    refSwipe.value.push(el);
  }
};

const open = (obj: any) => {
  const indexVal = Number(obj.name);
  if (swipeIndex.value !== -1) {
    refSwipe.value[swipeIndex.value].close();
  }
  swipeIndex.value = indexVal;
};

const close = () => {
  swipeIndex.value = -1;
};

const loadList = async () => {
  if (finished.value) return;
  try {
    const { list } = await goodsFavoritesList(listParams);
    console.log('list: ', list);

    if (list.length < listParams.perPage!) {
      finished.value = true;
    }

    if (listParams.page === 1) {
      favoritesList.value = list;
    } else {
      favoritesList.value = favoritesList.value?.concat(list);
    }

    listParams.page! += 1;
    isLoading.value = true;
  } catch (error) {
    console.error('loadList error=', error);
  }
};

// 加入购物车
const handleAddCart = async (item, index) => {
  if (item.disabled || item.isSoldOut) {
    const text = item.disabled ? '商品已下架' : '商品暂无库存';
    return Toast(text);
  }

  const params: IAddCartParams = {
    goodsId: item.goodsId || 0,
    skuId: item.id,
    count: 1,
    selectPromotion: '',
  };

  try {
    await useCartStore().addShopCart(params);
    await useCartStore().getCartInfo();
    refSwipe.value[index]?.close();
    Toast('添加成功，在购物车等着你', 2000, 'none');
  } catch (error) {
    if (error.code && error.code === OMS_CART_ERROR[error.code.toUpperCase()]) {
      Toast(OMS_CART_ERROR_TEXT[error.code]);
    }
  }

  tarckEvents([
    {
      path: 'packageA/pages/myFavorites/myFavorites',
      event: IEventsName.CART_ADD_CL,
      properties: { goodsId: params.goodsId, skuId: params.skuId },
    },
  ]);
};

// 删除
const handleDel = async id => {
  const result = await favorites(id);

  if (!result || !favoritesList.value) return;
  const index = favoritesList.value?.findIndex(r => r.target.id === id);
  favoritesList.value?.splice(index, 1);
};

const favorites = async skuId => {
  const params: IFavoritesParams = {
    targetType: targetType.sku, // 收藏目标类型
    targetId: skuId, //收藏目标ID
    favorited: false, //是否收藏
  };

  let result;
  try {
    result = await goodsFavorites(params);
  } catch (error) {
    console.log('goodsFavorites: error: ', error);
  }
  return result;
};

useReachBottom(() => {
  loadList();
});

// 初始化页面的数据
const initPageData = () => {
  finished.value = false;
  listParams.page = 1;
};

const init = async () => {
  initPageData();
  await loadList();
};

useDidShow(async () => {
  await init();
});
</script>

<style lang="scss" module>
.main {
  overflow: hidden;
  margin-bottom: 20px;
  .product-warp {
    width: 343px;
    margin-top: 16px;
    box-sizing: border-box;
  }

  .product-danger {
    height: 100%;

    &_content {
      margin-left: 24px;
      width: 32px;
      height: 32px;
      background: #ff0000;
      border-radius: 50%;
      color: #fff;
    }
    .content_cart {
      background: $Primary;
      .img {
        z-index: 2;
        width: 24px;
        height: 24px;
      }
    }
  }
  .empty_box {
    margin-top: 176px;
    width: 100%;
    height: 100%;
  }
}
</style>
