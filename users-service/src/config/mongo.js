const MongoClient = require('mongodb')

const getMongoURL = (options) => {
  return `mongodb://${options.user}:${options.password}@${options.host}:${options.port_db}/${options.name}?authSource=admin`
}

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    MongoClient.connect(
      getMongoURL(options.dbSettings), options.dbOptions, (err, client) => {
        if (err) {
          mediator.emit('db.error', err)
        }
        const db = client;
        mediator.emit('db.ready', db);
      })
  })
}

module.exports = Object.assign({}, {connect})
