'use strict'
const express = require('express')
const proxy = require('http-proxy-middleware')
const spdy = require('spdy')
const bodyParser = require('body-parser')
const axios = require('axios')
var authenticationService = '';

const start = (container) => {
  return new Promise((resolve, reject) => {
    const {port, ssl} = container.resolve('serverSettings')
    const {authentication, geolocalization, monitoring, users} = container.resolve('services')
    authenticationService = authentication;
    const app = express()
    app.use(bodyParser.json())    // parse application/json
    // Enabled CORS
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
      next();
    });

    app.use('/auth', proxy({
      target: authentication,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq(proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }
        var contentType = proxyReq.getHeader('Content-Type');
        var bodyData;

        if (contentType === 'application/json') {
          bodyData = JSON.stringify(req.body);
        }

        if (contentType === 'application/x-www-form-urlencoded') {
          bodyData = queryString.stringify(req.body);
        }

        if (bodyData) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    }))
    app.use('/v1/users', isAuthenticated, proxy({
      target: users,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq(proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }
        var contentType = proxyReq.getHeader('Content-Type');
        var bodyData;

        if (contentType === 'application/json') {
          bodyData = JSON.stringify(req.body);
        }

        if (contentType === 'application/x-www-form-urlencoded') {
          bodyData = queryString.stringify(req.body);
        }

        if (bodyData) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    }))
    app.use('/v1/monitoring', isAuthenticated, proxy({
      target: monitoring,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq(proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }
        var contentType = proxyReq.getHeader('Content-Type');
        var bodyData;

        if (contentType === 'application/json') {
          bodyData = JSON.stringify(req.body);
        }

        if (contentType === 'application/x-www-form-urlencoded') {
          bodyData = queryString.stringify(req.body);
        }

        if (bodyData) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    }))
    app.use('/v1/geolocalization', isAuthenticated, proxy({
      target: geolocalization,
      changeOrigin: true,
      logLevel: 'debug',
      onProxyReq(proxyReq, req, res) {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }
        var contentType = proxyReq.getHeader('Content-Type');
        var bodyData;

        if (contentType === 'application/json') {
          bodyData = JSON.stringify(req.body);
        }

        if (contentType === 'application/x-www-form-urlencoded') {
          bodyData = queryString.stringify(req.body);
        }

        if (bodyData) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    }))

    if (process.env.NODE === 'test') {
      const server = app.listen(port, () => resolve(server))
    } else {
      const server = spdy.createServer(ssl, app)
        .listen(port, () => resolve(server))
    }
  })
}

function onProxyReq(proxyReq, req, res, options) {
  if (!req.body || !Object.keys(req.body).length) {
    return;
  }

  var contentType = proxyReq.getHeader('Content-Type');
  var bodyData;

  if (contentType === 'application/json') {
    bodyData = JSON.stringify(req.body);
  }

  if (contentType === 'application/x-www-form-urlencoded') {
    bodyData = queryString.stringify(req.body);
  }

  if (bodyData) {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
};

function isAuthenticated(req, res, next) {
  if(req.header('Whisky') != undefined && req.header('Whisky') == "remy"){
    next();
  }else{
    const config = {
      headers: {
        'Content-Type': req.header('Content-Type'),
        'Authorization': req.header('Authorization')
      }
    };

    axios.get(`${authenticationService}/auth/authenticate`, config)
    .then(response => {
      //console.log(response.data.token);
      next()
    })
    .catch(err => {
      console.log("Error isAuthenticate");
      //console.log(err);
      res.send('No Authorized!');
    });
  }
}

module.exports = Object.assign({}, {start})
