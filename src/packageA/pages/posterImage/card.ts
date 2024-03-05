import Taro, { pxTransform as pxt } from '@tarojs/taro';
import { GoodsInfo } from '@/dto/goods';
// import { strlen } from '@/utils';
import { DrawConfig } from '@/components/PosterBuilder/types';
import variables from '@/scss/variables';
import { IPointsGoodsInfo } from '@/dto/point';

const fontFamily = 'FZLanTingHei-R-GBK';
const sysInfo = Taro.getSystemInfoSync();
// 兼容iphon 6/7/8plus 2倍图不显示海报问题
const scaleRatio = sysInfo.screenWidth > 375 ? 1.5 : 2;
const pxTransform = (size: number) => {
  const s = pxt(size * scaleRatio);
  return parseInt(s);
};

export default class LastMayday {
  palette(data: GoodsInfo | IPointsGoodsInfo, qrcodeUrl: string): DrawConfig {
    const result: DrawConfig = {
      width: pxTransform(375),
      height: pxTransform(676),
      backgroundColor: variables.white,
      debug: false,

      images: [
        {
          url: data.shareImage || data.image,
          width: pxTransform(375),
          height: pxTransform(562),
          x: pxTransform(0),
          y: pxTransform(0),
        },

        {
          url: qrcodeUrl,
          width: pxTransform(64),
          height: pxTransform(64),
          y: pxTransform(588),
          x: pxTransform(290),
        },
      ],

      texts: [
        {
          text: '长按识别二维码',
          fontSize: pxTransform(16),
          fontWeight: '400',
          color: variables.primaryColor,
          y: pxTransform(601),
          x: pxTransform(24),
          zIndex: 2,
          fontFamily,
        },
        {
          text: '即刻选购',
          fontSize: pxTransform(16),
          fontWeight: '400',
          color: variables.primaryColor,
          y: pxTransform(622),
          x: pxTransform(24),
          zIndex: 2,
          fontFamily,
        },
      ],
    };

    return result;
  }
}

// function guidePriceLeft(str: string, offset: number = 0) {
//   const _size: number = 10;
//   const space_size: number = 4; // 空格宽度
//   const _width: number = strlen(str) * _size;
//   const spaceLen = (str.match(/ /g) || []).length; // 空格数
//   const _rpx: number = Number(`${_width + spaceLen * space_size + offset + 36}`);
//   return pxTransform(_rpx);
// }

// function guidePriceDelLineWidth(str: string) {
//   const _size: number = 7;
//   const space_size: number = 4; // 空格宽度
//   const _width: number = strlen(str) * _size;
//   const spaceLen = (str.match(/ /g) || []).length; // 空格数
//   const _rpx: number = Number(`${13 + _width + spaceLen * space_size}`);
//   return pxTransform(_rpx);
// }
