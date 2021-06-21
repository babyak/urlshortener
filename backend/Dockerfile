FROM node:14-alpine

WORKDIR /usr/src/app/backend

COPY package.json package.json

COPY . .

RUN yarn install
RUN yarn build

CMD ["yarn", "run", "start:prod"]