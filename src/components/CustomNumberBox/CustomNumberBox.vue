<template>
  <nut-input-number
    v-model="pVal"
    :min="1"
    :max="99"
    button-size="14px"
    :disabled="disabled"
    :readonly="readonly"
    class="custom-number-box"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
const emits = defineEmits(['change', 'update:value']);
const props = defineProps({
  value: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  inputWidth: {
    type: Number,
    default: 29,
  },
});

const pVal = computed({
  get() {
    return props.value;
  },
  set(v) {
    v = Number(v);
    emits('update:value', v);
  },
});
const inputWidth = `${props.inputWidth}px`;

const handleChange = (value: number) => {
  emits('update:value', value);
  emits('change', Number(value));
};
</script>

<style lang="scss">
.custom-number-box {
  border-radius: 16px;
  border: 1px solid $Divide;
  height: 24px;
  box-sizing: border-box;
  .nut-icon {
    padding: 2px 4px;
    width: 16px !important;
    height: 16px !important;
  }
  .nut-icon__img {
    width: 16px;
    height: 16px;
  }

  .h5-input,
  .nut-input-number__text--readonly {
    width: v-bind(inputWidth) !important;
    line-height: 20px;
    font-size: 14px;
    color: $Primary;
    background-color: transparent;
    margin: 0;
  }
  .input-placeholder {
    color: $white;
  }
}
</style>
