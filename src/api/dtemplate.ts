import { get } from '@/utils/http';
import { IDeliverTemplate } from '@/dto/dtemplate';

enum Api {
  deliverTemplate = '/api/cart/deliverTemplate',
}

export const getDeliverTemplateApi = async () =>
  get<{ list: IDeliverTemplate[]; total: number }>({ url: `${Api.deliverTemplate}` });
