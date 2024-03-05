<template>
  <nut-popup position="bottom" v-model:visible="isShow">
    <nut-picker
      class="address-picker"
      v-model="selectedCascaded"
      :columns="cascadedColumns"
      title="请选择所在地区"
      @confirm="confirm"
      @cancel="onClose"
    >
    </nut-picker>
  </nut-popup>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, PropType, computed } from 'vue';
import { isEmpty } from 'lodash';
import { useAddressStore } from '@/stores';
import { IAddressInfo } from '@/dto/address';

interface IColumnsInfo {
  text: string;
  value: string;
  children?: IColumnsInfo[];
}

const emits = defineEmits(['update:show', 'update:info', 'ready']);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object as PropType<IAddressInfo>,
    default: () => ({}),
  },
});

const selectedCascaded = ref<string[]>([]);
const cascadedColumns = ref<IColumnsInfo[]>([]);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

console.log('address info 1', props.info);

const infoChanged = () => {
  const { codes, texts } = props.info;
  let selectValue: string[] = ['110000', '110101', ''];

  console.log('address info 2', props.info);

  if (codes?.length || texts?.length) selectValue = [];

  if (codes?.length) {
    selectValue.push(...codes);
  } else if (texts.length) {
    const strArr: string[] = [...texts];

    // 直辖市
    if (strArr.length >= 2 && strArr[0] === strArr[1]) {
      strArr.shift();
    }

    const lvl1 = findAreaCode(cascadedColumns.value, strArr[0]);
    if (!lvl1) return;

    // if (lvl1) {
    selectValue.push(lvl1.value);
    if (strArr.length > 1) {
      const lvl2 = findAreaCode(lvl1.children || [], strArr[1]);
      if (lvl2) {
        selectValue.push(lvl2.value);
        if (strArr.length > 2) {
          const lvl3 = findAreaCode(lvl2.children || [], strArr[2]);
          if (lvl3) {
            selectValue.push(lvl3.value);
          }
        }
      }
    }
    // }

    console.log('address info 3', selectValue);
    // 微信获取地址
    emits('update:info', {
      codes: selectValue.filter(o => !!o),
      texts: texts.filter(o => !!o),
    });
  }

  if (selectValue.length == 2) selectValue.push('');
  selectedCascaded.value = selectValue;
};

watch(() => props.info, infoChanged, { deep: true });

onMounted(async () => {
  await getAddressData();
  infoChanged();
});

const getAddressData = async () => {
  try {
    cascadedColumns.value = await useAddressStore().getAreaData();
    emits('ready');
  } catch (error) {
    console.error('error', error);
  }
};

const findAreaCode = (data: IColumnsInfo[], text: string) => {
  for (const item of data) {
    if (item.text === text) return item;
  }
};

const confirm = ({ selectedOptions }: { selectedOptions: IColumnsInfo[] }) => {
  if (isEmpty(selectedOptions)) return;
  // console.debug('selectedOptions', selectedOptions);

  // const resp = { str: '', value: [], strvalue: [] };
  const codes: string[] = [];
  const texts: string[] = [];
  for (const o of selectedOptions) {
    codes.push(o.value);
    texts.push(o.text);
  }

  // console.log('{ codes, texts }: ', { codes, texts });
  emits('update:info', { codes: codes.filter(o => !!o), texts: texts.filter(o => !!o) });
  onClose();
};

const onClose = () => {
  emits('update:show', false);
};
</script>

<style lang="scss">
.address-picker {
  .nut-picker-roller-item-tarotile {
    font-weight: 400;
    color: $font-color;
  }
  .nut-picker__right {
    color: $primary-color;
  }
}
</style>
