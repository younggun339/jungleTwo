# Node.js 이미지를 기반으로 한다.
FROM node:18 AS react

# 작업 폴더를 만들고 npm 설치
WORKDIR /
ENV PATH /node_modules/.bin:$PATH
COPY package.json yarn.lock ./
RUN yarn install
#RUN npm install react-scripts@3.4.1 -g --silent

# RUN rm ./node_modules/react-scripts/config/webpackDevServer.config.js 
# # 소스를 작업폴더로 복사하고 빌드
# COPY ./node_modules/react-scripts/config/webpackDevServer.config.js ./node_modules/react-scripts/config/webpackDevServer.config.js

COPY . .
# 개발 서버 실행
CMD ["yarn", "start"]