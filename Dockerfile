FROM node:14-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:14-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
CMD ["yarn", "run", "start:prod"]