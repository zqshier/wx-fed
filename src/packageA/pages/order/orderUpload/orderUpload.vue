<template>
  <BackgroundImage>
    <CustomBar title="上传订单" />

    <view :class="$style.box" v-if="isLoaded">
      <view :class="$style.main" class="nut-flex-col nut-flex-1" v-if="configData?.status">
        <view :class="$style.main_title" class="f_s-24 f_w-600 mg-bottom-4">积分换豪礼</view>
        <view :class="$style.main_ins" class="f_s-16 f_w-400">上传订单，领取更多小火苗</view>
        <view :class="$style.main_from" class="f_s-16 f_w-400 nut-flex nut-row-between">
          <text :class="$style.from_title">订单渠道：</text>
          <view :class="$style.from_info" class="nut-flex nut-row-center" @tap="showChannelSheet = true">
            <input
              :class="$style.from_info_input"
              class="f_s-12 nut-flex nut-row-center"
              :disabled="true"
              placeholder="请选择订单渠道"
              :placeholder-style="inputPlaceholderStyle"
              :value="channelText"
            />
            <image :class="$style.icon_arrows" src="../../../../static/icon/arr-s.png"></image>
          </view>
        </view>

        <view :class="$style.main_from" class="f_s-16 f_w-400 nut-flex nut-row-between">
          <text :class="$style.from_title">订单编号：</text>
          <view :class="$style.from_info" class="nut-flex nut-row-center">
            <input
              v-model="paramsData.orderNo"
              :placeholder-style="inputPlaceholderStyle"
              :class="[$style.from_info_input, $style.from_info_input_num]"
              class="f_s-12"
              placeholder="请填写/复制订单编号"
              @Input="handleOrderNo"
            />
          </view>
        </view>

        <view :class="$style.main_from" class="f_s-16 f_w-400 nut-flex nut-row-between">
          <text :class="$style.from_title">产品名称：</text>
          <view :class="$style.from_info" class="nut-flex nut-row-center">
            <input
              v-model="paramsData.productName"
              :placeholder-style="inputPlaceholderStyle"
              :class="[$style.from_info_input, $style.from_info_input_num]"
              class="f_s-12"
              maxlength="50"
              placeholder="请输入产品名称"
            />
          </view>
        </view>
        <view :class="$style.main_from" class="f_s-16 f_w-400 nut-flex nut-row-between">
          <text :class="$style.from_title">订单金额：</text>
          <view :class="$style.from_info" class="nut-flex nut-row-center">
            <input
              v-model="paramsData.orderAmount"
              :placeholder-style="inputPlaceholderStyle"
              :class="[$style.from_info_input, $style.from_info_input_num]"
              class="f_s-12"
              type="digit"
              placeholder="请输入订单金额"
              :maxlength="9"
              @Input="handleOrderAmount"
            />
          </view>
        </view>

        <view :class="$style.pictures" class="f_s-16 f_w-400">
          <view :class="$style.pictures_top" class="nut-flex nut-row-between mg-bottom-8">
            <text :class="$style.title">上传订单截图（最多3张）：</text>
            <image :class="$style.doubt_icon" :src="cdnurl('static/help.png')" @tap="showPopExample = true"></image>
          </view>
          <view :class="$style['picture_list']" class="picture_list nut-flex nut-flex-wrap">
            <nut-uploader
              v-if="defaultFileList && defaultFileList.length <= 3"
              v-model:file-list="defaultFileList"
              maximum="3"
              timeout="120 * 1000"
              :media-type="['image']"
              :maximize="1024 * (1024 * 2)"
              :url="uploadUrl"
              :data="formData"
              @success="handleUploadSuc"
              @start="startUpload"
              @oversize="onOversize"
            >
              <template v-slot:upload-icon> <Uploader color="#333333" size="12" /> </template>
              <template v-slot:delete-icon>
                <image src="@/static/icon/delete.png" :class="$style.delete_icon"></image>
              </template>
            </nut-uploader>
          </view>
        </view>

        <view :class="$style.controls" class="mg-bottom-16">
          <nut-button :class="$style.btn" :block="true" type="primary" :loading="submitLoading" @click="handleSubmit"
            >提交审核</nut-button
          >
          <nut-button :class="$style.btn_record" :block="true" @click="goRecordList">查看转换记录</nut-button>
        </view>

        <view :class="$style.document">
          <image
            v-for="item in configData?.explainImage"
            :key="item.id"
            :class="$style.image"
            :data-id="imageProcess(item.url, 'L', 'png')"
            :src="imageProcess(item.url, 'L', 'png')"
            mode="widthFix"
            :lazy-load="true"
            :show-menu-by-longpress="true"
          />
        </view>
      </view>

      <view :class="$style.empty_box" class="nut-flex nut-flex-1 nut-flex-col nut-col-center nut-row-center" v-else>
        <text class="f_s-20 f_w-400">已下架</text>
        <!-- <DefaultPage imgWidth="48" imgHeight="48" imgMbottom="16" tip="已下架" :icon="cdnurl('static/no-order.png')" /> -->
      </view>
    </view>

    <Loading :show="!isLoaded" />

    <ChannelPicker v-model:show="showChannelSheet" @setDta="setChannel" />
    <PopExample v-model:show="showPopExample" />
    <PopLogin v-model:is-show="showLoginPop" :target="loginTarget" z-index="1999" @refresh="handleSubmit" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { uploadOrderApi, uploadOrderConfigApi } from '@/api/order';
