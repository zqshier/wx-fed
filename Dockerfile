FROM docker.dev.center.ugrow.cn/ug/node-18-alpine
WORKDIR /app
COPY package*.json ./
RUN ["npm", "install", "--registry", "https://registry.npmmirror.com/", "--prefer-offline"]
RUN ["npm", "install", "--registry", "https://registry.npmmirror.com/", "miniprogram-ci"]
