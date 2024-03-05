<template>
  <view :class="$style.layout" :style="{ backgroundImage: `url(${imageUrl})` }">
    <CustomTitle title="翻卡得好礼" tips="翻开一张卡牌抽取好礼" />

    <view :class="$style.layout_main">
      <view :class="$style.layout_item" :style="{ opacity: isOut ? 0.3 : 1 }">
        <block v-for="(item, index) in data.cardImages" :key="item">
          <view :class="$style.image_box">
            <image
              :class="$style.image"
              :src="imageProcess(checkIsLotteryed(item, index), 'S', 'png')"
              mode="aspectFill"
              @tap="e => handleLottery(e, item, index)"
            ></image>
          </view>
        </block>
      </view>
      <view v-if="isOut" :class="$style.empty_box" class="f_s-14">本期活动已结束欢迎下次再来</view>
    </view>

    <view :class="$style.layout_bottom" class="nut-flex-col nut-col-center nut-row-center">
      <text :class="$style.tip" class="f_s-14">剩余抽奖机会{{ LotteryNum }}次</text>
      <nut-button shape="round" type="primary" plain :class="$style.btn" @click="gotoMyPrizePage"
        >查看我的奖品</nut-button
      >
    </view>

    <view :class="$style.help_view" class="nut-flex nut-col-center nut-row-center" @tap="emits('ruleClick')">
      <image :class="$style.icon" :src="require('@/packageB/image/help.png')"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getPrizeRecord, luckyDraw } from '@/api/prizes';
import { LOGIN_TARGET, LOTTERY_DRAW_ERROR, LOTTERY_DRAW_ERROR_TEXT } from '@/constants';
import { IPondInfo, IPrizeInfo, IRecordsInfo, IRecordsItemList } from '@/dto/prizes';
import useLoginPop from '@/hook/useLoginPop';
import { useAppStore } from '@/stores';
import { Toast, cdnurl, imageProcess } from '@/utils';
import Taro from '@tarojs/taro';
import { throttle } from 'lodash';
import { PropType, onMounted, ref, watchEffect } from 'vue';
import CustomTitle from './CustomTitle.vue';

const imageUrl = cdnurl('static/lottery_draw_bg.png');

const { checkMemberLevel } = useLoginPop();

const props = defineProps({
  tickets: { type: Number, default: 0 },
  id: { type: String, default: '' },
  isOut: { type: Boolean, default: false },
  data: { type: Object as PropType<IPondInfo>, default: () => {} },
});

const emits = defineEmits(['prizeClick', 'ruleClick']);

/** 抽奖次数 */
const LotteryNum = ref<number>(0);
/** 已中奖数据 */
const lotteryedData = ref<IRecordsItemList[]>([]);

const awardData = ref<IRecordsItemList>({} as IRecordsItemList);

// watch(
//   () => props.tickets,
//   (val, preVal) => {
//     if (val === preVal) return;
//     LotteryNum.value = Number(val); // 和上游数据关联上
//   },
// );

watchEffect(() => {
  LotteryNum.value = Number(props.tickets); // 和上游数据关联上
});

const handleLottery = throttle(
  async (e, img, idx) => {
    if (props.isOut) return;
    // 测试翻牌动画
    // const popComeData = await getPopComeData(e);
    // emits('prizeClick', { awardData: { ...awardData.value, bgImg: img }, show: true, comeData: popComeData });

    checkMemberLevel(LOGIN_TARGET.lotteryCardClick);
    if (!props.id) return;

    if (lotteryedData.value.find(i => i.position === idx)?.id) return Toast('您已翻开过这张卡，可在我的奖品查看');
    if (LotteryNum.value < 1) return Toast('抽奖机会已用完，完成任务获得更多机会吧', 2000);

    //添加客服微信
    // if (!props.data.wxwkFollowed) return (popService.value = true);

    try {
      const res: IPrizeInfo = await luckyDraw(props.id, idx);

      // console.log('res: ', res);
      awardData.value = res.award;
      const popComeData = await getPopComeData(e);
      emits('prizeClick', { awardData: { ...awardData.value, bgImg: img }, show: true, comeData: popComeData });
      LotteryNum.value--;
      lotteryedData.value.push(awardData.value);
    } catch (err) {
      console.error('handleLottery err=', err);
      if (err.code === LOTTERY_DRAW_ERROR.LOTTERY_AWARD_EMPTY) {
        Toast(LOTTERY_DRAW_ERROR_TEXT[err.code]);
      } else {
        Toast(err.message, 3000);
      }
    }
  },
  1000,
  {
    leading: true,
    trailing: false,
  },
);

const getLotteryedData = async () => {
  let result: IRecordsInfo | null = null;
  try {
    result = await getPrizeRecord(props.data.code, { noPagination: true });
  } catch (err) {
    console.error('getLotteryedData err=', err);
  }

  if (!result) return;
  lotteryedData.value = result.list;
};

const getPopComeData = e => {
  const { windowWidth, windowHeight } = useAppStore().sysInfo;
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const { x, y } = e.detail;
  console.debug('x', x);
  console.debug('y', y);
  console.debug('centerX', centerX);
  console.debug('centerY', centerY);

  return { x: x - centerX, y: y - centerY };
};

const gotoMyPrizePage = () => {
  Taro.navigateTo({
    url: `/packageB/pages/myPrize/myPrize?code=${props.data.code}`,
  });
};

const checkIsLotteryed = (item: string, index: number) => {
  const result = lotteryedData.value.find(i => i.position === index);
  if (result?.id) return result.image;
  return item;
};

onMounted(() => {
  getLotteryedData();
});
</script>
<style lang="scss" module>
.layout {
  position: relative;
  width: 375px;
  max-height: 610px;
  padding: 36px 0 37px;
  background-size: 375px 520px;
  background-position: 0 90px;
  background-repeat: no-repeat;
  &_main {
    position: relative;
    .layout_item {
      width: 375px;
      padding: 36px 39px;
      .image_box {
        display: inline-block;
        vertical-align: top;
        width: 75px;
        height: 100px;
        border-radius: 10px;
        box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.25);
        overflow: hidden;
        margin: 12px;
        .image {
          width: 100%;
          height: 100%;
        }
      }
    }
    .empty_box {
      position: absolute;
      top: 50%;
      left: 50%;
      color: $white;
      width: 146px;
      padding: 12px 24px;
      border-radius: 8px;
      background: rgba($Primary, 0.7);
      backdrop-filter: blur(10px);
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 100;
    }
  }
  &_bottom {
    .tip {
      color: $Tertiary;
      line-height: 20px;
      margin-bottom: 8px;
    }
    .btn {
      width: 273px;
      background: transparent;
    }
  }

  .help_view {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 48px;
    height: 48px;
    .icon {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
