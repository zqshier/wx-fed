import { Toast } from '@/utils';
import Taro from '@tarojs/taro';
import { ref } from 'vue';

export default function savePoster() {
  const postImage = ref('');
  const setVal = url => (postImage.value = url);
  // const saveCallback = (callback: () => void) => callback();
  const onSaveImageCallback = ref<(() => void) | null>(null);

  const SCOPE_WRITE_PHOTOS_ABLUM = 'scope.writePhotosAlbum';

  const handleSavePoster = () => {
    Taro.getSetting({
      success(res) {
        if (res.authSetting[SCOPE_WRITE_PHOTOS_ABLUM]) {
          saveImage();
        } else if (res.authSetting[SCOPE_WRITE_PHOTOS_ABLUM] === undefined) {
          Taro.authorize({
            scope: SCOPE_WRITE_PHOTOS_ABLUM,
            success() {
              saveImage();
            },
            fail() {
              authConfirm();
            },
          });
        } else {
          authConfirm();
        }
      },
    });
  };

  // 授权拒绝后，再次授权提示弹窗
  const authConfirm = () => {
    Taro.showModal({
      content: '检测到您没打开保存图片权限，是否去设置打开？',
      confirmText: '确认',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          Taro.openSetting({
            success(res) {
              if (res.authSetting[SCOPE_WRITE_PHOTOS_ABLUM]) {
                saveImage();
              } else {
                Toast('您没有授权，无法保存到相册');
              }
            },
          });
        } else {
          Toast('您没有授权，无法保存到相册');
        }
      },
    });
  };

  // 长按保存图片
  const saveImage = async (callback = onSaveImageCallback.value) => {
    Taro.saveImageToPhotosAlbum({
      filePath: postImage.value,
      success(res) {
        console.log('saveImg res=', res);
        Toast('保存成功~');
      },
      fail(err) {
        console.log('saveImg err=', err);
        console.log('postImage.value', postImage.value);
        Toast('保存失败~');
      },
      complete() {
        Taro.vibrateShort();
        if (callback) callback();
      },
    });
  };

  return {
    postImage,
    setVal,
    handleSavePoster,
    onSaveImageCallback,
  };
}
