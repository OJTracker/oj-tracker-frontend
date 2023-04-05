FROM node:18.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

EXPOSE 3000

CMD ["CHMOD" "777" "node_modules"]

CMD ["yarn", "start"]