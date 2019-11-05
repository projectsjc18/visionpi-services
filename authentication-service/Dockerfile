FROM node:10-alpine

RUN mkdir -p /home/authentication_service/app/node_modules && chown -R node:node /home/authentication_service/app

WORKDIR /home/authentication_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 9876

CMD [ "node", "src/app.js" ]
