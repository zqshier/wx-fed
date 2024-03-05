export enum CouponRecordStatus {
  /** 有效的 */
  active = 'active',
  /** 废弃 */
  discard = 'discard',
  /** 已使用 */
  used = 'used',
}

export enum CouponType {
  /** 未使用 */
  unused = 1,
  /** 已使用 */
  used = 2,
  /** 已过期 */
  expired = 3,
}

/** 券信息 */
export interface ICouponsItem {
  id: number; //ID
  couponId: number; // 券ID
  name: string; //券名
  type: string; //类型: 1 满减券
  value: string; //面值
  threshold: number; //使用门槛(总金额)
  expiration: {
    days: number;
    after: number;
    end: Date;
    start: Date;
  }; //有效期限配置  固定的有效期 { "start": "2022-01-01T00:00:00Z", "end": "2022-01-30T15:59:59Z" }  延时生效 { "after": 3, "days": 30 }
  itemId: number; //跳转商品ID
  rules: string; //规则
  userState: number; // 1 可领取, 2 可使用, 3 已领取过不可再领取
  status: CouponRecordStatus;
  start: Date;
  end: Date;
  code?: string;
}

/** 拥有的券 */
export interface IRecords {
  couponId: number; // 优惠券ID
  status: CouponRecordStatus; // 优惠券状态 ⤵
  start: Date; // 有效期开始
  end: Date; // 有效期结束
}

/** 领券中心结果 */
export interface ICouponsCenterList {
  list: ICouponsItem[];
}

/** 用户拥有优惠券参数 */
export interface ICouponRecordParams {
  page: number; //	第几页
  perPage: number; //每页数据条数
  // userId: number; //指定用户ID
  // code: string; // 指定票券编码
  status: CouponType; // 筛选票券状态
}
/** 用户拥有优惠券 */
export interface ICouponRecord {
  code: string;
  status: CouponRecordStatus;
  start: Date;
  end: Date;
  locked: boolean;
  lockedOrderNo: string;
  config: ICouponsItem;
}

/** 用户拥有优惠券列表 */
export interface ICouponRecordList {
  list: ICouponRecord[];
  total: number;
}

/** 领取优惠券 */
export interface IGetCouponParams {
  couponId: number;

  /** 备注 */
  memo?: string;

  /** 通知模板ID, 订阅成功才上送 */
  templateId?: string;
}
