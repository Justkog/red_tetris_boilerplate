FROM node:8.9-alpine
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
ENV PATH="../node_modules/.bin:${PATH}"
COPY . .
EXPOSE 8080
# CMD npm start
CMD npm run client-dev
# CMD /bin/sh