FROM node:10-alpine

RUN mkdir -p /users_service/app/node_modules && chown -R node:node /users_service/app

WORKDIR /users_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 4321

CMD [ "node", "src/app.js" ]
