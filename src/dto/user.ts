import { ICouponsItem } from './coupons';

export interface wxPhoneRes {
  code: string;
  encryptedData: string;
  errMsg: string;
  iv: string;
}

export interface PhoneRes {
  code: string;
  phone: string;
  rid: string;
}

export interface MemberLevel {
  levelCode: string;
  alias: string;
  image: string;
  threshold: number;
  level: number;
}

export interface UserInfo {
  status: number; //用户状态, 0 正常|1 黑名单|2 注销
  sid: string; //用户加密ID
  nickname: string; //用户昵称
  avatar: string; //用户头像
  gender: number; //用户性别, 0 女|1 男|2 未知 ⤵
  createdAt: string; //用户创建时间
  name: string; //用户姓名
  birthday: string; //用户生日
  phone: string; // 手机号
  memberLevel: string | null; // 会员等级，无该字段说明未注册会员
  memberLevelPoints: string; // 当前升级点数
  memberLevels: MemberLevel[]; // 会员等级，无该字段说明未注册会员
  memberLevelUpPoints: number; // 所需升级点数
  points: number; // 积分
  subscribed: boolean; // 是否关注公众号
  guide: {
    id: number; //ID
    storeCode: string; //店铺编码
    name: string; //姓名
    avatar: string; //头像
    wxId: string; //企业微信ID
    qrcode: string; //二维码
  };
  province: string;
  city: string;
  district: string;

  // old zippo 登录返回值
  address?: string;
  openid?: string;
  session_key?: string;
  unionid?: string;
  id?: string;

  currentLevel?: MemberLevel; // 当前等级配置
  nextLevel?: MemberLevel; // 下一等级配置
}
export interface AuthFlowParams {
  target: string;
  // forced?: boolean;
  // onlyUinfo?: Boolean;
}

// 注册会员参数

export interface MemberParams {
  phone: { code: string; phone: string };
  rid: string;
  // birthday: string;
  // nickname: string;
  // avatar: string;
  introducer?: string; // 推荐人, 由他人分享进入
}

export interface MemberInfo {
  memberLevel: string;
  gifts: INewComerGiftsInfo[];
  isNew: boolean;
}

export interface UpdateUserParams {
  nickname?: string; //用户昵称
  avatar?: string; //用户头像
  gender?: number; //用户性别, 0 女|1 男|2 未知 ⤵
  name?: string; //用户姓名
  birthday?: string; //用户生日
  phone?: {
    phone: string;
    code: string;
  };
  rid?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
}

export enum INewComerGiftsType {
  coupon = 'coupon',
  point = 'point',
}

export interface INewComerGiftsInfo {
  type: INewComerGiftsType;
  value: ICouponsItem | string;
}

export interface IBirthdayGiftsInfo extends INewComerGiftsInfo {}

export interface IMemberLevelUpsInfo {
  level: number; //等级级别
  levelCode: string; //等级英文标识
  isRead: boolean; //该消息是否已读
  gifts: INewComerGiftsInfo[];
}
