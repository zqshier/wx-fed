<template>
  <BackgroundImage :class="$style.layout">
    <view :class="$style.header">
      <CustomBar title="购物车" />
    </view>
    <scroll-view
      v-if="isLoaded && getListLength"
      :class="$style.main"
      class="nut-flex nut-flex-col nut-flex-1"
      :scroll-y="true"
      @scroll="handleScroll"
      :scroll-top="scrollTop"
      :enhanced="true"
      :enable-passive="true"
      :show-scrollbar="true"
    >
      <view :class="$style.main_tips" class="f_s-14 nut-flex nut-row-between nut-col-center">
        <text :class="$style.f_text">{{ freightText }}</text>
        <text @tap="handleChangeDel">{{ selectDelText }}</text>
      </view>
      <block v-for="item in infoData?.items" :key="item.id">
        <view :class="$style.main_item">
          <nut-swipe>
            <view
              :class="$style.swipe_content"
              class="border-05px-box-16 rounded_corners-8 nut-flex nut-col-top nut-row-left"
            >
              <view
                :class="$style.checked_item"
                class="nut-flex nut-col-center nut-row-left"
                @tap="handleSelectItem(item)"
              >
                <CustomCheckBox
                  :key="Math.random()"
                  :check="selectDel ? delList.includes(item.id) : item.selected"
                  :m-right="0"
                />
              </view>
              <view class="nut-flex-col nut-col-center nut-row-center">
                <view :class="$style.info" class="nut-flex nut-flex-1 nut-col-top nut-row-left">
                  <view :class="$style.info_image">
                    <image
                      :class="$style['info_image-url']"
                      class="border-05px-box-0"
                      :src="imageProcess(item.goodsInfo.image, 'S')"
                      mode="aspectFill"
                      @tap.stop="gotoGoodsDetailPage(item)"
                      :lazy-load="true"
                    ></image>
                    <view
                      v-if="handleCheckTap(item).show"
                      :class="$style['info_image-none']"
                      class="nut-flex nut-col-center nut-row-center f_s-14"
                    >
                      <text>{{ handleCheckTap(item).str }}</text>
                    </view>
                  </view>
                  <view
                    :class="[$style.info_right, handleCheckTap(item).disabled ? $style['info_right-none'] : '']"
                    class="nut-flex nut-flex-1 nut-flex-col nut-col-top nut-row-left"
                  >
                    <view :class="$style.name" class="nut-line-1 f_s-14" @tap.stop="gotoGoodsDetailPage(item)">{{
                      item.goodsInfo.name
                    }}</view>
                    <view :class="$style.sku">
                      <view
                        v-if="item.goodsInfo.comb && item.goodsInfo.comb.length > 0"
                        :class="$style.sku_item"
                        class="nut-flex nut-col-center nut-row-left"
                      >
                        <view class="nut-line-1 f_s-12">{{ handleComStr(item.goodsInfo.comb) }}</view>
                        <!-- <image :class="$style.icon_down" src="../../../static/icon/arr-s.png"></image> -->
                      </view>
                    </view>
                    <view :class="$style.price" class="nut-flex nut-col-center nut-row-between">
                      <view
                        :class="$style.price_left"
                        class="f_s-18 numfnt-medium nut-flex"
                        v-show="
                          !(item.selectPromotion && actData && actData[item.id]?.actPrice) ||
                          item.availablePromotions.length === 0
                        "
                      >
                        <text class="f_s-12">¥</text>
                        <text>{{ item.mktPrice }}</text>
                      </view>
                      <!-- 活动价 -->
                      <!-- <view v-else :class="[$style.price_left, $style['price_left-color']]" class="nut-flex f_s-14">
                          <text :class="$style['price_left-width']" class="nut-line-1">{{
                            actData[item.id].actPriceAlias
                          }}</text>
                          <text>¥{{ actData[item.id].actPrice }}</text>
                        </view> -->

                      <!--加减数量 -->
                      <view :class="$style.price_operate" @tap.stop="handleStopClick">
                        <CustomNumberBox
                          v-model:value="item.buyCount"
                          :disabled="handleCheckTap(item).disabled"
                          @change="event => updateItemCount(event, item)"
                        />
                      </view>
                    </view>
                    <view v-if="item.selected && item.estimatePrice != item.totalPrice" :class="$style.new_price">
                      <text style="padding-right: 4px" class="f_s-12">预计到手价</text>
                      <text class="numfnt-medium f_w-500 f_s-14">¥{{ item.estimatePrice }}</text>
                    </view>
                  </view>
                </view>

                <!-- 一口价倒计时提示 -->
                <view
                  :class="$style.act_countdown"
                  class="nut-flex-col f_s-12 f_w-400"
                  v-if="actData && actData[item.id] && actData[item.id].countDownTime > 0"
                >
                  <view :class="$style.countdown_border"></view>
                  <view :class="$style.countdown_content" class="nut-flex">
                    <text :class="$style.countdown_name" class="nut-line-1">{{ actData[item.id].actName }}</text
                    >（距离活动还剩下
                    <view :class="$style.countdown_num"
                      ><nut-countdown
                        :end-time="actData[item.id].countDownTime"
                        class="f_s-12"
                        @on-end="initData"
                      ></nut-countdown></view
                    >）
                  </view>
                </view>
              </view>
            </view>
            <template #right>
              <view :class="$style.swipe_right">
                <nut-button
                  shape="square"
                  type="primary"
                  :loading="isDelLoading"
                  :class="$style['swipe-del-btn']"
                  @click.stop="handleDel([item.id], 'button')"
                >
                  {{ isDelLoading ? '' : '一' }}
                </nut-button>
              </view>
            </template>
          </nut-swipe>
        </view>
      </block>
      <view :class="$style.main_line"></view>
    </scroll-view>
    <view v-if="isLoaded && !getListLength" :class="$style.empty_box" class="nut-flex">
      <DefaultPage
        imgWidth="48"
        imgHeight="48"
        imgMbottom="24"
        :icon="require('@/static/icon/cart-empty.png')"
        tip="您的购物车还没有商品"
        :show-btn="true"
        :btn-style="{ 'margin-top': pxTransform(24) }"
      />
    </view>
    <view
      :class="$style.footer"
      class="nut-flex nut-row-between nut-col-top popup_filter"
      v-if="isLoaded && getListLength"
    >
      <view :class="$style.footer_left" class="nut-flex nut-col-center f_s-12" @tap="handleAllSelect">
        <CustomCheckBox :check="Boolean(selectAll)" :m-right="8" />
        <text>全选</text>
      </view>
      <view v-show="!selectDel" :class="$style.footer_right" class="nut-flex nut-col-top nut-row-left">
        <view :class="$style['footer_right-left']" class="nut-flex nut-flex-col nut-col-bottom nut-row-center f_s-12">
          <view
            v-show="Number(infoData?.orderAmount) > 0"
            :class="$style.left_top"
            class="nut-flex nut-col-center nut-row-center"
            style="align-items: baseline"
          >
            <text :class="$style.t_text" class="f_s-14">合计</text>
            <view class="f_w-500 numfnt-medium nut-flex">
              <text class="f_s-12">¥</text>
              <text class="f_s-18">{{ infoData?.orderAmount }}</text>
            </view>
          </view>
          <view
            v-if="Number(infoData?.couponDiscountAmount) || Number(infoData?.promotionDiscountAmount)"
            class="nut-flex nut-col-center"
            @tap="showOfferPop = true"
          >
            <view :class="$style.b_text">
              <text class="f_s-10" style="padding-right: 4px">优惠减</text>
              <text class="f_s-12 numfnt-medium"
                >¥{{ Number(infoData?.couponDiscountAmount) + Number(infoData?.promotionDiscountAmount) }}</text
              >
            </view>
            <image :class="$style.icon_down" src="../../../static/icon/arr-s-red.png"></image>
          </view>
        </view>
        <nut-button
          type="primary"
          :class="$style.set_btn"
          :disabled="!isChecked"
          :loading="loadingSettle"
          @click="gotoSettlementPages"
          >结算({{ totalNum }})</nut-button
        >
      </view>
      <view v-show="selectDel" :class="$style.footer_right" class="nut-flex nut-col-top nut-row-left">
        <nut-button
          type="primary"
          :plain="true"
          :class="$style.set_btn"
          :disabled="delList.length === 0"
          @click="showDelPop = true"
          >删除{{ delList.length && `(${delList.length})` }}</nut-button
        >
      </view>
    </view>

    <Notice
      v-model:show="showDelPop"
      @close="showDelPop = false"
      title=""
      :submit-loading="noticeSubmitloading"
      @submit="handleDel(delList, 'notice')"
    >
      <view :class="$style['del_pop-box']" class="f_s-14 nut-flex nut-col-center nut-row-center">
        <view>确认将这{{ delList.length }}个商品删除？</view>
      </view>
    </Notice>
    <OfferPop v-model:show="showOfferPop" />
    <!-- <CustomPay
      v-model:show="showPay"
      :type="CUSTOM_PAY_TYPE_UPDATE_SKU"
      :comb-data="combData"
      @comfirm="handleUpdateSku"
    /> -->
    <Loading :show="!isLoaded" />
    <Loading :show="showLoading" :overlay-style="{ backgroundColor: 'rgba(255, 255, 255, 0)' }" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { getPresettleApi } from '@/api/settle';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';
