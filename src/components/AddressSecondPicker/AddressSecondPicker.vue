<template>
  <nut-popup position="bottom" v-model:visible="isShow">
    <nut-picker
      class="address-picker"
      v-model="selectedMcolumn"
      :columns="cascadedColumns"
      :swipe-duration="100"
      title="请选择所在地区"
      @confirm="confirm"
      @change="onChange"
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

interface IMultipleColumns {
  text: string;
  value: string;
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

const cascadedColumns = ref<IColumnsInfo[]>([]);
const selectedMcolumn = ref<string[]>([]);
// const multipleColumns = ref<IMultipleColumns[][]>([]);
const selectedOptions = ref<IMultipleColumns[]>([]);

// console.log('address info 1', props.info);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const infoChanged = () => {
  let { codes, texts } = props.info;
  let selectValue: string[] = ['110000', '110101'];

  texts = texts.map(text => handleAreaText(text));
  // console.log('address info 2', props.info);

  if (codes?.length || texts?.length) selectValue = [];

  if (codes?.length) {
    selectValue.push(...codes);
  } else if (texts.length) {
    const strArr: string[] = [...texts];

    // 直辖市
    // if (strArr.length >= 2 && strArr[0] === strArr[1]) {
    //   strArr.shift();
    // }

    const lvl1 = findAreaCode(cascadedColumns.value, strArr[0]);
    if (lvl1) {
      selectValue.push(lvl1.value);
      selectedOptions.value.push({ text: lvl1.text, value: lvl1.value });
      texts[0] = lvl1.text;
      if (strArr.length >= 1) {
        const lvl2 = findAreaCode(lvl1.children || [], strArr[1]);
        if (lvl2) {
          selectValue.push(lvl2.value);
          selectedOptions.value.push({ text: lvl2.text, value: lvl2.value });
          texts[1] = lvl2.text;
        }
      }
    }

    // console.log('address info 3', selectValue);
    // 微信获取地址
    emits('update:info', {
      codes: selectValue.filter(o => !!o),
      texts: texts.filter(o => !!o),
    });
  }

  console.debug('selectValue', selectValue);

  selectedMcolumn.value = selectValue;
  // multipleColumns.value = handleMultiColumn(cascadedColumns.value, true);
};

watch(() => props.info, infoChanged, { deep: true });

onMounted(async () => {
  await getAddressData();
  infoChanged();
});

const getAddressData = async () => {
  try {
    cascadedColumns.value = await useAddressStore().getAreaData();
    formattedData();
    emits('ready');
  } catch (error) {
    console.error('error', error);
  }
};

// function handleMultiColumn(culumns: IColumnsInfo[], load: boolean = false) {
//   const _multipleColumns: IMultipleColumns[][] = load ? [[], []] : multipleColumns.value;
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [province, _] = selectedMcolumn.value;
//   const cProvince = province;
//   console.debug('cProvince', selectedMcolumn.value);
//   culumns.forEach(item => {
//     if (item.children!.length > 1) {
//       load ? _multipleColumns[0].push({ text: item.text, value: item.value }) : '';
//       if (item.value === cProvince) {
//         const arr: any = item.children?.map(i => ({ text: i.text, value: i.value }));
//         load ? _multipleColumns[1].push(...arr) : (_multipleColumns[1] = [...arr]);
//       }
//     }
//   });

//   return _multipleColumns;
// }

// 格式化省市区数据
function formattedData() {
  for (const iterator of cascadedColumns.value) {
    if (iterator.children) {
      for (const iterators of iterator.children) {
        delete iterators.children;
      }
    }
  }
}

const findAreaCode = (data: IColumnsInfo[], text: string) => {
  for (const item of data) {
    if (item.text === text || item.value === text) return item;
  }
  return data[0];
};

function handleAreaText(text) {
  const municipalitys = ['北京', '重庆', '上海', '天津'];
  const volumeUps = ['香港', '澳门'];
  if (municipalitys.includes(text)) return `${text}市`;
  if (volumeUps.includes(text)) return `${text}特别行政区`;
  return text;
}

const onChange = ({ columnIndex, selectedValue, selectedOptions: sOptions }) => {
  console.debug('{ columnIndex, selectedValue, selectedOptions: sOptions }', {
    columnIndex,
    selectedValue,
    selectedOptions: sOptions,
  });
  selectedMcolumn.value = selectedValue;
  selectedOptions.value = sOptions;
  // if (columnIndex === 0) {
  //   multipleColumns.value = handleMultiColumn(cascadedColumns.value);
  // }
};

const confirm = () => {
  if (isEmpty(selectedOptions.value)) return;
  console.log('--------');

  const codes: string[] = [];
  const texts: string[] = [];
  for (const o of selectedOptions.value) {
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
