import { ELinkflowEventsName, ILinkflowEventsProps } from '@/dto/events';
import { post } from '@/utils/http';

interface ICdpEvent {
  sid: string;
  messages: {
    message_id?: string;
    data: {
      event: ELinkflowEventsName;
      props: ILinkflowEventsProps;
    };
  }[];
}

enum Api {
  event = '/cdp/event',
}
// 埋点推事件
export const cdpEventApi = async (data: ICdpEvent) => post({ url: `${Api.event}`, data });
