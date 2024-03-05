import { PropType } from 'vue';
import variables from '@/scss/variables';

export enum LogoColorType {
  WHITE = 'white',
  BLACK = 'black',
}

export const dProps = {
  title: {
    type: String,
    default: '',
  },
  showLeft: {
    type: Boolean,
    default: true,
  },
  showBack: {
    type: Boolean,
    default: true,
  },
  showLogo: {
    type: Boolean,
    default: false,
  },
  logoIcon: {
    type: String,
    default: '',
  },
  customBack: {
    type: Boolean,
    default: false,
  },
  titIcon: {
    type: String,
    default: '',
  },
  fixed: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: Number || String,
    default: 10,
  },
  border: {
    type: Boolean,
    default: false,
  },
  backIcon: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: variables.white,
  },
  fontColor: {
    type: String,
    default: variables.black,
  },
  isNtitleSlot: {
    type: Boolean,
    default: false,
  },
  backIconSlot: {
    type: Boolean,
    default: false,
  },
  fixedType: {
    type: String,
    default: 'fixed',
  },
  isPlaceholder: {
    type: Boolean,
    default: true,
  },
  logoColor: {
    type: String as PropType<LogoColorType>,
    default: LogoColorType.WHITE,
  },
};
