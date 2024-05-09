# Node.js 이미지를 기반으로 한다.
FROM node:18 AS nest

# 작업 디렉토리 설정
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# Nest 애플리케이션 소스 코드 복사
COPY package.json ./

COPY yarn.lock ./

# Nest 애플리케이션 빌드
RUN yarn install
RUN yarn add nodemon --save-dev
COPY . ./
# Nest 애플리케이션 실행
CMD ["yarn", "start:dev"]
ENTRYPOINT [ "yarn", "start:dev"]

EXPOSE 8080