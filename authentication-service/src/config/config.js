const dbSettings = {
  //db: process.env.DB || 'users',
  user: process.env.DB_USER || 'visionpi',
  password: process.env.DB_PASS || 'visionpiServices2019',
  replicaSet: process.env.DB_REPLS || 'rs1',
  /*servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(' ') : [
    '127.0.0.1:27017',
    '127.0.0.1:27017',
    '127.0.0.1:27017'
  ],*/
  //dbParameters: () => ({
    w: 'majority',
    wtimeout: 10000,
    j: true,
    //readPreference: 'ReadPreference.SECONDARY_PREFERRED',
    native_parser: false,
  //}),
  //serverParameters: () => ({
    autoReconnect: true,
    poolSize: 10,
    //socketoptions: {
      //keepAlive: 300,
      //connectTimeoutMS: 30000,
      //socketTimeoutMS: 30000
    //}
  //}),
  //replsetParameters: (replset = 'rs1') => ({
    //replicaSet: 'rs1', //replset,
    ha: true,
    haInterval: 10000,
    //poolSize: 10,
    //socketoptions: {
      //keepAlive: 300,
      //connectTimeoutMS: 30000,
      //socketTimeoutMS: 30000
    //}
     useNewUrlParser: true,
     useUnifiedTopology: true
  }
//}

const serverSettings = {
  port: process.env.PORT || 4000,
  ssl: require('./ssl')
}

const dbInfo = {
  name: process.env.MONGO_NAME || 'visionpi_auth',
  uri: process.env.MONGO_URL || 'mongodb://127.0.0.1/',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(' ') : [
    '127.0.0.1:27017',
    '127.0.0.1:27017',
    '127.0.0.1:27017'
  ]
}

module.exports = Object.assign({}, { dbSettings, serverSettings, dbInfo, services })
