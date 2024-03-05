<template>
  <BackgroundImage>
    <CustomBar title="申请退款" />

    <view :class="$style.main" class="f_s-14 f_w-400">
      <!-- 商品列表 -->
      <view :class="$style.order_item" class="box mg-bottom-14 rounded_corners-8">
        <view class="mg-bottom-12">退款商品</view>
        <OrderItem :data="listData" />
      </view>

      <view :class="$style.cause_box" class="box mg-bottom-16 rounded_corners-8">
        <view :class="$style.cause_item" class="nut-flex nut-col-center nut-row-between" @tap="clickType">
          <text>退款类型</text>
          <view class="nut-flex nut-col-center nut-row-end">
            <text :class="{ [$style.reason]: !refundTypeVal.name }">{{ refundTypeVal.name || '请选择' }}</text>
            <image v-if="!isSelectType()" :class="$style['icon-right']" src="@/static/icon/arrowLeft.png" />
          </view>
        </view>
        <view :class="$style.cause_item" class="nut-flex nut-col-center nut-row-between" @tap="clickCause">
          <text>退款原因</text>
          <view class="nut-flex nut-col-center nut-row-end">
            <text :class="{ [$style.reason]: !refundCauseVal }">{{ refundCauseVal || '请选择' }}</text>
            <image :class="$style['icon-right']" src="@/static/icon/arrowLeft.png" />
          </view>
        </view>

        <view :class="$style.cause_item" class="f_s-14 f_w-400 nut-flex nut-col-center nut-row-between">
          <text>退款金额</text>

          <view :class="$style['money_item-explain']">
            <view :class="$style['explain_RMB']">￥{{ payableAmount }}</view>
            <view :class="$style.explain_tips"
              >不可修改，最多￥{{ payableAmount }}<text v-if="isIcash">，含发货邮费</text></view
            >
          </view>
        </view>
      </view>

      <view :class="$style.picture_item" class="f_s-14 f_w-400 box mg-bottom-80 rounded_corners-8">
        <view class="mg-bottom-11">补充描述（{{ describe.length }}/100）</view>
        <view :class="$style['picture_item-text']" class="border-05px-box-0 mg-bottom-14">
          <textarea
            :value="describe"
            :maxlength="100"
            :disableDefaultPadding="true"
            class="input_color"
            placeholder="补充描述，有助于商家更好的处理售后问题"
            placeholderClass="input_pla"
            @input="getDescribe"
          />
        </view>

        <view class="mg-bottom-8">添加图片（{{ defaultFileList.length }}/9）</view>
        <view :class="$style['picture_item-list']" class="picture_item-list nut-flex nut-flex-wrap">
          <nut-uploader
            v-if="defaultFileList && defaultFileList.length <= 9"
            v-model:file-list="defaultFileList"
            maximum="9"
            timeout="120 * 1000"
            :maximize="1024 * (1024 * 2)"
            :url="uploadUrl"
            :data="formData"
            @success="handleUploadSuc"
            @start="startUpload"
            @oversize="onOversize"
          >
            <template v-slot:upload-icon> <Uploader color="#A5A5A5" size="24" /> </template>
            <template v-slot:delete-icon>
              <image src="@/static/icon/delete.png" :class="$style.delete"></image>
            </template>
          </nut-uploader>
        </view>
      </view>
    </view>

    <view :class="$style.navigation" class="nut-flex-col nut-col-center nut-row-center">
      <view :class="$style.btn" hover-class="btn-hover" @click="handleSubmit">提交</view>
      <view :class="$style.safe" class="iphone-end"></view>
    </view>

    <!-- 退款原因 -->
    <PopRefundCause v-model:show="showReason" @cancel="handleCancel" />
    <!-- 退款类型 -->
    <PopRefundType v-model:show="showType" @cancel="handleCancelType" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import Taro, { useReady, useRouter } from '@tarojs/taro';
import { Uploader } from '@nutui/icons-vue-taro';
import { ref, watch } from 'vue';
import { Toast } from '@/utils/index';
import { getUrl, IUploadPolicy } from '@/api/upload';
import { applyRefund } from '@/api/aftersales';
import { IInitiateAfterItem, RefundType } from '@/dto/aftersales';
import { isEmpty } from 'lodash';
import { useReversibleStore } from '@/stores';
import { ORDER_STATUS, AFTER_SALE_ERROR, AFTER_SALE_ERROR_TEXT } from '@/constants';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import OrderItem from '@/components/OrderItem/OrderItem.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import PopRefundCause from './components/PopRefundCause/PopRefundCause.vue';
import PopRefundType from './components/PopRefundType/PopRefundType.vue';
import { FINISH_TYPE } from '@/dto/settle';
import { IFileItem } from '@/dto/order';