import CustomNumberBox from '@/components/CustomNumberBox/CustomNumberBox.vue';
import {
  CUSTOM_PAY_TYPE_ADD_CART,
  OMS_CART_ERROR,
  OMS_CART_ERROR_TEXT,
  PERSETTLE_CHECKITEM_TYPE_TEXT,
  STATUS_SALE_OUT,
  TARGET_REFRESH_CART_PAGE,
} from '@/constants';
import { ICartInfo, ICartInfoItems, ICartInfoItemsAdd, IUpdateItemCountParams } from '@/dto/cart';
import { GoodsInfoSkusComb } from '@/dto/goods';
import { IPresettleParams, IPresettleParamsItems } from '@/dto/settle';
import { useCartStore, useDtemplateStore, useGoodsStore } from '@/stores';
import { Toast, imageProcess } from '@/utils';
import Taro, { getApp, pxTransform, useDidHide, useDidShow } from '@tarojs/taro';
import { cloneDeep, debounce, isEmpty, sum } from 'lodash';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import OfferPop from './components/OfferPop/OfferPop.vue';
// import CustomPay from '@/components/CustomPay/CustomPay.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import Loading from '@/components/Loading/Loading.vue';
import Notice from '@/components/Notice/Notice.vue';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';

const IDelType = {
  button: 'button',
  notice: 'notice',
};

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();
const userCartStore = useCartStore();
// const goodsStore = useGoodsStore();

