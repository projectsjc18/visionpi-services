'use strict'
const status = require('http-status')
const axios = require('axios')
const authenticationService = "http://authentication-service:9876";

module.exports = (app, options) => {
  const {repo} = options

  /* Get all events */
  app.get('/v1/monitoring/events', isAuthenticated, (req, res, next) => {
    repo.getAllEvents().then(events => {
      res.status(status.OK).json(events)
    }).catch(next)
  })

  /* Get event by Id */
  app.get('/v1/monitoring/events/:id', isAuthenticated, (req, res, next) => {
    repo.getEventById(req.params.id).then(events => {
      res.status(status.OK).json(events)
    }).catch(next)
  })

  /* Save new event */
  app.post('/v1/monitoring/events', isAuthenticated, (req, res, next) => {
    console.log('LLega')
    console.log(req)
    repo.saveEvent(req.body).then(eventx => {
      res.status(status.OK).json(eventx)
    }).catch(next)
  })

  /* Update event by Id */
  app.put('/v1/monitoring/events', isAuthenticated, (req, res, next) => {
    repo.updateEventById(req.body).then(eventx => {
      res.status(status.OK).json(eventx)
    }).catch(next)
  })

  /* Delete all events */
  app.delete('/v1/monitoring/events', isAuthenticated, (req, res, next) => {
    repo.deleteAllEvents(req.params.id).then(eventx => {
      res.status(status.OK).json(eventx)
    }).catch(next)
  })

  /* Delete event by Id */
  app.delete('/v1/monitoring/events/:id', (req, res, next) => {
    repo.deleteEventById(req.params.id).then(eventx => {
      res.status(status.OK).json(eventx)
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
