import { get } from '@/utils/http';
import { IBanner } from '@/dto/banner';
import { DocumentVo } from '@/dto/document';

// const { get } = client;

enum Api {
  // banners = '/interface/api.aspx?action=Slide',
  banners = '/api/banners',
  document = '/api/documents',
}

export const getBanners = async (groups: string[]) =>
  get<{ list: IBanner[] }>({ url: `${Api.banners}?groups=${groups.join(',')}` });

// export const getBanners = async () => get<{ Table: any[] }>({ url: `${Api.banners}` });

export const getDocument = async (code: string) => get<DocumentVo>({ url: `${Api.document}/${code}` });
