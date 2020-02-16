FROM node:10-alpine

RUN mkdir -p /geolocalization_service/app/node_modules && chown -R node:node /geolocalization_service/app

WORKDIR /geolocalization_service/app

COPY package.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8765

CMD [ "node", "src/app.js" ]
