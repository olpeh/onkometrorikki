FROM mhart/alpine-node:8
WORKDIR /usr/src
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build && mv build /public
