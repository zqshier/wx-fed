<template>
  <view>
    <!-- 类目标题 -->
    <view class="nut-flex nut-row-between f_s-16" :class="$style['title-wrap']">
      <text :class="$style['title-wrap_text']">{{ catalogInfo.name }}</text>
      <view class="nut-flex" @tap="handleAll(catalogInfo.id)" v-if="skipInfo.skipText">
        <text class="f_s-12" :class="$style['title-wrap_all']">{{ skipInfo.skipText }}</text>
        <image src="@/static/icon/arr-s.png" :class="$style['title-wrap_img']"></image>
      </view>
    </view>

    <!-- 类目组 -->
    <view class="nut-flex nut-col-top">
      <image
        :class="$style['category-banner']"
        :src="catalogBanners[0] ? imageProcess(catalogBanners[0]?.src, 'S') : ''"
        @tap="gotoPage"
        v-if="isCatalogBanner"
      ></image>
      <scroll-view
        :class="[$style['category-scroll'], { [$style['category-scroll_width']]: !isCatalogBanner }]"
        :enable-flex="true"
        :enable-passive="true"
        :scroll-x="true"
        :enhanced="true"
        :show-scrollbar="false"
        @scrolltoupper="loadMore"
      >
        <view :class="$style['scroll_box']" class="nut-flex nut-col-top" v-if="skipInfo.isShop">
          <block v-for="item in list" :key="item.id">
            <ShopWrap :data="item" :catalogInfo="catalogInfo" @track="onTrack" />
          </block>
        </view>

        <view :class="$style['scroll_box']" class="nut-flex nut-col-top" v-if="!skipInfo.isShop">
          <block v-for="item in listData" :key="item.id">
            <ShopWrap :data="item" :showPrice="skipInfo.isShop" :catalogInfo="catalogInfo" @track="onTrack" />
          </block>
          <!-- 展示该一级分类下关联的所有二级分类以及一级分类商品,优先展示二级分类，再展示一级分类商品 -->
          <block v-for="item in list" :key="item.id">
            <ShopWrap :data="item" :catalogInfo="catalogInfo" @track="onTrack" />
          </block>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { goodsListApi } from '@/api/goods';
import { CATALOGDOC } from '@/constants';
import { IBanner } from '@/dto/banner';
import { GoodsInfo, ICatalog } from '@/dto/goods';
import { getQueryString, handleLink, imageProcess } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import Taro, { getApp } from '@tarojs/taro';
import { PropType, computed, onMounted, reactive, ref } from 'vue';
import ShopWrap from './ShopWrap.vue';

const linkflow = getApp()[`${process.env.APP_ID}`];

const list = ref<GoodsInfo[]>([]);
const props = defineProps({
  catalogSkip: {
    type: Object,
    default: () => {},
  },
  catalogInfo: {
    type: Object as PropType<ICatalog>,
    default: () => {},
  },
  catalogBanners: {
    type: Object as PropType<IBanner[]>,
    default: () => {
      return [];
    },
  },
  idx: {
    type: Number,
    default: 0,
  },
});
const finished = ref<boolean>(false);
const listParams = reactive({
  page: 1,
  perPage: 20,
  catalogId: props.catalogInfo.id,
  sort: '',
});

const skipInfo = computed(() => {
  return props.catalogSkip;
});

const isCatalogBanner = computed(() => {
  return props.catalogBanners[0]?.src;
});

//  没有二级，展示一级下商品
const listData = computed(() => {
  return !skipInfo.value.isShop ? props.catalogInfo.children : list.value;
});

// 加载下一页
const loadMore = () => {
  console.log('加载下一页');
  if (!skipInfo.value.isShop) return;
  getList();
};

