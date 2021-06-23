FROM node:14-alpine as builder

WORKDIR /usr/src/app/frontend

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json package.json
# COPY package-lock.json ./
RUN yarn install

# add app
COPY . .

# start app
RUN ["yarn", "run", "build"]

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from builder
COPY --from=builder /usr/src/app/frontend/build /usr/share/nginx/html/public

EXPOSE 8088

ENTRYPOINT ["nginx", "-g", "daemon off;"]
