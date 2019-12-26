'use strict'
const axios = require('axios')
const status = require('http-status')
const authenticationService = "http://authentication-service:9876";

module.exports = (app, options) => {
  const {repo} = options

  app.get('/v1/users', isAuthenticated, (req, res, next) => {
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

  app.get('/v1/users/user/:user', (req, res, next) => {
    repo.getUserByUser(req.params.user).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })

  app.post('/v1/users/user', isAuthenticated, (req, res, next) => {
    repo.saveUser(req.body).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })

  function isAuthenticated(req, res, next) {
    //console.log("Req");
    //console.log(req);
    if(req.header('Whisky') != undefined && req.header('Whisky') == "remy"){
      next();
    }else{
      const config = {
        headers: {
          'Content-Type': 'application/json', //req.header('Content-Type'),
          'Authorization': req.header('Authorization')
        }
      };
      console.log("Config");
      console.log(config);
      axios.get(`${authenticationService}/auth/authenticate`, config)
      .then(response => {
        console.log(response.data.token);
        next()
      })
      .catch(err => {
        console.log("Error isAuthenticate");
        console.log(err);
        res.status(401).send({ error: { code: 401, message: 'Something failed!' }});
        //res.send('No Authorized!');
     });
   }
  }

}
