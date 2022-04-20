FROM node:17-alpine

WORKDIR /src/

COPY package.json package-lock.json /src/

RUN  npm ci --silent

COPY . /src

CMD npm run start