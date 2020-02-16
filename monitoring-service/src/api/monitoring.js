'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  /* Get all events */
  app.get('/v1/monitoring/events', (req, res, next) => {
    repo.getAllEvents().then(events => {
      res.status(status.OK).json(events)
    }).catch(next)
  })

  /* Get event by Id */
  app.get('/v1/monitoring/events/:id', (req, res, next) => {
    repo.getEventById(req.params.id).then(events => {
      res.status(status.OK).json(events)
    }).catch(next)
  })

  /* Save new event */
  app.post('/v1/monitoring/events', (req, res, next) => {
    console.log('LLega')
    console.log(req)
    repo.saveEvent(req.body).then(eventx => {
      res.status(status.OK).json(eventx)
    }).catch(next)
  })

  /* Update event by Id */
  app.put('/v1/monitoring/events', (req, res, next) => {
    repo.updateEventById(req.body).then(eventx => {
      res.status(status.OK).json(eventx)
    }).catch(next)
  })

  /* Delete all events */
  app.delete('/v1/monitoring/events', (req, res, next) => {
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
}
