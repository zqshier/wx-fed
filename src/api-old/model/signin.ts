export interface ISigninOldInfo {
  continue: {
    bqcount: string;
    continue_sign: string;
    continue_sign_all: string;
    daysignall: string;
    lastdaykey: string;
  }[];
  list: { daykey: string; sign_status: string; theday: string }[];
}

export interface ISigninInfoList {
  id: string | number;
  status: number;
  theday: number;
}

export interface ISigninInfo {
  totalDays?: number;
  lastdaykey?: string;
  bqcount?: number;
  list: ISigninInfoList[];
}

export interface ISigninTaskOldInfo {
  score: string; // 任务积分
  task_status: '0' | '1' | '2'; // 0未完成 1已完成 2已领取
  taskid: string; // 任务编号
  title: string; // 任务名称
  type: ISigninTaskType; // 1是tabbar页面 0是普通页面 2是报名活动
  url: string; // 小程序路径
}

export enum ISigninTaskType {
  pathTo = '0',
  pathTab = '1',
  signup = '2',
}

export interface ISigninTaskInfo {
  icon?: string;
  score: number; // 任务积分
  status: number; //  0 | 1 | 2; // 0未完成 1已完成 2已领取
  id: string; // 任务编号
  title: string; // 任务名称
  type: ISigninTaskType;
  url: string; // 小程序路径
}
