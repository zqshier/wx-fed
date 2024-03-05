import { get, post } from '@/utils/http';
import { ICouponRecordList, ICouponsCenterList, IGetCouponParams, ICouponRecordParams } from '@/dto/coupons';

enum Api {
  couponsCenter = '/api/coupons/center',
  couponRecords = '/api/coupons',
  couponGet = '/api/coupons',
  couponAvailables = '/api/coupons/availables',
  couponQuery = '/api/coupons/query',
}

export const getCouponsCenter = async () => get<ICouponsCenterList>({ url: `${Api.couponsCenter}` });

export const getCouponRecords = async () => get<ICouponRecordList>({ url: Api.couponRecords });

export const getCouponRecordsPar = async (data: ICouponRecordParams) =>
  get<ICouponRecordList>({ url: `${Api.couponRecords}`, params: data });

export const getCoupon = async (data: IGetCouponParams) => post({ url: `${Api.couponGet}`, data });

export const getCouponAvailables = async (codes?: string[]) =>
  get<ICouponRecordList>({ url: `${Api.couponAvailables}?codes=${codes?.join(',')}` });

export const getCouponQuery = async (codes: string) =>
  get<ICouponsCenterList>({ url: `${Api.couponQuery}`, params: { codes } });
