import { getMissionsApi } from '@/api/missions';
import { IUicodeTaskItem } from '@/constants';
import { MISSIONS_CODE, MISSIONS_CODE_URL, MISSIONS_TYPE } from '@/constants/missions';
import { IMissions, rewardType } from '@/dto/missions';
import { LinkType, isUrl } from '@/utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useSigninStore } from './signin';

export const useMissionsStore = defineStore('missions-store', () => {
  const list = ref<IMissions[]>([]);
  const article = ref('');

  const load = async () => {
    const result = await getMissionsApi();
    list.value.splice(0, list.value.length);
    for (const o of result.list) {
      list.value.push(...o.missions);
    }
  };

  // const subwxoaLink = () => {
  //   useDocumentStore()
  //     .loadWxoaArticle()
  //     .then(link => {
  //       article.value = link;
  //     });
  // };

  // 展示在个人中心的任务
  const missionsInMine = computed(() => {
    const arr = list.value.filter(mis => mis.meta?.placement?.includes('个人中心'));

    // subwxoaLink();
    const res = [
      {
        url: '/packageA/pages/signin/signin',
        icon: require('@/static/icon/sign.png'),
        name: '每日签到',
        type: LinkType.path,
        redDot: !useSigninStore().isSignedIn,
        position: 9999999,
      },
    ];
    for (const mis of arr) {
      const redDot = Boolean(mis.meta?.remind && mis.receives < mis.times);
      const obj = {
        url: MISSIONS_CODE_URL[mis.code] as string,
        icon: mis.image,
        name: mis.name,
        type: isUrl(mis.link) ? LinkType.h5 : LinkType.path,
        redDot,
        position: mis.position,
      };

      if (mis.link) {
        obj.url = mis.link;
      }

      if (mis.code === MISSIONS_CODE.question) obj.url = `${MISSIONS_CODE_URL[mis.code]}?id=${mis.meta?.targetId}`;
      if (mis.code === MISSIONS_CODE.subwxoa) obj.url = obj.url || article.value;

      res.push(obj);
    }
    return res.sort((a, b) => b.position - a.position);
  });

  // 展示在积分商城的任务
  const missionsInPoint = computed((): IMissions[] => {
    const arr = list.value.filter(mis => mis.meta?.placement?.includes('积分商城'));
    const res: IMissions[] = [
      {
        code: MISSIONS_CODE.signin,
        type: MISSIONS_TYPE.daily,
        name: '签到',
        image: require('@/static/icon/sign.png'),
        desc: '完成每日签到获得',
        id: 'SIGNIN',
        action: '',
        completes: 0,
        completesTotal: 0,
        points: 1,
        receives: 0,
        times: useSigninStore().isSignedIn ? 0 : 1,
        timesTotal: 0,
        position: 9999999,
        rewardValue: 0,
        rewardType: rewardType.point,
        link: '',
      },
    ];
    for (const mis of arr) {
      res.push(mis);
    }
    return res.sort((a, b) => b.position - a.position);
  });

  // 展示在扫码验真的任务
  const missionsUicode = computed(() => {
    const arr = list.value.filter(mis => mis.code === MISSIONS_CODE.userinfo || mis.code === MISSIONS_CODE.uploadorder);
    const res: IUicodeTaskItem[] = [];
    for (const mis of arr) {
      const obj = {
        id: `${mis.id}`,
        code: mis.code,
        url: MISSIONS_CODE_URL[mis.code] as string,
        icon: mis.image,
        name: mis.name,
        type: LinkType.path,
        status: 1,
        btnText: '去完成',
        rewardValue: mis.rewardValue,
        sort: 0,
      };

      if (mis.code === MISSIONS_CODE.userinfo) {
        if (mis.completes > 0 && mis.receives < mis.completes) obj.btnText = '领取';
        obj.sort = 100;
      }

      if (mis.code === MISSIONS_CODE.uploadorder) {
        obj.btnText = '去上传';
        obj.sort = 96;
      }

      if (mis.receives >= mis.times || (mis.timesTotal && mis.completesTotal >= mis.timesTotal)) {
        obj.btnText = '已领取';
        obj.status = 0;
      }

      if (mis.link) obj.url = mis.link;
      res.push(obj);
    }

    res.push(
      {
        id: 'GO_POINTMALL_PAGE',
        icon: require('@/static/icon/mission.png'),
        name: '小火苗兑好礼',
        type: LinkType.path,
        url: '/pages/pointmall/pointmall',
        status: 1,
        btnText: '去兑换',
        rewardValue: 0,
        sort: 98,
      },
      {
        id: 'GO_SHOP_PAGE',
        icon: require('@/static/icon/store.png'),
        name: '前往ZIPPO官方商城',
        type: LinkType.path,
        url: '/pages/shop/shop',
        status: 1,
        btnText: '去逛逛',
        rewardValue: 0,
        sort: 97,
      },
    );

    return res.sort((a, b) => b.sort - a.sort);
  });

  // 展示在任务中心的任务
  const missionsInTask = computed((): IMissions[] => {
    const arr = list.value;
    const res: IMissions[] = [
      {
        code: MISSIONS_CODE.signin,
        type: MISSIONS_TYPE.daily,
        name: '签到',
        image: require('@/static/icon/sign.png'),
        desc: '完成每日签到获得',
        id: 'SIGNIN',
        action: '',
        completes: 0,
        completesTotal: 0,
        points: 1,
        receives: 0,
        times: useSigninStore().isSignedIn ? 0 : 1,
        timesTotal: 0,
        position: 9999999,
        rewardValue: 0,
        rewardType: rewardType.point,
        link: '',
      },
    ];
    for (const mis of arr) {
      res.push(mis);
    }
    return res.sort((a, b) => b.position - a.position);
  });

  return { list, missionsInMine, missionsInPoint, missionsUicode, missionsInTask, load };
});
