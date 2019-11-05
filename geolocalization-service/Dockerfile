FROM node:10-alpine

RUN mkdir -p /home/geolocalization_service/app/node_modules && chown -R node:node /home/geolocalization_service/app

WORKDIR /home/geolocalization_service/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8765

CMD [ "node", "src/app.js" ]
