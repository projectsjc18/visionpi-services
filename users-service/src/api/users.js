'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  app.get('/v1/users', (req, res, next) => {
    repo.getAllUsers().then(users => {
      res.status(status.OK).json(users)
    }).catch(next)
  })

  app.get('/v1/users/:id', (req, res, next) => {
    repo.getUserById(req.params.id).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })

  app.get('/v1/users/user/:user', (req, res, next) => {
    repo.getUserByUser(req.params.user).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })

  app.get('/v1/users/account/:account', (req, res, next) => {
    repo.getUserByUserAccount(req.params.account).then(useraccount => {
      console.log("useraccount: ------");
      console.log(useraccount);
      res.status(status.OK).json(useraccount)
    }).catch(next)
  })

  app.post('/v1/users', (req, res, next) => {
    repo.saveUser(req.body).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })
}
