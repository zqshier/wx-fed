<template>
  <BackgroundImage>
    <CustomBar title="订单评价" :fixed="true" />

    <view :class="$style.main" v-if="infoLoaded">
      <view :class="[$style.title, $style['title-top']]" class="f_s-12 f_w-400 mg-bottom-24"
        >为了不断提升品牌服务，您的评价对我们至关重要</view
      >

      <block v-if="data && data.length > 0">
        <view
          :class="[$style.order_item]"
          class="box mg-bottom-14"
          v-for="(goods, index) in data"
          :key="goods.goodsInfo.id"
        >
          <view :class="$style.title" class="f_s-12 f_w-400 mg-bottom-12">商品信息</view>

          <view :class="$style.list" @tap="gotoGoodsDetailsPage(goods.goodsInfo)">
            <OrderBox :data="goods.goodsInfo" />
          </view>

          <!-- 商品评价 -->
          <view :class="$style.rating">
            <view
              :class="$style.rating_item"
              class="nut-flex nut-row-between f_s-14 f_w-400 mg-bottom-12"
              v-for="rate in goods.rateList"
              :key="rate.title"
            >
              <view :class="$style.item_title">{{ rate.title }}</view>
              <Rate v-model:value="rate.value" v-model:isRate="isReadonly" />
            </view>
          </view>

          <!-- 推荐指数 -->
          <view :class="$style.score_bar">
            <view :class="$style.title" class="f_s-14 f_w-600 mg-bottom-12"
              >您有多大可能将该款火机推荐给朋友或其他人？</view
            >
            <view :class="$style['score_bar-index']" class="nut-flex nut-row-between mg-bottom-12">
              <text
                :class="[$style['index-item'], { [$style['item-select']]: goods.recommendationStar === item }]"
                class="numfnt nut-flex nut-row-center f_s-12 f_w-500"
                v-for="item in scoreBarNum"
                :key="item"
                @tap="handleItemSelection(item, index)"
                >{{ item }}</text
              >
            </view>
            <view :class="[$style.title, $style['score_bar-ins']]" class="f_s-14 f_w-400 mg-bottom-4"
              >您的评价不会被公开展示</view
            >
          </view>
        </view>
      </block>
      <view :class="$style.main_placeholder"></view>
    </view>

    <view :class="$style.footer" class="f_s-12 f_w-400 nut-flex nut-col-top nut-row-left footer" v-if="!isReadonly">
      <nut-button
        :disabled="isSubmitDisabled"
        :class="$style.btn"
        type="primary"
        :loading="loadingSubmit"
        @click="submitComment"
        >提交</nut-button
      >
    </view>

    <Loading :show="!infoLoaded" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { commentApi, getCommentApi } from '@/api/order';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import Loading from '@/components/Loading/Loading.vue';
import OrderBox from '@/components/OrderItem/OrderBox.vue';
import { ICommentParams, ICommentParamsItem, IOrderInfoItems, IRateList, OrderCommentStatus } from '@/dto/order';
import { FINISH_TYPE } from '@/dto/settle';
import { ELinkflowEventsName, IEventsName, ILinkflowEventsProps, tarckEvents } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp, useRouter } from '@tarojs/taro';
import { cloneDeep } from 'lodash';
import { computed, onMounted, ref } from 'vue';
import Rate from '../../../components/Rate/Rate.vue';

interface IData {
  goodsInfo: IOrderInfoItems;
  rateList: IRateList[];
  recommendationStar: number;
}

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const path = 'pages/order/orderReview/orderReview';
const scoreBarNum = Array.from({ length: 11 }, (_, index) => index);

const router = useRouter();

const orderNo: string = router.params.orderNo || '';
const type: string = router.params.type || '';
const preloadData = Taro.getCurrentInstance().preloadData || {};
const goodsData: IOrderInfoItems[] = preloadData.goodsData;

const infoLoaded = ref<boolean>(false);
const rateList: IRateList[] = [
  { title: '产品满意度', value: 0, name: 'productStar' },
  { title: '包装满意度', value: 0, name: 'productPackagingStar' },
  { title: '客服满意度', value: 0, name: 'customerServiceStar' },
  { title: '物流满意度', value: 0, name: 'logisticsStar' },
];

const data = ref<IData[]>([]);
const submitParams = ref<ICommentParams>({
  orderNo,
  items: [],
});
const loadingSubmit = ref(false);

const isSubmitDisabled = computed(() => {
  return data.value.some(product => {
    return product.recommendationStar === -1 || product.rateList.some(dimension => dimension.value === 0);
  });
});

const isReadonly = computed(() => type !== OrderCommentStatus.default);

function gotoGoodsDetailsPage(item) {
  tarckEvents([{ path, event: IEventsName.GOODS_CL, properties: { goodsId: item.goodsId } }]);
  Taro.navigateTo({
    url: `/packageA/pages/goodsDetail/goodsDetail?id=${item.goodsId}`,
  });
}

/**
 * 选择推荐指数分
 * @param val 选择分
 */
function handleItemSelection(val: number, index: number) {
  if (isReadonly.value) return;
  data.value[index].recommendationStar = val;
}

