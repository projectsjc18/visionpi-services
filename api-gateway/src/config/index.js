const {dockerSettings, serverSettings, services} = require('./config')
const {initDI} = require('./di')
const init = initDI.bind(null, {serverSettings, dockerSettings, services})

module.exports = Object.assign({}, {init})
