import { post } from '@/utils/http';

export interface IUiCodeVerifyData {
  cipher: string;
}

export interface IUiCodeBuyPurposeData {
  cipher: string;
  /** 购买目的, 送礼=1, 收藏=2, 自用=3 */
  buyPurpose: '1' | '2' | '3';
}

export class IUiCodeVerificationRecordVo {
  /** 记录ID */
  id: string;

  /** 记录时间 */
  createdAt: Date;

  /** 记录填写的购买目的 */
  buyPurpose: string;

  /** 用户身份标识 */
  enUserId: string;
}

export class IUiCodeProductVo {
  /** 产品名称 */
  name: string;

  /** 产品英文名称 */
  name_e: string;

  /** 扫码验真页面显示的照片 */
  qrPhoto?: string;
  code: string;
  /** barcode */
  barcode: string;
}

export class IUiCodeMissionVo {
  /** 任务名 */
  name: string;

  /** 任务编码 */
  code: string;

  /** 奖励积分 */
  points: number;

  /** 该码是否完成 */
  completed: boolean;
}

export interface IUiCodeVerifyResp {
  /** 扫码记录 */
  records: IUiCodeVerificationRecordVo[];

  /** 该码被扫总次数 */
  total: number;

  /** 本次扫码记录 */
  record: IUiCodeVerificationRecordVo;

  /** 该防伪码关联的产品 */
  product?: IUiCodeProductVo;

  /** 相关任务 */
  missions?: IUiCodeMissionVo[];
  /** 经销商信息 */
  distributor: { code: string; name: string; phoneNumber: string };
}

/** 防伪验真 */
export function uicodeVerify(data: IUiCodeVerifyData): Promise<IUiCodeVerifyResp> {
  return post<IUiCodeVerifyResp>({ url: '/api/uicodes/verification', data });
}

/** 填写购买目的 */
export function uicodeSetBuyPurpose(data: IUiCodeBuyPurposeData) {
  return post({ url: '/api/uicodes/buy-purpose', data });
}
