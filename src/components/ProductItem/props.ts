import { PropType } from 'vue';
import variables from '@/scss/variables';
import { ITopicTagItem } from '@/dto/topic';
export const dProps = {
  item: {
    type: Object as PropType<ITopicTagItem>,
    default: {},
  },
  // 裁剪模式
  mode: {
    type: String,
    default: 'widthFix',
  },
  // 宽度
  width: {
    type: [String, Number],
    default: '690',
  },
  // 高度
  imgHeight: {
    type: [String, Number],
    default: '276',
  },
  // 圆角
  borderRadius: {
    type: [String, Number],
    default: 24,
  },
  // 是否懒加载，微信小程序、App、百度小程序、字节跳动小程序
  lazyLoad: {
    type: Boolean,
    default: true,
  },
  // 背景颜色
  bgColor: {
    type: String,
    default: variables.white,
  },
  itemMg: {
    type: [String, Number],
    default: 0,
  },
  // 是否显示划线价
  showGuidePrice: {
    type: Boolean,
    default: true,
  },
};
