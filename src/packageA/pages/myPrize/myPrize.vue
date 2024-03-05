<template>
  <view class="container">
    <CustomBar title="我的奖品" />
    <!-- 列表 -->
    <view class="nut-flex-col nut-col-center nut-row-center" :class="$style.list" v-if="prizeList.length > 0">
      <block v-for="(item, index) in prizeList" :key="index">
        <ListItem :listItem="item" @clickAddr="showPopAddressInfo" />
      </block>
    </view>
    <view v-else :class="$style.default">
      <DefaultPage imgWidth="82" imgHeight="67" imgMbottom="24" tip="暂无奖品~" />
    </view>

    <!-- 填写地址 -->
    <PopAddressInfo
      v-if="popAddressInfo"
      v-model:isShow="popAddressInfo"
      :addressInfo="addressInfo"
      @clickAddress="showAddressPick"
      @clearAddress="initialAddress"
      @secondShow="secondShow"
    ></PopAddressInfo>

    <!-- 地址选择 -->
    <AddressPicker v-model:show="showAddress" v-model:info="addressInfo" />

    <!-- 二次确认 -->
    <PopConfirm
      v-if="isSecondShow"
      v-model:show="isSecondShow"
      @close="closePopAddressInfo"
      :data="formData"
      :code="code"
      :prizeId="prizeId"
    />
  </view>
</template>

<script setup lang="ts">
import { getPrizeRecord } from '@/api/prizes';
import AddressPicker from '@/components/AddressPicker/AddressPicker.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import { IAddressInfo } from '@/dto/address';
import { IAddrInfo, IRecordsInfo, IRecordsItem } from '@/dto/prizes';
import { useReachBottom, useRouter } from '@tarojs/taro';
import { onMounted, reactive, ref } from 'vue';
import PopAddressInfo from './components/PopAddressInfo/PopAddressInfo.vue';
import PopConfirm from './components/PopConfirm/PopConfirm.vue';
import ListItem from './components/listItem/listItem.vue';

const initialData = {
  codes: [],
  texts: [],
};

const router = useRouter();

const data = reactive({
  page: 1,
  perPage: 20,
  finished: false,
});

const popAddressInfo = ref<boolean>(false);
/** 地址选择 */
let showAddress = ref<boolean>(false);
let isSecondShow = ref<boolean>(false);

const addressInfo = ref<IAddressInfo>({ ...initialData });

/** 奖池编码 */
const code = ref<string>(router.params.code || '');
const prizeList = ref<IRecordsItem[]>([]);
/** 奖品ID */
const prizeId = ref<number>();
const formData = ref<IAddrInfo>();

const getList = async () => {
  if (data.finished) return;

  const params = {
    page: data.page,
    perPage: data.perPage,
  };

  const result: IRecordsInfo = await getPrizeRecord(code.value, params);

  if (!result) return;

  data.page += 1;

  const list = result.list || [];
  if (list.length < data.perPage) {
    data.finished = true;
  }

  if (data.page === 1) {
    prizeList.value = list;
  } else {
    prizeList.value = prizeList.value.concat(list);
  }
};

const showAddressPick = () => {
  showAddress.value = true;
};

const secondShow = val => {
  isSecondShow.value = val.type;
  formData.value = val.formData;
};

const showPopAddressInfo = val => {
  prizeId.value = val;
  popAddressInfo.value = true;
};

const closePopAddressInfo = async () => {
  await initPageData();
  await getList();
  await initialAddress();
  popAddressInfo.value = false;
};

const initialAddress = () => {
  addressInfo.value = initialData;
};

const initPageData = () => {
  prizeList.value = [];
  data.finished = false;
  data.page = 1;
};

useReachBottom(() => {
  getList();
});

onMounted(() => {
  getList();
});
</script>

<style lang="scss" module>
@import './myPrize.scss';
</style>
