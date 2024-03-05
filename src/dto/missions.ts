import { MISSIONS_CODE, MISSIONS_TYPE } from '@/constants';

export interface IMissions {
  code: MISSIONS_CODE;
  type: MISSIONS_TYPE;
  name: string;
  image: string;
  desc: string;
  times: number;
  id: number | string;
  points: number;
  action: string;
  completes: number;
  receives: number;
  timesTotal: number; //任务奖励最多领取次数(总)
  completesTotal: number; // 任务完成次数(总)
  meta?: { remind: boolean; placement: string[]; hideAfterComplete: boolean; targetId?: string };
  rewardValue: number; // 任务奖励值
  rewardType: rewardType;
  link: string;
  position: number;
}

export interface IMissionsList {
  type: MISSIONS_TYPE;
  missions: IMissions[];
}

export enum rewardType {
  point = 'point',
  lotteryTicket = 'lotteryTicket',
}
