import { IPointGoods, IPointGoodsInfo, IPointGoodsExchange } from '@/api-old/model/goods';
import { INoticeCenterInfo } from '@/api-old/model/system';
import { UserInfo } from '@/dto/user';
import { UserInfo as UserOldInfo } from '@/api-old/model/user';
import { LinkType } from '@/utils';
import { IVerifyCipherInfo } from '@/api-old/model/verifiy';
import { IPointItem } from '@/dto/point';

export const regroupNoticeCenterList = (data: any) => {
  let _data: INoticeCenterInfo[] = [];
  _data = data.map(item => ({
    id: item.id,
    title: item.title,
    content: item.info,
    createdAt: item.d_rowdate,
    updatedAt: item.d_updatedate,
    appid: item.appid,
    url: item.url,
    type: item.type === '第三方小程序' ? LinkType.weapp : LinkType.path,
  }));
  return _data;
};

export const regroupPointGoodsList = (data: any) => {
  const _data: IPointGoodsInfo[] = [];
  const dataAll: IPointGoodsInfo = {
    classname: '全部',
    list: [],
  };
  for (const item of data) {
    const itm: IPointGoodsInfo = {
      classname: item.classname,
      list: item.list.map(i => {
        return {
          class: i.class,
          goodsId: i.d_guid,
          id: i.id,
          num: +i.leftnum || 0,
          marketPrice: +i.marketprice || 0,
          images: i.pics.map(p => p.picurl),
          sku: i.specification,
          name: i.title,
          point: i.f,
        };
      }),
    };
    _data.push(itm);
    dataAll.list.push(...itm.list);
  }
  _data.unshift(dataAll);
  return _data;
};

export const regroupPointGoodsDetail = (data: any): IPointGoods => {
  return {
    class: data.class,
    goodsId: data.d_guid,
    id: data.id,
    num: +data.leftnum || 0,
    marketPrice: +data.marketprice || 0,
    images: data.pics.map(p => p.picurl),
    sku: data.specification,
    name: data.title,
    point: data.f,
  };
};

export const regroupPointGoodsExchangeList = (data: any) => {
  const _data: IPointGoodsExchange[] = data.map(item => ({
    name: item.GoodsName__c,
    status: item.DeliveryStatus__c,
    recipientName: item.RecipientName__c,
    logisticNo: item.TrackingNumber__c,
    province: item.RecipientProvince__c,
    city: item.RecipientCity__c,
    address: item.RecipientStreetAddress__c,
    phone: item.Mobile__c,
  }));
  return _data || [];
};

export const regroupUserInfo = (data: UserOldInfo): UserInfo => {
  return {
    id: data.Id,
    nickname: data.Nick__c,
    // avatar: data.ProfilePhoto__c.includes('https://thirdwx.qlogo.cn/') ? '' : data.ProfilePhoto__c,
    gender: data.Gender__c,
    createdAt: data.RegisterDate1__c,
    birthday: data.Birthday__c,
    phone: data.Mobile__c,
    memberLevel: data.MemberLevel__c,
    points: data.AvailablePoints__c,
    province: data.Province__c,
    city: data.City__c,
    address: data.address,
  };
};

export const regroupCipherInfo = (data: any): IVerifyCipherInfo => {
  return {
    completeInfoVisible: Number(data.completeInfoVisible),
    integralRule: {
      ...data.integralRule,
      num: data.integralRule.integralNum,
    },
    memberInfo: { ...data.member },
    goods: {
      code: data.product?.productCode,
      name: data.product?.productName,
      image: data.product?.productDrpPhotos,
    },
    qrRecordlist: data.zippoQrRecordList.map(item => ({
      code: item.cipher,
      createdAt: item.creadeDate,
      id: item.id,
      openid: item.openid,
    })),
  };
};

export const regroupScoreList = (data: any) => {
  let _data: IPointItem[] = [];
  _data = data.map(item => ({
    id: item.Id,
    changed: item.Integral__c,
    memo: item.IntegralTypeID2__c,
    createdAt: item.CreateTime1__c,
    type: item.Integral__c > 0 ? 'credit' : 'debit',
  }));
  return _data;
};