const useReversible = useReversibleStore();
/** 售后项可退数据 */
const reversibleVal = useReversible.itemStatusVal;
/** 订单状态 */
const orderStatus = useReversible.orderStatus;

const router = useRouter();
const listData = ref(JSON.parse(router.params.data || ''));

const showReason = ref<boolean>(false);
const showType = ref<boolean>(false);
/** 退款原因 */
const refundCauseVal = ref<string>('');
/** 退款类型 */
const refundTypeVal = ref({ name: '', type: '' });
/** 退款金额 */
const payableAmount = ref(0);
/** 描述 */
const describe = ref<string>('');
/** 上传服务器的接口地址 */
const uploadUrl = ref<string>('');
/** 接口地址数据  */
const uploadUrlData = ref();
/** 附加上传的信息 formData */
const formData = ref();
/** 上传的列表 */
const defaultFileList = ref<IFileItem[]>([]);
/** 是否含运费 */
const isIcash = ref<boolean>(false);
/** 加上含运费 */
const isFreight = ref<boolean>(false);

const isSelectType = (): boolean => {
  if (orderStatus === ORDER_STATUS.PENDING_SHIPMENT) {
    refundTypeVal.value.name = '我要退款（不需要退货）';
    refundTypeVal.value.type = RefundType.MONEY_ONLY;
    return true;
  }
  return false;
};

watch(
  () => refundTypeVal.value.type,
  newVal => {
    if (orderStatus !== ORDER_STATUS.PENDING_RECEIPT) return;
    if (newVal === RefundType.MONEY_ONLY) {
      isFreight.value = true;
    } else {
      isFreight.value = false;
    }
    getPayableAmount();
  },
);

const getUploadUrl = async () => {
  const data: IUploadPolicy = await getUrl();
  const key = `${data.dir}/a${Date.now()}`;

  uploadUrlData.value = data;
  uploadUrl.value = data.host;
  formData.value = {
    key,
    policy: data.policy,
    OSSAccessKeyId: data.accessId,
    signature: data.signature,
    callback: data.callback,
  };
};

const startUpload = async () => {
  const key = `${uploadUrlData.value.dir}/a${Date.now()}`;
  formData.value.key = key;
};

const handleUploadSuc = ({ responseText, fileItem }: { responseText: any; fileItem: IFileItem }) => {
  defaultFileList.value.forEach(file => {
    if (file.uid === fileItem.uid) {
      let resData: any = {};
      try {
        resData = JSON.parse(responseText.data);
      } catch {
        resData = responseText.data;
      }
      file.cdnUrl = (resData && resData.url) || '';
    }
  });
};

const onOversize = (files: File[]) => {
  console.log('oversize 触发 文件超过大小', files);
  Toast('图片超过大小');
};

const handleSubmit = async () => {
  if (isEmpty(refundCauseVal.value)) {
    return Toast('请选择退款原因');
  }

  if (isEmpty(refundTypeVal.value.name)) {
    return Toast('请选择退款类型');
  }

  const paramsItem: IInitiateAfterItem[] = [];

  listData.value.forEach(o => {
    const { goodsId, skuId } = o;
    paramsItem.push({ goodsId, skuId, refundGoodsAmount: 0 });
  });

  const imgList: string[] = [];
  let imgUploading: boolean = false;

  for (const item of defaultFileList.value) {
    if (item.status === 'uploading') {
      imgUploading = true;
      continue;
    }
    if (item.status === 'success') {
      imgList.push(item.cdnUrl || '');
    }
  }

  if (imgUploading) return Toast('图片上传中');

  const params = {
    orderNo: listData.value[0].orderNo,
    reason: refundCauseVal.value,
    type: refundTypeVal.value.type,
    extendInfo: {
      images: imgList,
      description: describe.value,
    },
    items: paramsItem,
  };

  let result;

  try {
    result = await applyRefund(params);
  } catch (error) {
    console.error('handleSubmit error=', error);
    if (error.code && error.code === AFTER_SALE_ERROR[error.code.toUpperCase()]) {
      Toast(AFTER_SALE_ERROR_TEXT[error.code]);
    }
    return;
  }

  if (!result) return;

  Taro.preload({ type: FINISH_TYPE.aftersales, title: '提交成功' });
  Taro.redirectTo({
    url: `/packageA/pages/finish/finish`,
  });
};

