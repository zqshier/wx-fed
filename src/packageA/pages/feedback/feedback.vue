<template>
  <BackgroundImage :class="$style.layout">
    <CustomBar title="意见反馈" />
    <view :class="$style.main">
      <view :class="$style.tips">此处接受各种建议和吐槽，您的支持是小Z成长的动力</view>

      <view :class="$style.content">
        <textarea
          :value="describe"
          :maxlength="500"
          :disableDefaultPadding="true"
          class="input_color"
          placeholder="请输入您的意见与建议，500字以内"
          placeholderClass="input_pla"
          @input="getDescribe"
        />
        <view :class="$style.limit">{{ describe.length }} / 500</view>
      </view>

      <view :class="$style.pics">
        <view :class="$style.tips">添加图片（{{ imagesFilePaths.length || 0 }}/4）</view>
        <view :class="$style.pics_list" class="nut-flex nut-flex-wrap">
          <block v-for="(item, index) in imagesFilePaths" :key="item.tempFilePath">
            <view :class="$style.pic_box">
              <image :class="$style.pic" :src="item.tempFilePath" mode="aspectFill"></image>
              <image
                :class="$style.icon_del"
                src="./../../../static/icon/delete.png"
                @tap="handleDeleteImage(index)"
              ></image>
            </view>
          </block>
          <image
            v-if="imagesFilePaths.length < 4"
            :class="$style.pics_add"
            src="../../../static/icon/pic.png"
            @tap="handleChooseImage"
          ></image>
        </view>
      </view>
    </view>

    <view :class="$style.btn">
      <nut-button
        shape="round"
        type="primary"
        :block="true"
        :class="$style.submit"
        :loading="loadingSave"
        :disabled="!describe"
        @click="handleSubmit"
        >保存</nut-button
      >
    </view>
  </BackgroundImage>
</template>
<script setup lang="ts">
import { suggestApi, uploadpicApi } from '@/api-old';
import { Toast } from '@/utils';
import { IEventsName, tarckEvents } from '@/utils/track';
import Taro from '@tarojs/taro';
import { ref } from 'vue';

import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';

interface IFileItem {
  fileType: string;
  size: number;
  tempFilePath: string;
}

const describe = ref<string>('');
const imagesFilePaths = ref<IFileItem[]>([]);
const loadingSave = ref(false);

function handleChooseImage() {
  Taro.chooseMedia({
    count: 4,
    mediaType: ['image', 'mix', 'video'],
    sourceType: ['album', 'camera'],
    success: res => {
      if (res.tempFiles.length === 0) return;
      imagesFilePaths.value = imagesFilePaths.value.concat(res.tempFiles as any);
    },
  });
}

const getDescribe = e => {
  describe.value = e.detail.value || '';
};

const handleDeleteImage = index => {
  imagesFilePaths.value.splice(index, 1);
};

async function handleSubmit() {
  loadingSave.value = true;
  try {
    const picUrls = await updatePics();
    await suggestApi({ picurl: picUrls.join(), info: describe.value });
    Toast('提交成功');
    tarckEvents([{ path: 'packageA/pages/feedback/feedback', event: IEventsName.SUGGEST_CM }]);
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  } finally {
    loadingSave.value = false;
  }
}

async function updatePics() {
  let picUrls: any = [];
  if (imagesFilePaths.value.length > 0) {
    const promiseAll = imagesFilePaths.value.map(i =>
      uploadpicApi({ pic: Taro.getFileSystemManager().readFileSync(i.tempFilePath, 'base64') as string }),
    );

    await Promise.all(promiseAll).then(res => {
      picUrls = res.map(i => i?.picurl || '').filter(j => j != '');
    });
  }
  return picUrls;
}
</script>
<style lang="scss">
.input_pla {
  font-size: 14px;
}
</style>
<style lang="scss" module>
.layout {
  width: 375px;
  .main {
    width: 375px;
    padding: 0 16px;
    z-index: 2;
    .tips {
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-bottom: 0.5px solid $Divide;
    }
    .content {
      width: 100%;
      padding: 16px 0;
      border-bottom: 0.5px solid $Divide;
      .limit {
        width: 100%;
        height: 18px;
        text-align: right;
        color: $Tertiary;
      }
    }
    .pics {
      .tips {
        border: none;
      }
      &_list {
        margin-right: -6px;
        .pic_box {
          position: relative;
          margin-right: 8px;
          &:last-child {
            margin-right: 0;
          }
          .pic {
            width: 80px;
            height: 80px;
          }
          .icon_del {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 16px;
            height: 16px;
            z-index: 1;
          }
        }
      }

      &_add {
        width: 80px;
        height: 80px;
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 375px;
    min-height: 88px;
    padding: 8px 16px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
