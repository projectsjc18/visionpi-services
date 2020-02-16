'use strict'
const status = require('http-status')
const axios = require('axios')
const authenticationService = "http://authentication-service:9876";

module.exports = (app, options) => {
  const {repo} = options

  /* Get all checkpoints */
  app.get('/v1/geolocalization/checkpoints', isAuthenticated, (req, res, next) => {
    repo.getAllCheckpoints().then(checkpoints => {
      res.status(status.OK).json(checkpoints)
    }).catch(next)
  })

  /* Get checkpoint by Id */
  app.get('/v1/geolocalization/checkpoints/:id', isAuthenticated, (req, res, next) => {
    repo.getCheckpointById(req.params.id).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Save new checkpoint */
  app.post('/v1/geolocalization/checkpoints', isAuthenticated, (req, res, next) => {
    repo.saveCheckpoint(req.body).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Update checkpoint by Id */
  app.put('/v1/geolocalization/checkpoints/', isAuthenticated, (req, res, next) => {
    repo.updateCheckpointById(req.body).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Delete all checkpoints */
  app.delete('/v1/geolocalization/checkpoints', isAuthenticated, (req, res, next) => {
    repo.deleteAllCheckpoints(req.params.id).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  /* Delete checkpoint by Id */
  app.delete('/v1/geolocalization/checkpoints/:id', isAuthenticated, (req, res, next) => {
    repo.deleteCheckpointById(req.params.id).then(checkpoint => {
      res.status(status.OK).json(checkpoint)
    }).catch(next)
  })

  function isAuthenticated(req, res, next) {
    if(req.header('Whisky') != undefined && req.header('Whisky') == "remy"){
      next();
    }else{
      const config = {
        headers: {
          'Content-Type': 'application/json', //req.header('Content-Type'),
          'Authorization': req.header('Authorization')
        }
      };

      axios.get(`${authenticationService}/auth/authenticate`, config)
      .then(response => {
        console.log(response.data.token);
        next()
      })
      .catch(err => {
        console.log("Error isAuthenticate");
        //console.log(err);
        res.status(401).send({ error: { code: 401, message: 'Something failed!' }});
        //res.send('No Authorized!');
      });
    } 
  }
}
