FROM node:14-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update alpine-sdk && \
    apk add libffi-dev openssl-dev && \
    apk add python-dev python3-dev

RUN yarn install

COPY . .

RUN yarn build

FROM node:14-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
CMD ["yarn", "run", "start:prod"]