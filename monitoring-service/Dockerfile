FROM node:10-alpine

RUN mkdir -p /monitoring_service/app/node_modules && chown -R node:node /monitoring_service/app

WORKDIR /monitoring_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 6543

CMD [ "node", "src/app.js" ]
