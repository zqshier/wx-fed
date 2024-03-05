export interface IMedalsDetail {
  medalId: number; //勋章ID
  group: string; //勋章分组
  level: number; //勋章等级
  name: string; //勋章名
  sort: number; //勋章排序
  image1: string; //勋章暗图
  image2: string; //勋章亮图
  description: string; //勋章说明
  greetings: string; //勋章祝福语
  disabled: boolean; //是否下架
  selected?: boolean; //是否佩戴
  subscribed?: boolean; //是否订阅
  createdAt: string; //勋章获取时间, 没有则表示未获取
  no: number; //勋章编号
  progress: number[]; //勋章进度
  ratio: string; // 拥有比率
  namePinyin: string;
  link: string; // 跳转路径
  grantTips: string; // 未完成按钮展示
}

export interface IMedalsSubParams {
  tplId: string; //模板ID
  page: string;
}

export enum FedorderType {
  sort = 'sort',
  create = 'create',
}

export interface IMedalsList {
  selected: IMedalsDetail; //模板ID
  list: IMedalsDetail[];
  settings: {
    //勋章配置
    fedorder: FedorderType; //前端勋章排序
    rulesimages: [string]; // 勋章点亮说明
  };
}

export interface IMedalsCom {
  group: string; //勋章组标识
  sn: string; //收藏商品: skuId
}