const isLoaded = ref<boolean>(false);
const showOfferPop = ref<boolean>(false);
const showPay = ref<boolean>(false);
const combData = ref<{ id: number; comb: string[]; count: number }>({ id: 0, comb: [], count: 1 }); // 选中规格数据
const loadingSettle = ref<boolean>(false);
const selectAll = ref<boolean>(false); // 全选
const selectDel = ref<boolean>(false); // 选择删除
const delList = ref<number[]>([]); // 选择删除列表
const showDelPop = ref<boolean>(false);
const noticeSubmitloading = ref<boolean>(false);
const showLoading = ref<boolean>(false);
const infoData = ref<ICartInfo | null>(null);
const actData = ref<any>(null);
const isDelLoading = ref<boolean>(false);
const scrollTop = ref<number>(0);
const old = ref<{ scrollTop: number }>({ scrollTop: 0 });

const cartInfo = computed(() => userCartStore.getCartInfos);
const freightText = computed((): string => {
  const list = useDtemplateStore().dTemplateInfo;
  if (list && list.length <= 1) {
    let threshold = (list[0] && list[0].threshold) || 0;
    return `满${threshold}元包邮`;
  }
  return '运费以结算时为准';
});

const getListLength = computed((): boolean => !isEmpty(infoData.value?.items));
const totalNum = computed((): number => {
  let num = 0;
  if (infoData.value?.items && infoData.value.items.length > 0) {
    infoData.value?.items.forEach(item => {
      if (!handleCheckTap(item).show) {
        item.selected === true ? num++ : '';
      }
    });
  }
  return num;
});

const isChecked = computed((): boolean => {
  if (infoData.value?.items && infoData.value?.items.length <= 0) return false;
  return infoData.value?.items.some(val => val.selected) || false;
});

const selectDelText = computed((): string => (selectDel.value ? '保存' : '编辑'));

watch(showPay, newVal => {
  if (!newVal) {
    combData.value = { id: 0, comb: [], count: 1 };
  }
});

watch(cartInfo, newVal => {
  if (!newVal) return;
  console.debug('cartInfo newVal', newVal);
  // Object.assign({}, infoData.value || {}, newVal);
  infoData.value = { ...infoData.value, ...newVal };
  console.debug('infoData', infoData.value);
});

onMounted(() => {
  isLoaded.value = false;
  Taro.eventCenter.on(TARGET_REFRESH_CART_PAGE, () => (isLoaded.value = false));
  handleInitSelectDel();
  handleInitPop();
  useDtemplateStore().load(); // 获取包邮规则
});

