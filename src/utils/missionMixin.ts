import { MISSIONS_CODE } from '@/constants/missions';
import { useMissionsStore } from '@/stores';
import Taro from '@tarojs/taro';
import { isEmpty } from 'lodash';
import { ref } from 'vue';
import { getMissionsRecords } from '.';

export default function getMissionMixin(data: { path: string; params: any }) {
  // console.log('data:-------- before', data);
  const currentPreloadData = Taro.getCurrentInstance().preloadData || null;
  // console.log('data:-------- currentPreloadData', currentPreloadData);
  const missionsStore = useMissionsStore();

  const currentPagePath = ref(data.path); // 当前页面路径
  const currentParams = ref(data.params); // 当前页面参数
  const matchPath = ref(''); // 任务匹配路径
  const matchParams = ref({}); // 任务匹配参数
  const matchInfo = ref();

  const setMatchInfo = async () => {
    // 有预加载数据优先取值处理
    if (!isEmpty(currentPreloadData)) {
      if (currentPreloadData?.missionParams && currentPreloadData.missionParams?.code === MISSIONS_CODE.pageview) {
        matchInfo.value = currentPreloadData.missionParams;
        Taro.preload({ missionParams: null });
        await getDotaskApi(false);
      }
    }

    if (!missionsStore.list.length) {
      await missionsStore.load();
    }

    // console.log('missionsStore.list: ', missionsStore.list);
    const data = missionsStore.list.find(item => {
      let match;
      if (item.link.indexOf('?') !== -1) {
        match = item?.link?.substring(1, item.link.indexOf('?')) || '';
      } else {
        match = item?.link?.substring(1);
      }
      return item.code === MISSIONS_CODE.pageview && match === currentPagePath.value;
    });

    // console.log('data:-------- after', data);
    const { path, params } = parsePathWithParams(data?.link);

    matchInfo.value = data || {};
    matchPath.value = path;
    matchParams.value = params;

    const pathRes = comparePaths(path, currentPagePath.value);
    const paramsRes = compareParams(params, currentParams.value);

    // 已完成任务
    const isCompleted = Boolean(data && data.receives < data.times);

    // console.log('pathRes || !paramsRes: ', pathRes, paramsRes, isCompleted);
    if (!pathRes || !paramsRes || !isCompleted) return;

    getDotaskApi();
  };

  const parsePathWithParams = pathWithParams => {
    // 使用正则表达式匹配路径和参数
    const match = pathWithParams?.match(/^\/([^?]+)(\?.*)?$/);

    if (match) {
      const path = match[1]; // 匹配到的路径部分
      const queryParams = {}; // 参数对象

      if (match[2]) {
        // 如果有参数部分，则解析参数
        const queryString = match[2].substring(1); // 去除问号
        const paramsArray = queryString.split('&');

        paramsArray.forEach(param => {
          const [key, value] = param.split('=');
          queryParams[key] = decodeURIComponent(value); // 解码参数值
        });
      }

      return {
        path: path,
        params: queryParams,
      };
    } else {
      // 如果不匹配任何规则，则返回空对象
      return {
        path: '',
        params: {},
      };
    }
  };

  const comparePaths = (path1, path2) => {
    const sanitizedPath2 = path2.replace(/^\//, '');

    // 比较两个路径是否一致
    return path1 === sanitizedPath2;
  };

  const compareParams = (routeParams: Record<string, string>, pageParams: Record<string, string>) => {
    // eslint-disable-next-line no-prototype-builtins
    if (pageParams.hasOwnProperty('$taroTimestamp')) {
      delete pageParams['$taroTimestamp'];
    }

    const routeKeys = Object.keys(routeParams);
    const pageKeys = Object.keys(pageParams);

    // 检查参数的键名数量是否一致
    if (routeKeys.length !== pageKeys.length) {
      return false;
    }

    // 检查每个键名对应的值是否一致
    for (const key of routeKeys) {
      if (routeParams[key] !== pageParams[key]) {
        return false;
      }
    }

    return true;
  };

  const getDotaskApi = async (refresh = true) => {
    if (!matchInfo.value) return;

    const params = {
      code: MISSIONS_CODE.pageview,
      missionId: matchInfo.value?.id,
    };

    try {
      await getMissionsRecords(params);
      refresh && missionsStore.load(); // 任务列表
    } catch (error) {
      console.log('error: ', error);
    }
  };

  setMatchInfo();
}
