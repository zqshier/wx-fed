import { toPx } from '@/components/PosterBuilder/utils/tools';
import Taro from '@tarojs/taro';
import { nextTick, reactive } from 'vue';

let scrollSameCount = 0;
let updateScrollTimer;
export default function useTouch() {
  /** 滑动效果处理 begin */
  const touchStat = reactive<{
    startX: number;
    startY: number;
    lastY: number;
    maxHeight: number;
    minHeight: number;
    bannerHeight: number;
    moveDistance: number;
    animateData: any;
    isMoving: boolean;
    startHeight: number;
    startTop: number;
    scrollTop: number;
    scrollViewTop: number;
    contentHeight: number;
    contentAnimation: any;
    windowHeight: number;
    bottomHeight: number;
    enableScroll: boolean;
    enableTouchFollow: boolean;
    scrollBounces: boolean;
    direction: number;
    baseAnimateTime: number;
    easeAnimateTime: number;
    fixBottom: number;
    currentScrollTop: number;
    lastScrollTop: number;
    isIos: boolean;
    moveRecord: number[];
  }>({
    startX: 0,
    startY: 0,
    lastY: 0,
    maxHeight: toPx(562 * 2),
    minHeight: toPx(375 * 2),
    bannerHeight: 0,
    moveDistance: 0,
    animateData: {},
    isMoving: false,
    startHeight: 0,
    startTop: 0,
    scrollTop: 0,
    contentHeight: 0,
    contentAnimation: {},
    windowHeight: Taro.getSystemInfoSync().windowHeight,
    bottomHeight: 0,
    enableScroll: false,
    scrollViewTop: 0,
    enableTouchFollow: true,
    scrollBounces: false,
    direction: 0,
    baseAnimateTime: 10,
    easeAnimateTime: 300,
    fixBottom: 0,
    currentScrollTop: 0,
    lastScrollTop: 0,
    isIos: Taro.getSystemInfoSync().system.indexOf('iOS') > -1,
    moveRecord: [],
  });

  function getAnimate(duration: number, timingFunction = 'ease-in-out') {
    return Taro.createAnimation({
      transformOrigin: '50% 50%',
      duration,
      timingFunction: timingFunction as any,
      delay: 0,
    });
  }

  async function handleTouchStart(event) {
    touchStat.startX = event.changedTouches[0].pageX || 0;
    touchStat.startY = event.changedTouches[0].pageY || 0;
    touchStat.lastY = touchStat.startY;
    touchStat.moveDistance = 0;
    touchStat.startHeight = touchStat.bannerHeight;
    touchStat.startTop = touchStat.scrollTop;
    touchStat.isMoving = false;
    touchStat.moveRecord = [];
    touchStat.direction = 0;
    console.log('startHeight', touchStat.startHeight);
  }

  function setBannerHeight(moveY: number, time: number, forceHeight = 0) {
    let bannerHeight = touchStat.startHeight - moveY;

    if (forceHeight) {
      bannerHeight = forceHeight;
    } else {
      if (bannerHeight < touchStat.minHeight) {
        bannerHeight = touchStat.minHeight;
      } else if (bannerHeight > touchStat.maxHeight) {
        bannerHeight = touchStat.maxHeight;
      }
    }

    if (bannerHeight <= touchStat.minHeight) {
      touchStat.enableScroll = true;
    }

    touchStat.bannerHeight = bannerHeight;
    const ani = getAnimate(time);
    ani.height(bannerHeight).step();
    touchStat.animateData = ani.export();
  }

  function checkDirection(lastMove: number) {
    touchStat.moveRecord.push(lastMove);
    if (touchStat.moveRecord.length > 6) {
      touchStat.moveRecord.shift();
    }
    const moveSum = touchStat.moveRecord.reduce((a, b) => a + b, 0);
    return moveSum;
  }

  function handleTouchMove(event) {
    const endY = event.changedTouches[0].pageY || 0;
    const { startY } = touchStat;
    const moveY = startY - endY;
    touchStat.direction = checkDirection(touchStat.lastY - endY);
    touchStat.lastY = endY;

    console.log('move', touchStat.direction, touchStat.scrollTop, touchStat.startTop, touchStat.isMoving);

    if (!touchStat.isMoving && Math.abs(moveY) < 10) return;
    if (touchStat.scrollTop > 1) return;

    touchStat.isMoving = true;
    touchStat.moveDistance = moveY;
    touchStat.enableScroll = false;

    if (touchStat.enableTouchFollow) {
      if (moveY > 0) {
        setBannerHeight(moveY, 0);
      } else {
        if (touchStat.isIos) {
          setBannerHeight(0, 500, touchStat.maxHeight);
        } else {
          setBannerHeight(moveY, 0);
        }
      }
    } else {
      if (moveY > 0) {
        setBannerHeight(0, 500, touchStat.minHeight);
      } else {
        setBannerHeight(0, 500, touchStat.maxHeight);
      }
    }

    console.log('moveY', moveY);
  }

  function handleTouchEnd(event) {
    if (!touchStat.isMoving) {
      if (touchStat.direction < 0) {
        if (touchStat.scrollTop > 1) {
          setTimeout(() => {
            if (touchStat.scrollTop > 1) return;
            touchStat.isMoving = true;
            handleTouchEnd(event);
          }, 200);
          return;
        }
      } else {
        return;
      }
    }
    touchStat.isMoving = false;

    const endY = event.changedTouches[0].pageY || 0;
    const { startY } = touchStat;
    const moveY = startY - endY;

    console.log('endY', touchStat.direction, moveY);
    if (Math.abs(touchStat.direction) < 5) {
      touchStat.direction = moveY;
    }

    if (touchStat.direction > 0) {
      setBannerHeight(0, 300, touchStat.minHeight);
      touchStat.enableScroll = true;
      touchStat.scrollViewTop = 0;
    } else {
      setBannerHeight(0, 300, touchStat.maxHeight);
      touchStat.enableScroll = false;
      touchStat.scrollViewTop = 0;
    }
  }

  function setScrollTop(top: number) {
    touchStat.scrollViewTop = touchStat.scrollTop;
    nextTick(() => {
      touchStat.scrollViewTop = top;
    });
  }

  function updateScrollInfo() {
    const query = Taro.createSelectorQuery();
    query.select('#scroll-view').scrollOffset();
    query.exec(res => {
      if (res && res[0]) {
        let { scrollTop } = res[0];
        // console.log('scrollTop', scrollTop);
        if (touchStat.isMoving) {
          if (touchStat.scrollTop === scrollTop) {
            scrollSameCount += 1;
          } else {
            scrollSameCount = 0;
          }
          if (scrollSameCount > 3) {
            scrollTop = 0;
            scrollSameCount = 0;
            setScrollTop(0);
          }
        }
        touchStat.scrollTop = scrollTop;
      }
    });

    updateScrollTimer = setTimeout(() => {
      updateScrollInfo();
    }, 100);
  }

  function clearUpdateScrollTimer() {
    clearTimeout(updateScrollTimer);
  }
  /** 滑动效果处理 end */
  return {
    touchStat,
    handleTouchStart,
    setBannerHeight,
    handleTouchEnd,
    handleTouchMove,
    updateScrollInfo,
    clearUpdateScrollTimer,
  };
}