onUnmounted(() => {
  Taro.eventCenter.off(TARGET_REFRESH_CART_PAGE);
});

useDidShow(() => {
  initData();
});

useDidHide(() => {
  useGoodsStore().resetState();
  handleInitSelectDel();
  handleInitPop();
});

const handleScroll = e => {
  old.value.scrollTop = e.detail.scrollTop;
};

const initData = async () => {
  try {
    await userCartStore.getCartInfo();
    await handleInitSelect();
    actDispose();
  } finally {
    isLoaded.value = true;
  }
};

const actDispose = () => {
  const _actData: any = {};

  infoData.value?.items.map((ite: ICartInfoItems) => {
    if (ite.availablePromotions && ite.availablePromotions.length < 1) return false;

    const actItem: ICartInfoItemsAdd = { actPriceAlias: '', actPrice: '', actName: '', countDownTime: undefined };

    const actList = cloneDeep(ite.availablePromotions);
    /** 匹配活动*/
    const actListRes = actList.find(item => item.promotionId == ite.selectPromotion);
    /** 匹配活动价格 */
    const actGoodsRes = actListRes?.goodsItems.find(items => items.skuId == ite.skuId);

    /** 一口价价格别名 */
    actItem.actPriceAlias = `${actListRes && actListRes.promotionInfo && actListRes.promotionInfo.priceAlias}` || '';
    /** 一口价价格 */
    actItem.actPrice = actGoodsRes?.price || '';

    let countDownTime: any = '';
    const nowTime = new Date().getTime();
    const actTime = new Date(actListRes?.endTime || '').getTime();

    if (actTime - nowTime < 24 * 60 * 60 * 1000) {
      countDownTime = new Date(actListRes?.endTime || '');
    }
    actItem.countDownTime = countDownTime;
    /** 一口价名称 */
    actItem.actName = actListRes?.name;

    _actData[ite.id] = actItem;
  });

  actData.value = _actData;
};

const handleInitPop = () => {
  showPay.value = false;
  showOfferPop.value = false;
};

const handleInitSelectDel = () => {
  selectDel.value = false;
  delList.value = [];
};

const updateItemCount = async (count: number, item: ICartInfoItems) => {
  scrollTop.value = old.value.scrollTop; // 定位当前位置
  showLoading.value = true;
  const params: IUpdateItemCountParams = { id: item.id, count, selectPromotion: item.selectPromotion };
  try {
    await userCartStore.getUpdateItemCount(params);
  } catch (error) {
    if (error.code && error.code === OMS_CART_ERROR[error.code.toUpperCase()]) {
      Toast(OMS_CART_ERROR_TEXT[error.code]);
      userCartStore.getCartInfo();
    }
  } finally {
    showLoading.value = false;
  }
};

const handleStopClick = () => {
  console.log('阻止冒泡行为');
};

const handleComStr = (combs: GoodsInfoSkusComb[]) => {
  if (!combs?.length) return '';
  let str = '';
  combs.forEach((comb, index) => {
    str += `${comb.v}${index + 1 < combs.length ? ' , ' : ''}`;
  });
  return str;
};

// 更改规格
// const handleSelectSku = async (item: ICartInfoItems) => {
//   if (handleCheckTap(item).disabled) return;

//   showLoading.value = true;

//   combData.value.comb = combData.value.comb.concat(item.goodsInfo.comb.map(comb => comb.v));
//   combData.value.id = item.id;
//   combData.value.count = item.buyCount || 1;
//   try {
//     const data = await useGoodsStore().getGoodsInfo(item.goodsId);

//     // 设置活动信息
//     if (data.availablePromotions.length > 0) {
//       goodsStore.setActivityInfos(data.availablePromotions[0], item.goodsId);
//     }

//     showPay.value = true;
//   } catch (error) {
//     Toast(error.message, 2000, 'none');
//   } finally {
//     showLoading.value = false;
//   }
// };

const handleDel = debounce(async (id: number[], type: string) => {
  if (type === IDelType.button) isDelLoading.value = true;
  if (type === IDelType.notice) noticeSubmitloading.value = true;
  const items: number[] = [...id];
  // items.push(item.id);
  try {
    await userCartStore.getRemoveItems(items);
    if (type === IDelType.notice) {
      showDelPop.value = false;
      setTimeout(() => {
        delList.value = [];
      }, 300);
    } else {
      await handleInitSelect();
    }
  } catch (error) {
    Toast(error.message, 2000);
  } finally {
    if (type === IDelType.button) isDelLoading.value = false;
    if (type === IDelType.notice) noticeSubmitloading.value = false;
  }
}, 500);

