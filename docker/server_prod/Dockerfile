FROM node:8.9-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
ENV PATH="../node_modules/.bin:${PATH}"
COPY . .
EXPOSE 3004
# CMD npm start
CMD npm run srv-dist && npm run client-dist && DEBUG=tetris:* node dist/server/main.js