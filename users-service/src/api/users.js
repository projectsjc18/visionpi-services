'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  app.get('/v1/users', (req, res, next) => {
    repo.getAllUsers().then(users => {
      res.status(status.OK).json(users)
    }).catch(next)
  })

  // app.get('/users/privileges', (req, res, next) => {
  //   repo.getUsersPrivileges().then(users => {
  //     res.status(status.OK).json(users)
  //   }).catch(next)
  // })

  app.get('/v1/users/:id', (req, res, next) => {
    repo.getUserById(req.params.id).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })

  app.post('/v1/users', (req, res, next) => {
    repo.saveUser(req.body).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })
}