import { IUploadPolicy, getUrl } from '@/api/upload';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LOGIN_TARGET } from '@/constants';
import { IUploadOrderConfig, IUploadOrderParams } from '@/dto/aftersales';
import { IFileItem } from '@/dto/order';
import useLoginPop from '@/hook/useLoginPop';
import variables from '@/scss/variables';
import { imageProcess } from '@/utils';
import { Toast, cdnurl, shareOptions } from '@/utils/index';
import { Uploader } from '@nutui/icons-vue-taro';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import { cloneDeep, isEmpty } from 'lodash';
import Validator from 'miniprogram-validator';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ChannelPicker from './components/ChannelPicker/ChannelPicker.vue';
import PopExample from './components/PopExample/PopExample.vue';

const {
  visible: showLoginPop,
  target: loginTarget,
  onRegisterEvent,
  offRegisterEvent,
  checkMemberLevel,
} = useLoginPop();

// const getMemberLevel = computed((): Boolean => !!useUserStore().getUserInfo?.phone);
const initData = {
  orderChannel: '',
  orderNo: '',
  productName: '',
  orderAmount: null,
  screenshot: [],
};
const inputPlaceholderStyle = ref(`color: ${variables.tertiary}`);
const paramsData = ref<IUploadOrderParams>(cloneDeep(initData));

const showChannelSheet = ref<boolean>(false);
const showPopExample = ref<boolean>(false);
const submitLoading = ref(false);

/** 上传服务器的接口地址 */
const uploadUrl = ref<string>('');
/** 接口地址数据  */
const uploadUrlData = ref();
/** 附加上传的信息 formData */
const formData = ref();
/** 上传的列表 */
const defaultFileList = ref<IFileItem[]>([]);
const configData = ref<IUploadOrderConfig>(); // 配置信息
const isLoaded = ref<boolean>(false);
const channelText = ref<string>('');

const inputIsValid = computed(() => {
  const text = ['京东-ZIPPO官方旗舰店', '抖音-ZIPPO官方旗舰店', '抖音-ZIPPO运动户外旗舰店'];

  return text.includes(channelText.value);
});

const handleOrderNo = e => {
  let value = e.detail.value.replace(/[\u4e00-\u9fa5]/gi, '');
  console.log('value: ', value);
  Taro.nextTick(() => {
    paramsData.value.orderNo = value.slice(0, 30);
  });
};

