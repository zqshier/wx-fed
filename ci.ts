import ci = require('miniprogram-ci');
import { format } from 'date-fns';
import { resolve } from 'path';

const branches = {
  develop: 2,
  test: 3,
  master: 4,
  uat: 5,
};

let robot = 1;
if (process.env.DRONE_BRANCH) {
  robot = branches[process.env.DRONE_BRANCH] || 1;
}

const privateKey = process.env.WX_UPLOAD_KEY;
const root = resolve(__dirname, '.');
const project = new ci.Project({
  appid: 'wxaa75ffd8c2d75da7',
  type: 'miniProgram',
  projectPath: resolve(root, './dist'),
  privateKey,
  ignores: ['node_modules/**/*'],
});

let version = format(new Date(), 'yyyy.MM.ddHH');
if (process.env.DRONE_BRANCH === 'master') {
  version = String(process.env.npm_package_version);
}

(async () => {
  const uploadResult = await ci.upload({
    project,
    version,
    desc: `自动构建[${process.env.DRONE_BRANCH}]`,
    setting: {
      es6: false,
      minify: true,
    },
    robot,
    onProgressUpdate: console.log,
  });
  console.log(uploadResult);
})();

(async () => {
  const previewResult = await ci.preview({
    project,
    version,
    desc: `自动预览[${process.env.DRONE_BRANCH}]`,
    setting: {
      es6: false,
      minify: true,
    },
    robot,
    qrcodeFormat: 'image',
    qrcodeOutputDest: resolve(root, 'preview.jpg'),
    onProgressUpdate: console.log,
    // pagePath: 'pages/index/index', // 预览页面
    // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
  });
  console.log(previewResult);
})();
