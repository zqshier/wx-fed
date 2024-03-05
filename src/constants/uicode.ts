import { LinkType } from '@/dto/banner';
import { MISSIONS_CODE } from './missions';

export enum EMissionCode {
  /** 首次验证 */
  VERIFICATION_FIRST = 'VERIFICATION_FIRST',
  /** 填写购买目的 */
  FILL_BUY_PURPOSE = 'FILL_BUY_PURPOSE',
}

export interface IUicodeTaskItem {
  id?: string;
  code?: MISSIONS_CODE;
  url: string;
  icon: string;
  name: string;
  type: LinkType;
  status: number;
  btnText: string;
  rewardValue: number; // 任务奖励值
  sort: number; //排序
}
