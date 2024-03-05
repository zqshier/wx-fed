/** 专题商品 */
export interface ITopicTagItem {
  id: number;
  name: string;
  price: string;
  guidePrice: string;
  image: string;
  images: string[];
  itemType: string;
  link: string;
  subtitle: string;
}

/** 专题标签 */
export interface ITopicTag {
  name: string;
  items: ITopicTagItem[];
}

/** 专题 */
export interface ITopic {
  code: string;
  name: string;
  start: Date;
  end: Date;
  tags: ITopicTag[];
}

/** 专题组 */
export interface ITopicGroup {
  code: string;
  name: string;
  topics: ITopic[];
}
