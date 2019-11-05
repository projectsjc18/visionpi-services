FROM node:10-alpine

RUN mkdir -p /home/users_service/app/node_modules && chown -R node:node /home/users_service/app

WORKDIR /home/users_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 4321

CMD [ "node", "src/app.js" ]
