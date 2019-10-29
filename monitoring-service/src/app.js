'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const config = require('./config/')
const mediator = new EventEmitter()

console.log('--- Monitoring Service ---')
console.log('Connecting to users repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('db.ready', (db) => {
  //console.log("Db Ready ");
  //console.log(db);
  let rep
  repository.connect(db, config.dbSettings)
    .then(repo => {
      console.log('Connected. Starting Server')
      rep = repo
      return server.start({
        port: config.serverSettings.port,
        ssl: config.serverSettings.ssl,
        repo
      })
    })
    .then(app => {
      console.log(`Server started succesfully, running on port: ${config.serverSettings.port}.`)
      app.on('close', () => {
        rep.disconnect()
      })
    })
})

mediator.on('db.error', (err) => {
  console.error(err)
})

config.db.connect({dbSettings: config.dbSettings, dbOptions:  { useNewUrlParser: true, useUnifiedTopology: true }}, mediator)

mediator.emit('boot.ready')
