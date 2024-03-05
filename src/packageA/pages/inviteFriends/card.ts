import Taro, { pxTransform as pxt } from '@tarojs/taro';
// import { strlen } from '@/utils';
import { DrawConfig } from '@/components/PosterBuilder/types';
import variables from '@/scss/variables';

const fontFamily = 'FZLanTingHei-R-GBK';
const sysInfo = Taro.getSystemInfoSync();
// 兼容iphon 6/7/8plus 2倍图不显示海报问题
const scaleRatio = sysInfo.screenWidth > 375 ? 1.5 : 2;
const pxTransform = (size: number) => {
  const s = pxt(size * scaleRatio);
  return parseInt(s);
};

export default class LastMayday {
  palette(shareImage: string, qrcodeUrl: string): DrawConfig {
    const result: DrawConfig = {
      width: pxTransform(375),
      height: pxTransform(698),
      backgroundColor: variables.white,
      debug: false,

      images: [
        {
          url: shareImage,
          width: pxTransform(375),
          height: pxTransform(698),
          x: pxTransform(0),
          y: pxTransform(0),
        },

        {
          url: qrcodeUrl,
          width: pxTransform(68),
          height: pxTransform(68),
          y: pxTransform(592),
          x: pxTransform(290),
        },
      ],
    };

    return result;
  }
}
