import { GoodsInfo, GoodsInfoSkusItem, IGoodsAct } from '@/dto/goods';
import { reactive, ref } from 'vue';

interface ActivityInfo extends IGoodsAct {
  id: number;
}
export default function useData() {
  const goodsInfo = ref<GoodsInfo | null>(null);
  const activityInfos = ref<ActivityInfo[]>([]);
  const cSkuData = ref<GoodsInfoSkusItem>({
    comb: [],
    combKey: '',
    id: 0,
    image: '',
    isSoldOut: false,
    favorited: false,
    subscribed: false,
    price: '',
    guidePrice: '',
    priceAlias: '',
    sn: '',
    barcode: '',
  });

  const defActivityInfo = reactive({
    promotionInfo: { priceAlias: '' },
    type: '',
    promotionId: '',
    goodsItems: [],
    name: '',
    startTime: null,
    endTime: null,
  });

  return { goodsInfo, cSkuData, activityInfos, defActivityInfo };
}
