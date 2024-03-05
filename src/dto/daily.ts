export interface IDaily {
  words: string[];
  text1: string;
  text2: string;
  poster: string;
  background: string;
  coupon: {
    couponId: number;
    name: string;
  };
}

export interface ICalendarData {
  year: number;
  month: number | string;
  day: number;
  ncWeek: string;
  nuWeek: string;
  cMonth: string;
  cDay: string;
  festivals: string[];
  animal: string;
  ganZhi: string;
}

export interface IContinuousRewards {
  days: number; // 连签天数
  points: number; // 连签日期
}

export interface ISigninMonthData {
  month: Date; // 月份
  days: {
    signInDate: Date; // 签到日期
    isSignIn: boolean; // 是否签到
  }[]; // 本月签到记录
  configs: {
    dailyPoints: number; // 每日签到奖励积分
    rules: string[]; // 规则说明，图片地址
    continuousRewards: IContinuousRewards[]; // 连续签到奖励
  }; // 签到配置
}

export enum ESigninType {
  daily = 'daily',
  continuous = 'continuous',
}

export enum ESigninStatus {
  pending = 'pending',
  successed = 'successed',
  failure = 'failure',
}

export interface ISigninRewardsData {
  type: ESigninType;
  days: number;
  memo: string;
  count: number;
  status: ESigninStatus;
}

export interface ISigninData {
  signInDate: Date;
  isBackfill: boolean;
  createdAt: Date;
  rewards: ISigninRewardsData[];
}
