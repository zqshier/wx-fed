/** 导购员信息 */
export interface IGuideItem {
  id: number; //ID
  storeCode: string; //店铺编码
  name: string; //姓名
  avatar: string; //头像
  wxId: string; //企业微信ID
  qrcode: string; //二维码
  isGlobal: boolean;
}

/** 导购列表 */
export interface IGuideList {
  total: number; // 总数量
  list: IGuideItem[];
}
