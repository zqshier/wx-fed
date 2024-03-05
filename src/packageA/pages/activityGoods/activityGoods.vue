<template>
  <view class="container">
    <CustomBar title="活动商品" />
    <view :class="$style.main" class="nut-flex nut-flex-col nut-flex-1" v-if="goodsList && goodsList.length > 0">
      <block v-for="item in goodsList" :key="item.id">
        <view
          :class="$style.list"
          class="box nut-flex nut-row-between f_w-400 f_s-14 mg-bottom-8"
          @tap="goGoodsDetails(item.id)"
        >
          <image :class="$style.list_img" :src="itemImage(item)" mode="aspectFill" :lazyLoad="true"></image>
          <view :class="$style.list_content" class="nut-flex-col nut-row-between">
            <view :class="$style.content_title" class="nut-line-2 nut-flex-col nut-row-between">{{ item.name }}</view>
            <view :class="$style.content_price" class="nut-flex">
              <text :class="$style.price_name" class="nut-line-1">{{ actInfo?.priceAlias }}</text>
              <text>￥{{ item.price }}</text>
            </view>
          </view>
        </view>
      </block>
    </view>
    <!-- <view v-else :class="$style.main" class="nut-flex nut-flex-1 nut-col-center nut-row-center">
      <DefaultPage
        imgWidth="82"
        imgHeight="68"
        imgMbottom="30"
        :icon="cdnurl('static/no-location.png')"
        tip="暂无数据"
      />
    </view> -->
  </view>
</template>

<script setup lang="ts">
import { useReachBottom, useRouter, getCurrentPages } from '@tarojs/taro';
import { onMounted, reactive, ref } from 'vue';
import { imageProcess, Toast } from '@/utils';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { getActGoods } from '@/api/activity';
import { IActGoodsItem, IActPromotionInfo } from '@/dto/activity';
import Taro from '@tarojs/taro';
const router = useRouter();
const promotionId: string = router.params.id || 'bd4x06zr';

const listParams = reactive({
  page: 1,
  perPage: 20,
  promotionId: promotionId,
});
const finished = ref<boolean>(false);

const goodsList = ref<IActGoodsItem[]>([]);
const actInfo = ref<IActPromotionInfo>();

const getList = async () => {
  if (finished.value) {
    Toast('没有更多了');
    return;
  }

  try {
    const { list, promotionInfo } = await getActGoods(listParams);

    actInfo.value = promotionInfo;

    if (list.length < listParams.perPage!) {
      finished.value = true;
    }

    for (const row of list) {
      if (goodsList.value.find(o => o.id === row.id)) continue;
      goodsList.value.push(row);
    }

    listParams.page! += 1;
  } catch (error) {
    console.error('loadList error=', error);
  }
};

const goGoodsDetails = async (id: number = 0) => {
  // const pageList = await getCurrentPages();
  // let _delta = 0;
  // console.debug('activityGoods page goGoodsDetails navigateTo id', id);
  // console.debug('activityGoods page goGoodsDetails pageList', pageList);

  // try {
  //   pageList.forEach((page, index) => {
  //     if (page.route === 'packageA/pages/goodsDetail/goodsDetail') {
  //       if (page?.options) {
  //         const { id: gid } = page.options;
  //         if (Number(gid) === id) {
  //           _delta = index;
  //           throw '循环终止';
  //         }
  //       }
  //     }
  //   });
  // } catch (e) {
  //   console.error('activityGoods page goGoodsDetails e', e);
  // }

  // const delta = _delta ? pageList.length - 1 - _delta : 0;
  // console.debug('activityGoods page goGoodsDetails delta', delta);
  // if (delta) {
  //   Taro.navigateBack({
  //     delta,
  //   });
  //   return;
  // }
  Taro.navigateTo({
    url: `/packageA/pages/goodsDetail/goodsDetail?id=${id}`,
  });
};

/** 优先使用商品主图，否则使用封面图 */
const itemImage = (item: IActGoodsItem) => {
  if (item.images?.length) return imageProcess(item.images[0].url, 'S');
  return imageProcess(item.image, 'S');
};

onMounted(async () => {
  await getList();
});

useReachBottom(() => {
  getList();
});
</script>

<style lang="scss" module>
.main {
  padding-top: 14px;
  background: #f1f1f1;
  .list {
    width: 345px;
    height: 140px;
    box-sizing: border-box;
    &_img {
      margin-right: 14px;
      width: 96px;
      height: 96px;
      border-radius: 8px;
      background: #f1f1f1;
    }
    &_content {
      color: $font-color;
      width: 200px;
      height: 96px;
      .content_title {
        max-width: 199px;
      }
      .content_price {
        color: $Secendary;
        .price_name {
          max-width: 170px;
        }
      }
    }
  }
}
</style>
