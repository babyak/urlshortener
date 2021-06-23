FROM node:14-alpine

WORKDIR /usr/src/app/backend

COPY package.json package.json

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "run", "start:prod"]
