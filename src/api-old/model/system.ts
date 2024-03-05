import { LinkType } from '@/utils';

export interface INoticeCenterInfo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  appid: string;
  url: string;
  type: LinkType;
}
