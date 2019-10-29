const {dbSettings, serverSettings, dbInfo} = require('./config')
const db = require('./mongo')

module.exports = Object.assign({}, {dbSettings, serverSettings, db, dbInfo})
