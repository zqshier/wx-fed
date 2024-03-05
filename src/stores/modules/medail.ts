import { medalsList } from '@/api/medal';
import { FedorderType, IMedalsDetail, IMedalsList } from '@/dto/medail';
import { reverse, sortBy } from 'lodash';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useMedailStore = defineStore('medail-store', () => {
  const listInfo = ref<IMedalsList>();
  const selectedInfo = ref<IMedalsDetail>();

  const load = async () => {
    const result = await medalsList();
    console.log('result: ', result);

    // result.settings.fedorder = 'create';
    // result = {
    //   list: [
    //     {
    //       group: 'signin',
    //       subgroup: '',
    //       level: 1,
    //       topic: '连续签到',
    //       name: '“火”星友人',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/7ca93bd1650c4d1894038c3bae9deafd.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/3ba810c5de9a41da91f00bdb27a5ca78.png',
    //       description: '连续签到1天',
    //       greetings: '感谢您每日的陪伴，\nZIPPO期待与你共度更多朝夕',
    //       sort: 10,
    //       disabled: false,
    //       medalId: 1,
    //       ratio: '0.0003',
    //       createdAt: '2024-01-29T03:53:00.290Z',
    //       selected: false,
    //       progress: [1, 1],
    //     },
    //     {
    //       group: 'signin',
    //       subgroup: '',
    //       level: 2,
    //       topic: '连续签到',
    //       name: '“火”星使者',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/b2646603746d4842b65b71c926d8996d.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/0ed79403cd2a41d4bd35629a9f7bc20b.png',
    //       description: '连续签到3天',
    //       greetings: '感谢您每日的陪伴,ZIPPO期待与你共度更多朝夕',
    //       sort: 10,
    //       disabled: false,
    //       medalId: 2,
    //       ratio: '0.0000',
    //       progress: [1, 3],
    //     },
    //     {
    //       group: 'goodsshare',
    //       subgroup: '',
    //       level: 1,
    //       topic: '商品分享',
    //       name: '宣传小能手',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/c5283fe991b84a5a87bea6dae179d1b1.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/b1a6543f959a4c08abaf2869678bd7fc.png',
    //       description: '分享商品分享商品分享商品分享商品分享商品',
    //       greetings: '感谢您的分享，让ZIPPO灵感美学感染更多的人',
    //       sort: 2,
    //       disabled: false,
    //       medalId: 3,
    //       ratio: '0.0000',
    //       progress: [0, 1],
    //     },
    //     {
    //       group: 'goodsshare',
    //       subgroup: '',
    //       level: 2,
    //       topic: '商品分享',
    //       name: '品牌宣传官',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/1c41e497b94d4c9fa7f7d62198133f65.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/54661f751f0949f09205cb788cf6c359.png',
    //       description: '分享商品分享商品分享商品分享商品分享商品',
    //       greetings: '感谢您的分享，让ZIPPO灵感美学感染更多的人',
    //       sort: 2,
    //       disabled: false,
    //       medalId: 40,
    //       ratio: '0.0000',
    //       progress: [0, 30],
    //       selected: false,
    //       createdAt: '2024-01-29T03:50:00.290Z',
    //     },
    //     {
    //       group: 'goodsshare',
    //       subgroup: '',
    //       level: 3,
    //       topic: '商品分享',
    //       name: '品牌合“火”人',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/9499a4b7b3474db4ba081132d0d84120.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/830e4d162c5e4fc4ab17b68160feefa4.png',
    //       description: '分享商品分享商品分享商品分享商品分享商品',
    //       greetings: '感谢您的分享，让ZIPPO灵感美学感染更多的人',
    //       sort: 2,
    //       disabled: false,
    //       medalId: 5,
    //       ratio: '0.0000',
    //       progress: [0, 50],
    //       selected: false,
    //       createdAt: '2024-01-29T03:50:00.290Z',
    //     },
    //     {
    //       group: 'invitemember',
    //       subgroup: '',
    //       level: 1,
    //       topic: '邀请好友',
    //       name: 'ZIPPO居住证',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/10d7f2d22d304049893dcf93c27b7293.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/892ad053014c49a9811caa4fcd659ac6.png',
    //       description: '邀请好友成为ZIPPO火伴',
    //       greetings: '感谢您的分享与邀请，让ZIPPO"火"伴家\n族不断壮大',
    //       sort: 1,
    //       disabled: false,
    //       medalId: 6,
    //       ratio: '0.0000',
    //       progress: [1, 1],
    //     },
    //     {
    //       group: 'pointorder',
    //       subgroup: '',
    //       level: 1,
    //       topic: '积分兑换',
    //       name: '火星使者',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/91902792f38147cdb3ee2f233908d648.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/bbe97fc5ce504cef85819aac4869aa29.png',
    //       description: '兑换积分商品',
    //       greetings: '感谢您的支持，ZIPPO力图给每一位“火”伴更多优选回馈',
    //       sort: 0,
    //       disabled: false,
    //       medalId: 7,
    //       ratio: '0.0000',
    //       progress: [0, 1],
    //     },
    //     {
    //       group: 'goodsrate',
    //       subgroup: '',
    //       level: 1,
    //       topic: '商品评分',
    //       name: '炽热点评者',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/49fd525dc3f3404cac15e156d7565ff6.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/a065cb44f4874ee699ceffa5678b376f.png',
    //       description: '商品评分',
    //       greetings: '感谢您的评分反馈',
    //       sort: 10,
    //       disabled: false,
    //       medalId: 8,
    //       ratio: '0.0001',
    //       progress: [0, 5],
    //     },
    //     {
    //       group: 'scancode',
    //       subgroup: '',
    //       level: 1,
    //       topic: '扫码验真',
    //       name: '尊享火焰',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/af70917719b44c11b8bd39cd0a90fc50.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/2c80640b54f0459689036fdb6ce70787.png',
    //       description: '扫码验真',
    //       greetings: '感谢您对品牌设计师与工匠心血的呵护',
    //       sort: 0,
    //       disabled: false,
    //       medalId: 9,
    //       ratio: '0.0000',
    //       progress: [0, 3],
    //     },
    //     {
    //       group: 'annualmember',
    //       subgroup: '2023',
    //       level: 1,
    //       topic: '2023年度挚友',
    //       name: '2023品牌挚友',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/cb4d38ec77ed4c7692efc6a6e08db513.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/aec8df1db2f149968c7a609df022973e.png',
    //       description: '年度挚友',
    //       greetings: '感谢您对ZIPPO品牌一路以来的支持！',
    //       sort: -8,
    //       disabled: false,
    //       medalId: 11,
    //       ratio: '0.0000',
    //     },
    //     {
    //       group: 'goodskindorder',
    //       subgroup: '4',
    //       level: 1,
    //       topic: '下单火机产品',
    //       name: '浪漫初遇',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/039a7216dc654ef5817d80e997158dfe.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/fbd91efa8aa44710a0cdd31aee4c81f3.png',
    //       description: '商品下单',
    //       greetings: '感谢与您的每一段相遇，ZIPPO伴你一路同行',
    //       sort: 0,
    //       disabled: false,
    //       medalId: 12,
    //       ratio: '0.0000',
    //       progress: [0, 1],
    //     },
    //     {
    //       group: 'goodskindorder',
    //       subgroup: '4',
    //       level: 2,
    //       topic: '下单火机产品',
    //       name: '真爱伙伴',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/a2d8ec06a70f42c8a0aa1a68da4c404e.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/0c2bc0c51c8846988b75ab1381a1b02b.png',
    //       description: '商品下单',
    //       greetings: '感谢与您的每一段相遇，ZIPPO伴你一路同行',
    //       sort: 0,
    //       disabled: false,
    //       medalId: 13,
    //       ratio: '0.0000',
    //       progress: [0, 10],
    //     },
    //     {
    //       group: 'goodskindorder',
    //       subgroup: '4',
    //       level: 3,
    //       topic: '下单火机产品',
    //       name: '挚爱伴侣',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/a43cd6866b684db99ed16a6cd11a0f00.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/a28061df936f424d8fa2971ad2458207.png',
    //       description: '商品下单',
    //       greetings: '感谢与您的每一段相遇，ZIPPO伴你一路同行',
    //       sort: 0,
    //       disabled: false,
    //       medalId: 14,
    //       ratio: '0.0000',
    //       progress: [0, 11],
    //     },
    //     {
    //       group: 'goodskindorder',
    //       subgroup: '3',
    //       level: 1,
    //       topic: '下单户外商品',
    //       name: '“野”心萌新',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/5ae607ab07814c46bec45cb333dc4a84.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/52d6699be232457bacc75e632160aa42.png',
    //       description: '下单户外商品',
    //       greetings: '感谢与您的每一段旅程，ZIPPO伴你探索世界',
    //       sort: 1,
    //       disabled: false,
    //       medalId: 15,
    //       ratio: '0.0000',
    //       progress: [0, 1],
    //     },
    //     {
    //       group: 'goodskindorder',
    //       subgroup: '3',
    //       level: 2,
    //       topic: '下单户外商品',
    //       name: '“野”心探险家',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/2faed041597a4dde8af900da8b5b16b9.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/386fc05e6b2c43d5ad8d19ee59982588.png',
    //       description: '下单户外商品',
    //       greetings: '感谢与您的每一段旅程，ZIPPO伴你探索世界',
    //       sort: 1,
    //       disabled: false,
    //       medalId: 16,
    //       ratio: '0.0000',
    //       progress: [0, 5],
    //     },
    //     {
    //       group: 'goodsfavorite',
    //       subgroup: '',
    //       level: 1,
    //       topic: '商品收藏',
    //       name: '初阶收藏家',
    //       image1: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/bd85970a95bf467d8207f5229bf66eb4.png',
    //       image2: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/6ac32319a8a94abdb48cfc46c1a552c5.png',
    //       description: '商品收藏',
    //       greetings: '感谢您的青睐，ZIPPO将以更多样精美的设计契合您的不俗品味',
    //       sort: 0,
    //       disabled: false,
    //       medalId: 18,
    //       ratio: '0.0001',
    //       progress: [0, 1],
    //     },
    //   ],
    //   settings: {
    //     fedorder: 'create',
    //     rulesimages: [
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/c04a78c5e06e4bf28e3a5ba267ba716a.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/3279092c407f48b6880d441997cefea0.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/8c9a177a2ee44229b1ce295f116882b1.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/3380daed5a60424996153cddc266f214.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/11dc2cf9eb814abeacd50b7ee4c24e83.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/bd0586662bd0402a9cbc103318e84293.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/b0ad58d251d140c49eebd3ca69c55a89.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/102df0d457164e048a119a6113c1a430.png',
    //       'https://res.dev.center.ugrow.cn/app-zippo/2024/01/b745cb234f0b4ab39bcc871b01eaf809.png',
    //     ],
    //   },
    // };

    listInfo.value = result;
    // 排序
    sortedMedals();
    // 佩戴的勋章
    findSelected(result.list);
  };

  const findSelected = array => {
    const wearingMedals = array.find(item => item && item.selected);
    if (wearingMedals) return (selectedInfo.value = wearingMedals);

    // 未佩戴时自动展示获取时间最早的，同一时间点获得，佩戴id较小
    const minDate = array
      .filter(item => item && item.createdAt) // 过滤掉时间为 null 的元素
      .sort((a, b) => {
        return a.createdAt === b.createdAt
          ? a.medalId - b.medalId
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    // console.log('minDate: ', minDate);

    selectedInfo.value = minDate[0];
  };

  // 按照已获得的勋章展示在前，未获得的勋章展示在后，并根据勋章名称排序
  const sortedMedals = () => {
    let list = listInfo.value?.list || [];

    // 根据后台勋章排序
    if (listInfo.value?.settings.fedorder === FedorderType.sort) {
      // 主题排序
      list = sortBy(list, [o => `${o.group}${o.subgroup}`]);
      list = reverse(sortBy(list, [o => o.sort]));

      // 同主题根据等级正序排序
      list.sort((a, b) => (`${a.group}${a.subgroup}` === `${b.group}${b.subgroup}` ? a.level - b.level : 0));

      // 一行最多展示三个
      // const emptyboxObj = {};
      // let lineNum = 1;
      // const maxLine = 3;
      // list.forEach((item, index) => {
      //   if (index + 1 > list.length - 1) return;
      //   const cGroup = item.group;
      //   if (cGroup === list[index + 1].group) {
      //     lineNum++;
      //   } else {
      //     if (lineNum % maxLine) {
      //       // 用空对象占位
      //       const emptyboxNum = lineNum < maxLine ? maxLine - lineNum : lineNum % maxLine;
      //       const arr: any = [];
      //       for (let i = 0; i < emptyboxNum; i++) {
      //         arr.push({ group: item.group, image1: '', image2: '', medalId: -1, name: '', sort: item.sort });
      //       }
      //       emptyboxObj[index] = arr;
      //     }
      //     lineNum = 1;
      //   }
      // });

      // console.debug('emptyboxObj', emptyboxObj);
      // 添加占位对象
      // for (const key in emptyboxObj) {
      //   if (Object.prototype.hasOwnProperty.call(emptyboxObj, key)) {
      //     const item = emptyboxObj[key];
      //     list.splice(key + 1, 0, ...item);
      //   }
      // }

      // console.debug('list', list);
    }

    // 根据小程序排序
    if (listInfo.value?.settings.fedorder === FedorderType.create) {
      list.sort((a, b) => {
        // 获得勋章
        const aCreatedAt = (a.createdAt && new Date(a.createdAt).getTime()) || 9999999999999;
        const bCreatedAt = (b.createdAt && new Date(b.createdAt).getTime()) || 9999999999999;
        return aCreatedAt - bCreatedAt;
      });

      // 勋章名称首字母排序 升序
      list.sort((a, b) => {
        let aNamePinyin = (a.namePinyin && a.namePinyin.charAt(0).toLowerCase()) || '';
        let bNamePinyin = (b.namePinyin && b.namePinyin.charAt(0).toLowerCase()) || '';

        // 已点亮权重高 namePinyin为空（权重b） 有值（权重a）
        if (b.createdAt) bNamePinyin = `${b.namePinyin !== '' ? 'a' : 'b'}${bNamePinyin}`;
        if (a.createdAt) aNamePinyin = `${a.namePinyin !== '' ? 'a' : 'b'}${aNamePinyin}`;

        // 未点亮权重低 namePinyin为空（权重d） 有值（权重c）
        if (!b.createdAt) bNamePinyin = `${b.namePinyin !== '' ? 'c' : 'd'}${bNamePinyin}`;
        if (!a.createdAt) aNamePinyin = `${a.namePinyin !== '' ? 'c' : 'd'}${aNamePinyin}`;

        // console.debug('aNamePinyin', a.name, aNamePinyin);
        // console.debug('bNamePinyin', b.name, bNamePinyin);
        return aNamePinyin < bNamePinyin ? -1 : 1;
      });
    }

    // list.sort((a, b) => {
    //   // 根据已获得勋章排序
    //   if (listInfo.value?.settings.fedorder === FedorderType.create) {
    //     if (a.createdAt && !b.createdAt) {
    //       return -1;
    //     } else if (!a.createdAt && b.createdAt) {
    //       return 1;
    //     } else if (a.createdAt && b.createdAt) {
    //       // 如果都已获得，则按照已获得时间排序
    //       return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    //     }
    //   } else {
    //     return a.group !== b.group ? b.sort - a.sort : a.level - b.level;
    //   }
    // });

    return list;
  };

  // 将数据分成每9个一组
  const medalGroups = computed(() => {
    const groups: any = [];
    const sortedMedalsVal: any = sortedMedals();

    for (let i = 0; i < sortedMedalsVal.length; i += 9) {
      const data = sortedMedalsVal.slice(i, i + 9);
      groups.push(data);
    }
    return groups;
  });

  return { listInfo, selectedInfo, medalGroups, load };
});
