// export interface IRecommend {
//   itemId: number; //商品id
//   isShow: boolean; //是否展示在搜索页
//   sort: number; //排序
//   relationItems: [
//     {
//       //关联商品
//       itemId: number; //关联商品id
//       sort: number; //关联商品的排序
//       name: string; //商品名称
//       image: string; //商品图片
//       price: string; //商品价格
//     },
//   ];
// }

export interface IRecommendListParam {
  page: number;
  perPage: number;
  noPagination: boolean; // 无需分页
  finished?: boolean; // 是否加载完
}

export interface IRecommendListRes {
  list: IRecommendList[];
  total: number; //总数
}

export interface IRecommendList {
  itemId: number; //关联商品id
  name: string; //商品名称
  image: string; //商品图片
  price: string; //商品价格
}
