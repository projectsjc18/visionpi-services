FROM node:10-alpine

RUN mkdir -p /home/api_gateway/app/node_modules && chown -R node:node /home/api_gateway/app

WORKDIR /home/api_gateway/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "src/app.js" ]
