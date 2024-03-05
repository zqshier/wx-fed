export enum LinkType {
  none = 'none',
  path = 'path',
  weapp = 'weapp',
  h5 = 'h5',
}

export interface IBanner {
  title?: string;
  /** 分组编号 */
  group: string;

  /** 媒体地址 */
  src: string;

  /** 媒体类型 */
  srcType: 'image' | 'video';

  /** 跳转地址 */
  link: string;

  /** 跳转地址类型 */
  linkType: LinkType;

  /** 小程序ID */
  mpAppId?: string;

  /** id */
  id: number;
  /** 描述 */
  desc: string;
}