const getComment = async () => {
  let result;
  try {
    result = await getCommentApi(orderNo);
  } catch (error) {
    console.error('getCommentApi error=', error);
  }

  if (!result) return;

  // result = [
  //   {
  //     id: 9,
  //     skuId: 778,
  //     createdAt: '2023-10-31T05:47:56.093Z',
  //     updatedAt: '2023-10-31T05:47:56.093Z',
  //     appId: 'zippo',
  //     orderNo: '2310281545000004',
  //     goodsInfo: {
  //       comb: false,
  //       meta: { couponCode: '' },
  //       name: '测试商品0823（3）',
  //       type: 0,
  //       image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/08/5a128238b4de46449a2b339cb6efb40a.jpeg',
  //       skuSn: '123456',
  //       goodsSn: '123456',
  //     },
  //     productStar: 3,
  //     state: null,
  //     productPackagingStar: 5,
  //     customerServiceStar: 5,
  //     logisticsStar: 3,
  //     recommendationStar: 8,
  //   },
  // ];

  result.map(product => {
    const foundProduct = data.value.find(item => item.goodsInfo.skuId === product.skuId);

    if (!foundProduct) return;
    foundProduct.rateList.map(dimension => {
      const { name } = dimension;
      if (Object.prototype.hasOwnProperty.call(product, name)) {
        dimension.value = product[name];
      }
    });
    foundProduct.recommendationStar = product.recommendationStar;
  });
};

async function submitComment() {
  const item: ICommentParamsItem[] = [];

  data.value.map(product => {
    const targetObject = {
      goodsId: 0,
      skuId: 0,
      productStar: 0,
      productPackagingStar: 0,
      customerServiceStar: 0,
      logisticsStar: 0,
      recommendationStar: -1,
    };
    product.rateList.map(dimension => {
      const { name, value } = dimension;
      if (Object.prototype.hasOwnProperty.call(targetObject, name)) {
        targetObject[name] = value;
      }
    });

    targetObject.skuId = product.goodsInfo.skuId;
    targetObject.goodsId = product.goodsInfo.goodsId;
    targetObject.recommendationStar = product.recommendationStar;
    item.push(targetObject);
  });

  submitParams.value.items = item;
  console.log('combinedData: ', item);

  // return;
  loadingSubmit.value = true;
  let result;
  try {
    result = await commentApi(submitParams.value);
  } catch (error) {
    console.error('commentApi error=', error);
  } finally {
    loadingSubmit.value = false;
  }

  if (!result) return;
  onTrack();

  Taro.preload({ type: FINISH_TYPE.orderDetails, orderNo, title: '提交成功', tips: '感谢您宝贵的建议' });
  Taro.redirectTo({
    url: `/packageA/pages/finish/finish`,
  });
}

function initialData() {
  goodsData.map(item => {
    const obj = {
      goodsInfo: item,
      rateList: cloneDeep(rateList),
      recommendationStar: -1,
    };
    data.value.push(obj);
  });
  infoLoaded.value = true;
}

onMounted(async () => {
  initialData();
  if (type === OrderCommentStatus.comment) {
    await getComment();
  }
});

const onTrack = () => {
  if (!linkflow) return;
  submitParams.value.items.forEach(p => {
    const goodsData = data.value.find(
      i => `${i.goodsInfo.goodsId}-${i.goodsInfo.skuId}` === `${p.goodsId}-${p.skuId}`,
    )?.goodsInfo;
    if (goodsData?.id) {
      linkflow.track({
        event: ELinkflowEventsName.OrderDetail_Comment_Submit,
        props: {
          productName: goodsData.goodsInfo.name,
          skuId: goodsData.goodsInfo.skuBarCode,
          outerSkuId: goodsData.goodsInfo.skuSn,
          miniSkuId: `${goodsData.skuId}`,
          price: +goodsData.mktPrice || goodsData.mktPrice,
          itemTotalPrice: +goodsData.totalPrice || goodsData.totalPrice,
          quantity: goodsData.count,
          itemPaymentPrice: +goodsData.payableAmount || goodsData.payableAmount,
          productSatisfaction: p.productStar,
          packagingSatisfaction: p.productPackagingStar,
          customerServiceSatisfaction: p.customerServiceStar,
          logisticsSatisfaction: p.logisticsStar,
          possibilityOfRecommendation: p.recommendationStar,
          orderId: submitParams.value.orderNo,
          lineId: `${submitParams.value.orderNo}-${goodsData.skuId}`,
          triggerPagePath,
        } as ILinkflowEventsProps,
      });
    }
  });
};
</script>
<style lang="scss" module>
.main {
  height: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
  z-index: 1;
  .title-top {
    width: 100%;
    text-align: center;
  }

  .order_item {
    padding-bottom: 10px;
    border-radius: 8px;
  }
  .list {
    width: 100%;
    margin-bottom: 12px;
  }
  .title {
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
  }

  .rating {
    margin: 16px 0;
    padding: 16px 0;
    border-top: 0.5px solid #d9d9d9;
    border-bottom: 0.5px solid #d9d9d9;
    .rating_item:last-child {
      margin-bottom: 0;
    }
    .item_title {
      color: $Secendary;
    }
  }

  .score_bar {
    &-index {
      height: 22px;
      .index-item {
        width: 20px;
        height: 20px;
        box-sizing: border-box;
        padding-top: 2px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid $Primary;
      }
      .item-select {
        color: #fff;
        background: #f00;
        border: 1px solid #f00;
      }
    }
    &-ins {
      color: $Tertiary;
      text-align: end;
    }
  }
  .main_placeholder {
    height: 73px;
  }
}
.footer {
  z-index: 2;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 375px;
  height: 88px;
  background: #fff;
  padding: 8px;
  border-radius: 28px 28px 0px 0px;
  background: var(--bottom, rgba(165, 165, 165, 0.08));
  box-shadow: 0px 0px 16px 16px rgba(165, 165, 165, 0.15) inset;
  backdrop-filter: blur(8px);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .btn {
    width: 359px;
    height: 40px;
    border-radius: 20px;
    color: #fff;
    font-family: 'FZLanTingHei-R-GBK';
  }
}
</style>