// 分类图跳转
const gotoPage = () => {
  const item = props.catalogBanners[0];
  // const path = Taro.getCurrentInstance().page?.route;
  // tarckEvents([{ path, event: IEventsName.BANNER_CL, properties: { url: item.link } }]);

  linkflow &&
    linkflow.track({
      event: ELinkflowEventsName.Shop_Banner_Click,
      props: {
        targetClass: item.desc,
        targetAddress: item.link,
        targetName: item.title,
        miniSkuId: getQueryString('skuId', item.link),
        Index: `${props.idx}`,
      } as ILinkflowEventsProps,
    });

  handleLink(item.linkType, item.link, item.mpAppId);
};

const handleAll = parId => {
  if (skipInfo.value.isShop) {
    goHelp();
    return;
  }

  const sonId = props.catalogInfo.children[0].id;
  const title = props.catalogInfo.name;
  const productSubdivide = props.catalogInfo.children[0].name;

  onTrack({ productSort: title, productSubdivide, productSubdivideId: `${sonId}` });
  Taro.navigateTo({
    url: `/packageA/pages/secondClassify/secondClassify?sonId=${sonId}&parId=${parId}&title=${title}`,
  });
};

const goHelp = () => {
  Taro.navigateTo({
    url: `/packageA/pages/help/help?title=${CATALOGDOC.SHOWMORENEW.title}&code=${CATALOGDOC.SHOWMORENEW.code}`,
  });
};

const getList = async () => {
  if (finished.value) return;

  let result;
  try {
    result = await goodsListApi(listParams);
  } catch (error) {
    console.error('getList error=', error);
  }

  if (!result) return;

  listParams.page += 1;

  if (result.list.length < listParams.perPage) {
    finished.value = true;
  }

  if (listParams.page === 1) {
    list.value = result.list;
  } else {
    list.value = list.value.concat(result.list);
  }
};

onMounted(async () => {
  // const { id, children } = props.catalogInfo;
  // if ((id > 0 && children.length === 0) || skipInfo.value.isShop) {
  //   await getList();
  // }
  await getList();
});

const onTrack = (data: {
  productSort?: string;
  productSubdivide?: string;
  productSubdivideId?: string;
  skuId?: string;
  outerSkuId?: string;
  miniSkuId?: string;
}) => {
  if (!linkflow) return;
  linkflow.track({
    event: ELinkflowEventsName.Shop_Click,
    props: {
      productSort: data.productSort || '',
      productSubdivide: data.productSubdivide || '',
      productSubdivideId: data.productSubdivideId || '',
      skuId: data.skuId || '',
      outerSkuId: data.outerSkuId || '',
      miniSkuId: data.miniSkuId || '',
    } as ILinkflowEventsProps,
  });
};
</script>

<style lang="scss" module>
.title-wrap {
  width: 100%;
  padding: 8px 16px;
  margin-top: 24px;
  align-self: stretch;
  .title-wrap_text {
    color: $Primary;
  }
  .title-wrap_all {
    color: $Tertiary;
    margin-right: 4px;
    line-height: 20px;
  }
  .title-wrap_img {
    width: 12px;
    height: 12px;
    transform: rotate(-90deg);
  }
}
.category-banner {
  width: 116px;
  height: 128px;
  min-width: 116px;
  background: #d9d9d9;
}
.category-scroll {
  width: 247px;
  height: 150px;
  display: flex;
  white-space: nowrap;
  &_width {
    width: 100%;
  }
  .scroll_box {
    height: 100%;
    padding-right: 10px;
  }
  // .shop-wrap {
  //   margin-left: 10px;
  //   &_img {
  //     width: 90px;
  //     height: 100px;
  //     border: 0.5px solid #d9d9d9;
  //     background: #fff;
  //   }
  //   &_info {
  //     .info-name {
  //       font-family:'FZLanTingHei-R-GBK';
  //       line-height: 20px;
  //       margin-top: 8px;
  //       width: 90px;
  //       display: block;
  //     }
  //     .info-price {
  //       font-family: CentraleSans;
  //       line-height: 18px;
  //       margin-top: 4px;
  //     }
  //   }
  // }
}
</style>
