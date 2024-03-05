import { IBanner } from '@/dto/banner';
import variables from '@/scss/variables';

export const dProps = {
  // 列表数组，元素可为字符串，如为对象可通过keyName指定目标属性名
  list: {
    type: Array<IBanner>,
    default: [],
  },
  // 是否显示面板指示器
  indicator: {
    type: Boolean,
    default: true,
  },
  // 指示器非激活颜色
  indicatorActiveColor: {
    type: String,
    default: variables.white,
  },
  // 指示器的激活颜色
  indicatorInactiveColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.35)',
  },
  indicatorStyle: {
    type: Object,
    default: {},
  },
  // 是否自动切换
  autoplay: {
    type: Boolean,
    default: true,
  },
  // 当前所在滑块的 index
  current: {
    type: [String, Number],
    default: 0,
  },
  // 滑块自动切换时间间隔
  interval: {
    type: [String, Number],
    default: 3000,
  },
  // 滑块切换过程所需时间
  duration: {
    type: [String, Number],
    default: 300,
  },
  // 播放到末尾后是否重新回到开头
  circular: {
    type: Boolean,
    default: true,
  },
  // 当开启时，会根据滑动速度，连续滑动多屏
  acceleration: {
    type: Boolean,
    default: false,
  },
  // 同时显示的滑块数量
  displayMultipleItems: {
    type: Number,
    default: 1,
  },
  // 图片的裁剪模式
  imgMode: {
    type: String,
    default: 'aspectFill',
  },
  // 组件高度
  height: {
    type: [String, Number],
    default: '130',
  },
  // 背景颜色
  bgColor: {
    type: String,
    default: '#f3f4f6',
  },
  // 组件圆角，数值或带单位的字符串
  radius: {
    type: [String, Number],
    default: 0,
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否显示标题，要求数组对象中有title属性
  showTitle: {
    type: Boolean,
    default: false,
  },
  swiperItemSlot: {
    type: Boolean,
    default: false,
  },
  // 样式尺寸
  unit: {
    type: String,
    default: 'px',
  },
  // video名字
  videoName: {
    type: String,
    default: 'home',
  },
  //  有视频时是否自动轮播
  isAutoPlayHasV: {
    type: Boolean,
    default: true,
  },
  // 圆角值
  borderRadius: {
    type: [Number, String],
    default: 0,
  },
  // 高度变化过度效果
  isTransition: {
    type: Boolean,
    default: false,
  },
  transitionStyle: {
    type: Object,
    default: {},
  },
  // 是否使用图片背景
  useImageBg: {
    type: Boolean,
    default: false,
  },
  // 图片懒加载
  lazyLoad: {
    type: Boolean,
    default: true,
  },
  /** 使用方 */
  usage: {
    type: String,
    default: '',
  },
};
