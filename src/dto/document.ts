import { LinkType } from './banner';

export class DocumentContentVo {
  type: 'text' | 'image' | 'video';
  content: string;
  meta: DocumentContentMeta;
}

export interface DocumentContentMeta {
  linkType: LinkType;
  link: string;
}

export class DocumentVo {
  code: string;
  title: string;
  contents: DocumentContentVo[];
}
