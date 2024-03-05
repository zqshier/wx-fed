import { IPointsGoodsInfo } from '@/dto/point';

export interface IPointGoods {
  class: string;
  goodsId: string;
  id: string;
  num: number;
  marketPrice: number;
  images: string[];
  sku: string;
  name: string;
  point: number;
}

export interface IPointGoodsInfo {
  className: string;
  id: number;
  // list: IPointGoods[];
  list: IPointsGoodsInfo[];
}

export interface IPointGoodsExchange {
  name: string;
  status: string;
  recipientName: string;
  logisticNo: string;
  province: string;
  city: string;
  address: string;
  phone: string;
}
