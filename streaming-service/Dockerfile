FROM node:10-alpine

RUN mkdir -p /streaming_service/app/node_modules && chown -R node:node /streaming_service/app

WORKDIR /streaming_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 5678

CMD [ "node", "src/app.js" ]
