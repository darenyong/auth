FROM node:carbon-alpine as node-base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

FROM node-base as src-base

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
