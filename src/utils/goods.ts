import { ELinkflowEventsName, ILinkflowEventsProps } from '@/dto/events';
import { GoodsInfo, GoodsInfoSkuConfigs, GoodsInfoSkus } from '@/dto/goods';
import { IPointsGoodsInfo } from '@/dto/point';
import { getApp } from '@tarojs/taro';
import { getRefererPath } from './track/config';

const isPartMatch = (cfg: { key: string[]; isSoldOut: boolean }, comb: string[]) => {
  for (let i = 0; i < comb.length; i++) {
    if (comb[i] && comb[i] !== cfg.key[i]) return false;
  }
  return true;
};

/** 当前SKU组合是否不可选 */
export const goodsSkuIsDisabled = (skus: { key: string[]; isSoldOut: boolean }[], comb: string[]) => {
  for (const a of skus) {
    // console.debug(JSON.stringify(a.key), comb, isPartMatch(a, comb), a.isSoldOut);
    if (isPartMatch(a, comb) && !a.isSoldOut) return false;
  }
  return true;
};

export const skuCombs = (cfg: GoodsInfoSkuConfigs[], skus: GoodsInfoSkus[]) => {
  let names: string[][] = [];
  if (!cfg?.length) {
    names.push(['']);
  } else {
    for (const subList of cfg) {
      if (!names.length) {
        names = subList.values.map(n => [n]);
      } else {
        const subResult: string[][] = [];
        for (const r of names) {
          const tailList = subList.values.map(n => [...r, n]);
          subResult.push(...tailList);
        }
        names = subResult;
      }
    }
  }

  const combs: { key: string[]; isSoldOut: boolean }[] = [];
  for (const key of names) {
    const sku = skus.find(o => o.combKey === key.join('+'));
    if (sku) {
      combs.push({ key, isSoldOut: sku.isSoldOut });
    }
  }
  return combs;
};

/** 当前是否有效预约活动 */
export function goodsBooking(g: GoodsInfo | IPointsGoodsInfo | undefined | null) {
  if (!g?.booking) return null;
  const booking = g.booking;
  // 超过通知时间1小时后，不再显示预约状态
  if (Date.now() > new Date(booking.sendAt).getTime() + 60 * 60 * 1000) {
    return null;
  }
  return booking;
}

export function onGoodsDetailClick(
  g: {
    barcode: string;
    name: string;
    sn: string;
    price: number;
    id: string;
    point?: number;
    type: '商品' | '积分商品';
  },
  userAction: '浏览' | '加入购物车' | '立即购买' | '点赞' | '分享' | '上新预约' | '到货提醒' | '选购同款',
) {
  const linkflow = getApp()[`${process.env.APP_ID}`];
  if (!linkflow) return;
  // 埋点 点击商品行为
  const triggerPagePath = getRefererPath();
  linkflow.track({
    event: ELinkflowEventsName.PrductDetail_Click,
    props: {
      skuId: g.barcode,
      outerSkuId: g.sn,
      miniSkuId: g.id,
      productName: g.name,
      currentPrice: +g.price || g.price,
      currentPoint: (g?.point && g.point) || null,
      isPointProduct: g.type === '积分商品',
      userAction,
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
}
