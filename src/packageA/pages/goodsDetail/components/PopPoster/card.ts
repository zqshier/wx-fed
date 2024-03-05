import Taro, { pxTransform as pxt } from '@tarojs/taro';
import { GoodsInfo } from '@/dto/goods';
import { strlen } from '@/utils';
import { DrawConfig } from '@/components/PosterBuilder/types';
import variables from '@/scss/variables';

const fontFamily = 'Eurostile LT Extended #2';
const sysInfo = Taro.getSystemInfoSync();
// 兼容iphon 6/7/8plus 2倍图不显示海报问题
const scaleRatio = sysInfo.screenWidth > 375 ? 1.5 : 2;
const pxTransform = (size: number) => {
  const s = pxt(size * scaleRatio);
  return parseInt(s);
};

export default class LastMayday {
  palette(data: GoodsInfo, price: string, guidePrice: string, qrcodeUrl: string): DrawConfig {
    const result: DrawConfig = {
      width: pxTransform(375),
      height: pxTransform(595),
      backgroundColor: variables.white,
      debug: false,

      images: [
        {
          url: data.shareImage || data.image,
          width: pxTransform(341),
          height: pxTransform(341),
          x: pxTransform(17),
          y: pxTransform(17),
        },

        {
          url: qrcodeUrl,
          width: pxTransform(90),
          height: pxTransform(90),
          y: pxTransform(484),
          x: pxTransform(17),
        },
      ],

      blocks: [
        {
          backgroundColor: variables.primaryColor,
          width: pxTransform(375),
          height: pxTransform(51),
          y: pxTransform(544),
          x: pxTransform(0),
        },
      ],

      texts: [
        {
          text: `¥ ${price}`,
          fontSize: pxTransform(17),
          fontWeight: '600',
          color: variables.primaryColor,
          y: pxTransform(377),
          x: pxTransform(17),
          fontFamily,
        },
        {
          text: data.name,
          fontSize: pxTransform(15),
          // fontWeight: '400',
          color: variables.primaryColor,
          y: guidePrice ? pxTransform(420) : pxTransform(415),
          // y: pxTransform(415),
          x: pxTransform(17),
          width: pxTransform(322),
          lineNum: 2,
          lineHeight: pxTransform(17),
        },
        {
          text: '长按二维码，立即查看',
          fontSize: pxTransform(13),
          // fontWeight: '400',
          color: variables.primaryColor,
          y: pxTransform(514),
          x: pxTransform(116),
          zIndex: 2,
        },
      ],
    };

    if (guidePrice) {
      result.blocks!.push({
        width: guidePriceDelLineWidth(guidePrice),
        height: pxTransform(1),
        y: pxTransform(387),
        x: guidePriceLeft(price),
        backgroundColor: variables.tertiary,
      });
      result.texts!.push({
        text: `¥${guidePrice}`,
        fontSize: pxTransform(13),
        fontWeight: '600',
        color: variables.tertiary,
        y: pxTransform(380),
        x: guidePriceLeft(price),
        fontFamily,
      });
    }

    return result;
  }
}

function guidePriceLeft(str: string, offset: number = 0) {
  const _size: number = 10;
  const space_size: number = 4; // 空格宽度
  const _width: number = strlen(str) * _size;
  const spaceLen = (str.match(/ /g) || []).length; // 空格数
  const _rpx: number = Number(`${_width + spaceLen * space_size + offset + 36}`);
  return pxTransform(_rpx);
}

function guidePriceDelLineWidth(str: string) {
  const _size: number = 7;
  const space_size: number = 4; // 空格宽度
  const _width: number = strlen(str) * _size;
  const spaceLen = (str.match(/ /g) || []).length; // 空格数
  const _rpx: number = Number(`${13 + _width + spaceLen * space_size}`);
  return pxTransform(_rpx);
}
