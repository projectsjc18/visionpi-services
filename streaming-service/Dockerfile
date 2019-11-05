FROM node:10-alpine

RUN mkdir -p /home/streaming_service/app/node_modules && chown -R node:node /home/streaming_service/app

WORKDIR /home/streaming_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 5678

CMD [ "node", "src/app.js" ]