const handleOrderAmount = e => {
  let value = e.detail.value
    .replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    .replace(/^(\d-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只保留两位小数
    .replace(/^0+(\d)/, ''); // 第一位0开头，0后面为数字，则过滤掉，取空

  Taro.nextTick(() => {
    paramsData.value.orderAmount = value || null;
  });
};

function setChannel({ channelVal, channelText: text }) {
  paramsData.value.orderChannel = channelVal;
  channelText.value = text;
}

async function handleSubmit() {
  checkMemberLevel(LOGIN_TARGET.orderUploadSubmit);
  // if (!useUserStore().isMemberLevel) return openLoginPop();

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
  paramsData.value.screenshot = imgList;

  const validatorObj = {
    orderChannel: [{ message: '请选择订单渠道', required: true }],
    orderNo: [{ message: '请填写/上传订单编号', required: true }],
    screenshot: [
      {
        message: '请填写/上传订单截图',
        validator: value => {
          return !isEmpty(value);
        },
      },
    ],
  };

  if (!inputIsValid.value) {
    validatorObj['productName'] = [{ message: '请输入产品名称', required: true }];
    validatorObj['orderAmount'] = [{ message: '请输入订单金额', required: true }];
  }
  const validator = new Validator(validatorObj);

  const error = validator.validate(paramsData.value);
  console.log('handleSubmit error', error);
  if (error) {
    return Toast(error.msg, 2000, 'none');
  }

  submitLoading.value = true;

  try {
    const result = await uploadOrderApi(paramsData.value);
    console.log('result: ', result);

    Toast('提交成功，工作人员将在7个工作日内审核', 3000, 'none', true, () => {
      setTimeout(() => {
        paramsData.value = cloneDeep(initData);
        defaultFileList.value = [];
        channelText.value = '';
      }, 2500);
    });
  } catch (error) {
    Toast(error.message);
    console.log('error: ', error);
  } finally {
    submitLoading.value = false;
  }
}

// 获取配置
async function getConfig() {
  try {
    const result = await uploadOrderConfigApi();

    configData.value = result;
    isLoaded.value = true;
  } catch (error) {
    Toast(error.message);
  }
}

function goRecordList() {
  Taro.navigateTo({
    url: `/packageA/pages/order/recordList/recordList`,
  });
}

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

useShareAppMessage(() => {
  const shareReturn = shareOptions({
    page: '/packageA/pages/order/orderUpload/orderUpload',
    imageUrl: configData.value?.shareImage || '',
  });
  console.debug('orderUpload page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});

onMounted(async () => {
  onRegisterEvent();
  await getConfig();
  getUploadUrl();
});

onUnmounted(() => {
  offRegisterEvent();
});
</script>
<style lang="scss">
.picture_list {
  .nut-uploader__preview-img .close {
    z-index: 10;
    right: 3px;
  }
  .nut-uploader__preview {
    margin-right: 16px;
  }
  .nut-uploader__upload {
    width: 80px;
    height: 80px;
    border: 1px solid $Primary;
  }
  .nut-uploader__preview-img {
    width: 80px;
    height: 80px;
  }
  .nut-uploader__preview-img__c {
    width: 80px;
    height: 80px;
    border-radius: 0;
  }
}
</style>

<style lang="scss" module>
.box {
  z-index: 2;
}
.main {
  width: 100%;
  height: 100%;
  padding: 32px;
  margin-top: 24px;
  border-radius: 32px 32px 0px 0px;
  background: rgba(165, 165, 165, 0.08);
  box-shadow: -16.16667px 16.16667px 16.16667px 0px rgba(255, 255, 255, 0.08) inset,
    16.16667px -16.16667px 16.16667px 0px rgba(165, 165, 165, 0.08) inset;
  backdrop-filter: blur(7.760000228881836px);

  &_title {
    color: $Primary;
    font-family: 'FZLanTingHei-B-GBK';
  }

  &_ins {
    padding-bottom: 16px;
    color: $Tertiary;
    font-family: 'FZLanTingHeiS-R-GB';
    border-bottom: 1px solid #d9d9d9;
  }
  &_from {
    padding: 16px 0;
    border-bottom: 1px solid #d9d9d9;
    .from_title {
      width: 80px;
    }

    .from_info {
      width: 223px;
      height: 32px;
      border-radius: 16px;
      border: 1px solid $Secendary;
      background: rgba(255, 255, 255, 0.5);
      position: relative;
      &_input {
        height: 18px;
        color: $Primary;
        text-align: center;
        font-family: 'FZLanTingHeiS-R-GB';
        &_num {
          width: 200px;
        }
      }

      .icon_arrows {
        position: absolute;
        top: 10px;
        right: 13px;
        width: 12px;
        height: 12px;
      }
    }
  }
  .pictures {
    padding: 16px 0;
    &_top {
      width: 100%;
      .title {
        width: 202px;
        line-height: 24px;
      }
    }
    .doubt_icon {
      width: 24px;
      height: 24px;
    }
    .delete_icon {
      width: 16px;
      height: 16px;
    }
  }
  .controls {
    width: 311px;
    padding: 24px 0;
    .btn {
      margin-bottom: 16px;
      font-size: 12px;
    }
    .btn_record {
      background: transparent;
      border: 1px solid $Tertiary;
      color: $Primary;
      font-size: 12px;
    }
  }
  .document {
    padding-top: 16px;
    border-top: 1px solid #d9d9d9;
    width: 100%;
    text-align: center;
    .image {
      width: 311px;
      display: inline-block;
    }
  }
}
.empty_box {
  margin-top: 300px;
  color: $Tertiary;
  font-family: 'FZLanTingHei-R-GBK';
}
</style>
