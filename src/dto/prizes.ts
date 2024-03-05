import { IMissions } from './missions';

export enum prizeType {
  /** money 现金红包 */
  money = 'money',
  /** 实物 */
  goods = 'goods',
  /** 优惠券 */
  coupon = 'coupon',
  /** 红包封面 */
  redpcove = 'redpcove',
  /** 虚拟奖品 */
  virtual = 'virtual',
}

export interface IAwardsItem {
  name: string; //奖品名称
  type: prizeType;
  position: number; //奖品排序
  image: string; //奖品图片
}
export interface IPondInfo {
  id: number;
  code: string; //奖池唯一编号
  name: string; //奖池名称
  image: string; //奖池背景图
  backgroundColor?: string;
  start: Date; //奖池开放时间
  end: Date; //奖池结束时间
  disabled: boolean; // 奖池已下架
  awards: IAwardsItem[]; //奖池奖品
  tickets: number; //抽奖机会次数
  customerService: string; // 客服图片
  showSubscription: boolean; // 是否展示关注公众号
  outLink: string; // 外部链接
  valid: boolean | string | undefined; // 抽奖码是否有效
  missions: IMissions[];
  cardImages: string[]; // 卡片图片
  shareImage: string; // 分享图片
  shareTitle: string; // 分享标题
}

export interface IAddrInfo {
  name: string; //收货人姓名
  phone: string; //收货人电话
  address: string; //收货人地址
  province: string; //省
  city: string; //市
  district: string; //区
}

export interface IPrizeInfo {
  award: IRecordsItemList;
}

export interface IPrizeInfoAward {
  //中奖奖品
  id: number; //记录ID
  name: string; //奖品名称
  type: prizeType;
  image: string; //奖品图片
  image2: string; //奖品图片2
  createdAt: Date; //中奖时间
  state: string; //状态
  addr: IAddrInfo; //收货地址
  tips: string; //特殊说明
  result: string; //结果
}

export interface IRecordsItem {
  list: IRecordsItemList[];
}

export interface IRecordsItemList {
  //列表
  id: number; //记录ID
  name: string; //奖品名称
  type: prizeType; //奖品类型: * money 现金红包, * goods 实物, * coupon 优惠券
  image: string; //奖品图片
  image2: string; //奖品图片
  createdAt: Date; //中奖时间
  state: string; //状态
  addr: IAddrInfo; //收货地址
  result: string; //结果
  position: number; // 卡片位置
}

export interface IRecordsInfo {
  total: number; //总数
  list: IRecordsItemList[];
}

export interface IVerify {
  tickets: number; // 可用抽奖次数
  valid: boolean; // 本次扫码是否有效, true 有效，资格加一
}

export interface Itickets {
  tickets: number; // 可用抽奖次数
  showSubscription: boolean; // 是否已关注公众号
}

export interface IAddressType {
  province: string;
  city?: string;
  district?: string;
}

export interface IAddrParams {
  id: number; // 奖品ID
  name: string; //收货人姓名
  phone: string; //收货人电话
  address: string; //收货人地址
  province: string; //省
  city: string; //市
  district: string; //区
}
