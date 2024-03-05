import { TARGET_PHOME_AUTH, TARGET_PHOME_AUTH_CALLBACK } from '@/constants';
import { authFlow } from '@/utils';
import { eventCenter } from '@tarojs/taro';
import { ref } from 'vue';

export default function useLoginPop() {
  const visible = ref(false);
  const target = ref(''); // 触发目标
  const openPopup = () => (visible.value = true);
  const closePopup = () => (visible.value = false);

  /**
   * 监听注册事件
   */
  const onRegisterEvent = () => {
    eventCenter.on(TARGET_PHOME_AUTH, arg => {
      target.value = decodeURIComponent(arg);
      visible.value = true;
    });
  };

  /**
   * 取消监听注册
   */
  const offRegisterEvent = () => {
    eventCenter.off(TARGET_PHOME_AUTH);
  };

  /**
   * 校验vip
   */

  const checkMemberLevel = (target: string, callback?: any) => {
    const flag = authFlow({ target });

    if (callback) {
      eventCenter.off(TARGET_PHOME_AUTH_CALLBACK);
      eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
        if (target === decodeURIComponent(arg)) callback();
      });
    }

    if (!flag) throw new Error('当前不是会员，请注册');
  };

  return {
    visible,
    target,
    openPopup,
    closePopup,
    onRegisterEvent,
    offRegisterEvent,
    checkMemberLevel,
  };
}