// 更新sku
// const handleUpdateSku = async (item: IUpdateSkuParams) => {
//   try {
//     await userCartStore.getUpdateSku(item);
//     showPay.value = false;
//     actDispose();
//   } catch (error) {
//     if (error.code && error.code === OMS_CART_ERROR[error.code.toUpperCase()]) {
//       Toast(OMS_CART_ERROR_TEXT[error.code]);
//     }
//   }
// };

// const gotoSettlementPages = async () => {
//   if (!isChecked.value) return;
//   loadingSettle.value = true;
//   const params: ISettleCartParams = {
//     couponCodes: infoData.value?.couponCodes || [],
//     couponUsed: true,
//     point: infoData.value?.point || 0,
//   };
//   try {
//     await useSettleStore().getSettleCart(params);
//     const _mode = CUSTOM_PAY_TYPE_ADD_CART;
//     const url = `/packageA/pages/settlement/settlement?sParams=${JSON.stringify(params)}&mode=${_mode}`;
//     Taro.navigateTo({
//       url,
//     });
//   } catch (error) {
//     console.error('error', error);
//     if (error.code && error.code === OMS_CART_ERROR[error.code.toUpperCase()]) {
//       Toast(OMS_CART_ERROR_TEXT[error.code]);
//     }
//   } finally {
//     loadingSettle.value = false;
//   }
// };

const gotoSettlementPages = async () => {
  if (!isChecked.value) return;
  loadingSettle.value = true;

  const selectData = infoData.value!.items.filter(item => item.selected);

  // 活动
  let promotions: any = [];

  const items: IPresettleParamsItems[] = selectData.map(item => {
    let obj = {
      goodsId: item.goodsId,
      skuId: item.skuId,
      count: Number(item.buyCount),
      selectPromotion: item.selectPromotion,
    };

    // 查找活动有效或存在
    const isValid = item.availablePromotions.find(ite => ite.promotionId === item.selectPromotion);

    if (item.selectPromotion && isValid) {
      let newList = promotions.find(i => i.promotionId == item.selectPromotion);
      if (!newList) {
        const data = {
          goodsInfos: [{ ...obj }],
          promotionId: item.selectPromotion,
        };

        promotions.push(data);
      } else {
        let has = promotions.findIndex(o => o.promotionId === item.selectPromotion);
        promotions[has].goodsInfos.push(obj);
      }
    }

    return obj;
  });

  const params: IPresettleParams = {
    items,
    promotions,
    couponCodes: infoData.value?.couponCodes || [],
    settleCartMode: CUSTOM_PAY_TYPE_ADD_CART,
    couponUsed: true,
    point: infoData.value?.point || 0,
  };

  let result;
  try {
    result = await getPresettleApi(params);
  } catch (error) {
    console.log('error: ', error);

    return Toast(
      (error?.code && PERSETTLE_CHECKITEM_TYPE_TEXT[error.code]) || error?.message || '业务繁忙，请稍后再试',
    );
  } finally {
    loadingSettle.value = false;
  }

  if (!result) return;
  if (result.item?.length > 0) {
    console.debug('cart page getPresettleApi result=', result.item);

    loadingSettle.value = false;
    return Toast(PERSETTLE_CHECKITEM_TYPE_TEXT[result.item[0].type] || '业务繁忙，请稍后再试');
  }
  const url = `/packageA/pages/settlement/settlement?sParams=${JSON.stringify(params)}`;
  Taro.navigateTo({
    url,
  });

  // const path = 'packageA/pages/cart/cart';
  // const event = IEventsName.ORDER_SETTLE_CL;
  // const tarckEventsParams = items.map(i => ({
  //   event,
  //   path,
  //   properties: { goodsId: i.goodsId, skuId: i.skuId },
  // }));
  // tarckEvents(tarckEventsParams);

  if (!linkflow) return;
  selectData.forEach(i => {
    linkflow.track({
      event: ELinkflowEventsName.ShoppingCart_Detail_Settlement,
      props: {
        productName: i.goodsInfo.name,
        skuId: i.goodsInfo.barcode,
        outerSkuId: i.goodsInfo.skuSn,
        miniSkuId: `${i.skuId}`,
        price: +i.mktPrice || i.mktPrice,
        itemTotalPrice: +i.totalPrice || i.totalPrice,
        quantity: i.buyCount,
        triggerPagePath,
      } as ILinkflowEventsProps,
    });
  });

  linkflow.track({
    event: ELinkflowEventsName.ShoppingCart_Settlement,
    props: { quantity: sum(selectData.map(i => i.buyCount)), triggerPagePath } as ILinkflowEventsProps,
  });
};