const getDescribe = e => {
  describe.value = e.detail.value || '';
};

const clickCause = () => {
  showReason.value = true;
};

const clickType = () => {
  if (isSelectType()) return;
  showType.value = true;
};

const handleCancel = val => {
  refundCauseVal.value = val;
};

const handleCancelType = val => {
  refundTypeVal.value = val;
};

const getPayableAmount = () => {
  let totalSum = 0;
  let len = 0;

  const resArr: any = reversibleVal?.items.filter(ite => ite.serveStatus === 'noserving');

  resArr.forEach(item => {
    listData.value.forEach(element => {
      if (item.skuId === element.skuId) {
        totalSum += Number(item.goodsRefundableAmount);
        len += 1;
      }
    });
  });
  // 显示提示: 仅退款 && 待发货 && 最后一个单 && 运费 > 0 || 待收货 && 仅退款 && 最后一个单 && 运费 > 0
  if (
    len === resArr.length &&
    reversibleVal &&
    reversibleVal.costFrightRefundableAmount > '0' &&
    (orderStatus === ORDER_STATUS.PENDING_SHIPMENT || isFreight.value)
  ) {
    isIcash.value = true;
    totalSum += Number(reversibleVal?.costFrightRefundableAmount);
  } else {
    isIcash.value = false;
  }

  payableAmount.value = Number(totalSum.toFixed(2));
};

useReady(() => {
  // 获取退款金额
  getPayableAmount();
  getUploadUrl();
});
</script>
<style lang="scss">
.input_color {
  font-size: 14px;
  color: $font-color;
  width: 100%;
  max-height: 60px;
}
.input_pla {
  font-size: 14px;
  font-weight: 400;
  color: $Tertiary;
  font-family: 'FZLanTingHei-R-GBK';
}
.picture_item-list {
  .nut-uploader__preview-img .close {
    z-index: 10;
    right: 3px;
  }
  .nut-uploader__preview {
    margin-right: 8px;
  }
  .nut-uploader__upload {
    width: 70px;
    height: 70px;
    background: rgba($color: $font-color, $alpha: 0.1);
  }
  .nut-uploader__preview-img {
    width: 70px;
    height: 70px;
  }
  .nut-uploader__preview-img__c {
    width: 70px;
    height: 70px;
    border-radius: 0;
  }
}
</style>
<style lang="scss" module>
.main {
  padding: 14px 15px;
  box-sizing: border-box;
  color: $Primary;
  font-family: 'FZLanTingHei-R-GBK';
  line-height: 18px;
  .cause_box {
    padding: 0 16px;
  }
  .cause_item {
    height: 56px;
    // padding-bottom: 16px;
    border-bottom: 0.5px solid var(--divide, #d9d9d9);
    &:last-child {
      border: none;
      padding-bottom: 0;
    }
    .reason {
      color: $Tertiary;
    }
  }
}
.order_item {
  padding-bottom: 10px;
}
.money_item-explain {
  text-align: end;
  color: $Tertiary;
  font-family: 'FZLanTingHei-R-GBK';
  .explain_RMB {
    color: $Primary;
    font-family: 'CentraleSans-medium';
  }
  .explain_tips {
    font-family: 'FZLanTingHei-B-GBK';
  }
}
.icon-right {
  width: 16px;
  height: 16px;
  margin-left: 4px;
}
.picture_item-text {
  padding: 8px;
  box-sizing: border-box;
  width: 311px;
  height: 76px;
}

.navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 375px;
  min-height: 60px;
  // background: $white;

  .btn {
    margin-top: 10px;
    width: 345px;
    line-height: 45px;
    font-size: 14px;
    font-weight: 400;
    color: $white;
    background: $primary-color;
    text-align: center;
    border-radius: 50px;
  }
  .safe {
    width: 100%;
    height: 10px;
  }
}
.delete {
  width: 16px;
  height: 16px;
}
</style>
