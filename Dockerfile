FROM node:18.0-alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn

COPY . /app/

EXPOSE 3000

CMD ["yarn", "start"]
