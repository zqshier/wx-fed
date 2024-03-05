<template>
  <view :class="$style.order_parcel" class="f_s-14 f_w-400">
    <view
      :class="$style.parcel_item"
      class="nut-flex nut-col-center nut-row-between"
      v-for="item in infoData"
      :key="item.id"
      @tap="gotoLogisticsPlugin(item)"
    >
      <view :class="$style.item_left" class="nut-flex nut-flex-1 nut-col-center nut-row-left">
        <image :class="$style.icon_toShip" src="../../../../../static/icon/to-ship.png" mode="scaleToFill" />

        <view :class="$style['text-warp']">
          <view :class="$style.text" class="nut-flex-1">{{ logisticText(item.logisticCode) }}</view>
          <view class="f_s-12"> {{ item.logisticNo }}</view>
        </view>
        <!-- <view :class="$style.copy" class="f_s-20" @tap.stop="handleOrderNoCopy(item.logisticNo)">复制</view> -->
      </view>
      <!-- <view :class="$style.item_right" class="nut-flex nut-col-center nut-row-center"> -->
      <!-- <text>物流信息</text> -->
      <image
        v-if="!!item.logisticToken"
        :class="$style.icon_right"
        src="../../../../../static/icon/arrowLeft.png"
        mode="scaleToFill"
      />
      <!-- </view> -->
    </view>
    <!-- <block v-if="addressData">
      <view :class="$style.dotted_line"></view>
      <view :class="$style.addr" class="nut-flex nut-col-top">
        <view :class="[$style.icon, $style.icon_end]"></view>
        <view :class="$style.addr_box">
          <view :class="$style.addr_name" class="f_w-600">{{ addressData.name }} {{ addressData.phone }}</view>
          <view :class="$style.addr_detail"
            >{{ addressData.provinceName }}{{ addressData.cityName }}{{ addressData.districtName
            }}{{ addressData.address }}</view
          >
        </view>
      </view>
    </block> -->
  </view>
</template>
<script setup lang="ts">
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/dto/events';
import { IParcelItems } from '@/dto/order';
import { IDeliverAddr } from '@/dto/settle';
import { useOrderStore } from '@/stores';
import { getApp, requirePlugin } from '@tarojs/taro';
import { PropType, computed, onMounted } from 'vue';

const orderStore = useOrderStore();

const props = defineProps({
  data: {
    type: Object as PropType<IParcelItems[] | null>,
    default: null,
  },
  dataAddr: {
    type: Object as PropType<IDeliverAddr>,
    default: null,
  },
});

const infoData = computed((): IParcelItems[] => {
  return props.data!;
});

// const addressData = computed(() => {
//   return props.dataAddr || null;
// });

onMounted(() => {
  if (orderStore.getDeliveryList?.length > 0) return;
  orderStore.getDeliveryListApi();
});

const logisticText = (code: string) => {
  if (orderStore.getDeliveryList?.length <= 0) return '快递';
  const info = orderStore.getDeliveryList.find(i => i.delivery_id === code);
  return info?.delivery_name || '快递';
};

// const handleOrderNoCopy = (no: string) => {
//   if (!no) return;
//   Taro.setClipboardData({
//     data: no,
//     success() {
//       Toast('快递单号已复制');
//     },
//   });
// };

const gotoLogisticsPlugin = (item: IParcelItems) => {
  if (!item.logisticToken) return;
  try {
    const myPluginInterface = requirePlugin('logisticsPlugin');
    const waybillToken = item.logisticToken;
    // 在此通过调用 api 来查询微信快递服务详情
    //必须用预览才能测试这个功能，无法在工具端模拟
    myPluginInterface.openWaybillTracking({
      waybillToken,
    });
  } catch (error) {
    console.error('gotoLogisticsPlugin error=', error);
  }

  // tarckEvents([
  //   {
  //     path: Taro.getCurrentInstance().page?.route,
  //     event: IEventsName.CL,
  //     properties: { orderNo: item.orderNo, desc: '查看物流' },
  //   },
  // ]);

  const linkflow = getApp()[`${process.env.APP_ID}`];
  if (linkflow) {
    linkflow.track({
      event: ELinkflowEventsName.OrderDetail_Click,
      props: { buttonName: '查看物流', orderId: item.orderNo } as ILinkflowEventsProps,
    });
  }
};
</script>

<style lang="scss" module>
.order_parcel {
  // width: 339px;
  // padding-bottom: 10px;
  .parcel_item {
    // width: 339px;
    // height: 40px;
    // padding-bottom: 20px;
    .item_left {
      padding-left: 6px;
      .text-warp {
        width: 239px;
        color: $Tertiary;
        font-family: 'FZLanTingHei-R-GBK';
      }
      .text {
        color: $font-color;
        word-break: break-all;
        margin-bottom: 4px;
      }
      // .copy {
      //   width: 36px;
      //   height: 17px;
      //   line-height: 17px;
      //   text-align: center;
      //   color: $Tertiary;
      //   font-size: 10px;
      //   border: 1px solid $Tertiary;
      //   border-radius: 3px;
      //   margin-left: 12px;
      // }
    }
    // .item_right {
    //   width: 70px;
    //   color: $Tertiary;
    // }
    .icon_right {
      width: 16px;
      height: 16px;
      margin-left: 8px;
    }
  }
  .icon_toShip {
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
  // .icon {
  //   width: 10px;
  //   height: 10px;
  //   background: $Primary;
  //   border-radius: 50%;
  //   margin-right: 14px;
  //   &_end {
  //     background: #fff;
  //     border: 1px solid $Primary;
  //   }
  // }
  // .dotted_line {
  //   margin-left: 10px;
  //   margin-top: -5px;
  //   width: 1px;
  //   height: 45px;
  //   border-left: 1px dashed $Primary;
  // }
  // .addr {
  //   padding-left: 6px;
  //   &_box {
  //     margin-top: -4px;
  //     width: 289px;
  //   }
  //   &_name {
  //     margin-bottom: 4px;
  //   }
  //   &_detail {
  //     color: $Tertiary;
  //   }
  // }
}
</style>
