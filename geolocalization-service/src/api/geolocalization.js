'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  /* Get all checkpoints */
  app.get('/v1/geolocalization/checkpoints', (req, res, next) => {
    repo.getAllCheckpoints().then(checkpoints => {
      res.status(status.OK).json(checkpoints)
    }).catch(next)
  })

  /* Get checkpoint by Id */
  app.get('/v1/geolocalization/checkpoints/:route', (req, res, next) => {
    repo.getCheckpointsByRoute(req.params.route).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Get all accounts */
  app.get('/v1/geolocalization/accounts', (req, res, next) => {
    repo.getAccounts().then(accounts => {
      res.status(status.OK).json(accounts)
    }).catch(next)
  })

  /* Get all accounts */
  app.get('/v1/geolocalization/accounts/details', (req, res, next) => {
    repo.getAccountsDetails().then(accounts => {
      res.status(status.OK).json(accounts)
    }).catch(next)
  })

  /* Save new account */
  app.post('/v1/geolocalization/accounts', (req, res, next) => {
    repo.saveAccount(req.body).then(account => {
      res.status(status.OK).json(account)
    }).catch(next)
  })

  /* Save new checkpoint */
  app.post('/v1/geolocalization/checkpoints', (req, res, next) => {
    repo.saveCheckpoint(req.body).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Update checkpoint by Id */
  app.put('/v1/geolocalization/checkpoints/', (req, res, next) => {
    repo.updateCheckpointById(req.body).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Delete all checkpoints */
  app.delete('/v1/geolocalization/checkpoints', (req, res, next) => {
    repo.deleteAllCheckpoints(req.params.id).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Delete checkpoint by Id */
  app.delete('/v1/geolocalization/checkpoints/:id', (req, res, next) => {
    repo.deleteCheckpointById(req.params.id).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })
}