const changeAllSelect = (flag: boolean) => {
  selectAll.value = flag;
};

const handleCheckTap = (item: ICartInfoItems) => {
  const result = { show: false, str: '', disabled: false };
  if (item.stockOut) {
    result.show = true;
    result.disabled = false;
    result.str = '无货';
  }
  if (item.saleStatus === STATUS_SALE_OUT || item.disabled) {
    result.show = true;
    result.disabled = true;
    result.str = '已下架';
  }
  if (item.onSaleAt && new Date(item.onSaleAt).getTime() > new Date().getTime()) {
    result.show = true;
    result.disabled = false;
    result.str = '未开售';
  }
  return result;
};

const handleInitSelect = () => {
  const list = (infoData.value?.items && cloneDeep(infoData.value?.items)) || [];
  if (list && list.length === 0) return;
  let flag = true;
  let select_disabled_len = 0;
  list.forEach((item: ICartInfoItems) => {
    if (!handleCheckTap(item).show) {
      if (!item.selected) flag = false;
    } else {
      item.selected = false;
      select_disabled_len++;
    }
  });
  // 如果购物车全部都是不可点击的商品，全选按钮不勾选
  if (select_disabled_len === list.length) flag = false;

  infoData.value ? (infoData.value.items = Object.assign(infoData.value.items, list)) : '';
  // console.warn('handleInitSelect infoData', infoData.value);
  // infoData.value ? (infoData.value.items = list) : '';
  changeAllSelect(flag);
};

const handleAllSelect = async () => {
  // 全选 删除
  if (selectDel.value) return handleAllDelListSelect();

  // 判断购物车列表是否可以点击全选
  const canSelects = infoData.value?.items.filter(i => !handleCheckTap(i).show);
  if (!canSelects?.length) return;

  const list = (infoData.value?.items && cloneDeep(infoData.value?.items)) || [];
  if (list && list.length === 0) return;
  const ids: number[] = [];
  selectAll.value = !selectAll.value;
  list.forEach((item: ICartInfoItems, index) => {
    ids.push(item.id);
    item.selected = selectAll.value;
    if (handleCheckTap(item).show) {
      // 无库存、已下架、未到预售时间不允许点击
      item.selected = false;
      ids.splice(index, 1);
    }
  });
  infoData.value ? (infoData.value.items = Object.assign(infoData.value.items, list)) : '';
  await userCartStore.getSelectItems({ ids, select: selectAll.value });
  await handleInitSelect();
};

// 选择单个订单
const handleSelectItem = async (item: ICartInfoItems) => {
  // 删除选择
  if (selectDel.value) return handleSelectDelItem(item);

  if (handleCheckTap(item).show) return;
  item.selected = !item.selected;
  infoData.value?.items.forEach((itm: ICartInfoItems) => {
    if (itm.id === item.id) itm = item;
  });
  if (item.selected === false) {
    changeAllSelect(false);
  }
  await userCartStore.getSelectItems({ ids: [item.id], select: item.selected });
  await handleInitSelect();
};

const handleChangeDel = () => {
  selectDel.value = !selectDel.value;
  if (selectDel.value) changeAllSelect(false);
  if (!selectDel.value) {
    delList.value = [];
    handleInitSelect();
  }
};

// 选择删除订单
const handleSelectDelItem = async (item: ICartInfoItems) => {
  if (delList.value.indexOf(item.id) === -1) {
    delList.value.push(item.id);
  } else {
    const index = delList.value.indexOf(item.id);
    delList.value.splice(index, 1);
  }
  changeAllSelect(delList.value.length === infoData.value?.items.length);
};

const handleAllDelListSelect = () => {
  selectAll.value = !selectAll.value;
  const ids: number[] = [];
  if (selectAll.value) {
    const list = (infoData.value?.items && infoData.value?.items) || [];
    if (!list?.length) return;
    list.forEach((item: ICartInfoItems) => {
      ids.push(item.id);
    });
  }
  delList.value = ids;
};

const gotoGoodsDetailPage = (item: ICartInfoItems) => {
  Taro.navigateTo({
    url: `/packageA/pages/goodsDetail/goodsDetail?id=${item.goodsId}`,
  });
};
</script>

<style lang="scss" module>
@import './cart.scss';
</style>
