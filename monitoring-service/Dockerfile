FROM node:10-alpine

RUN mkdir -p /home/monitoring_service/app/node_modules && chown -R node:node /home/monitoring_service/app

WORKDIR /home/monitoring_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 6543

CMD [ "node", "src/app.js" ]
