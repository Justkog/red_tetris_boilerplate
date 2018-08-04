FROM node:8.9-alpine
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
ENV NODE_ENV production
ENV PATH="../node_modules/.bin:${PATH}"
COPY . .
EXPOSE 3004
# CMD npm start
CMD npm run client-dist && npm run srv-dist && DEBUG=tetris:* node dist/server/main.js