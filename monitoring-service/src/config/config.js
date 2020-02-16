console.log("Loading settings monitoring");
const dbSettings = {
  user: process.env.MONGO_USERNAME || 'visionpi',
  password: process.env.MONGO_PASSWORD || 'visionpiDev2019',
  name: process.env.MONGO_DB || 'visionpiMonitoringDB',
  host: process.env.MONGO_HOSTNAME || 'localhost',
  port_db: process.env.MONGO_PORT || '27017',
  useNewUrlParser: true,
  collection: 'events',
  authentication: process.env.AUTHENTICATION_SERVICE || "localhost"
}

const serverSettings = {
  port: process.env.SERVICE_PORT || 4040,
  ssl: require('./ssl')
}

module.exports = Object.assign({}, { dbSettings, serverSettings })
