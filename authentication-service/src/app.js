var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
var User = require('./models/user');
var Client = require('./models/Client');
const OAuth2Server = require('oauth2-server');
const AccessDeniedError = require('oauth2-server/lib/errors/access-denied-error');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const db = require('./config/db');

var app = express();

// connect to database
// mongoose.connect(`${config.dbInfo.uri}${config.dbInfo.name}`, { useNewUrlParser: true })

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const oauth = new OAuth2Server({
  model: require('./models/model.js'), // See below for specification
  grants: ['password'],
  allowBearerTokensInQueryString: true,
  accessTokenLifetime: 60 * 60 * 4,
});
// When a user requested an oauth token
app.post('/auth/access_token', function (req, res, next) {
  let options = {
    // ...
    // Allow token requests using the password grant to not include a client_secret.
    //requireClientAuthentication: {password: false}
    grant_type: ['password']
  };
  let request = new Request(req);
  let response = new Response(res);
  //console.log(request);
  return oauth.token(request, response, options)
              .then(function(token) {
                console.log("4 OK");
                res.locals.oauth = {token: token};
                res.send({token: token});
                //next();
          })
          .catch(function(err) {
            console.log(err);
            // handle error condition
            res.send('No permitido: Token');
          });

});

// Each get, post, put or delete should have app.oauth.authorise() function to authenticate
app.get('/', function (req, res, next) {
  let options = {};
  let request = new Request(req);
  let response = new Response(res);
  return oauth.authenticate(request, response, options)
    .then(function(token) {
        res.locals.oauth = {token: token};
        res.send('Secret area');
        //next();
    })
    .catch(function(err) {
      // console.log(err);
        // handle error condition
        res.send('No permitido: Authenticate');
    });
  // Your behaviour goes here
  //res.send('Secret area');
});

app.all('/auth/authenticate', function(req, res, next){
    let options = {};
    let request = new Request(req);
    let response = new Response(res);
    console.log('date: ' + new Date())
    return oauth.authenticate(request, response, options)
      .then(function(token) {
        res.locals.oauth = {token: token};
        res.send({token: { active: true, validToken: true, expired: false}});
        //next();
      })
      .catch(function(err) {
        // handle error condition
        // console.log("error")
        // console.log(err)
        res.status(401).send({token: { active: true, validToken: true, expired: true}});
      });
});

app.all('/auth/authorize', function(req, res, next){
    let options = {};
    let request = new Request(req);
    let response = new Response(res);
    return oauth.authorize(request, response, options)
      .then(function(code) {
        res.locals.oauth = {code: code};
        res.send({code: code});
        //next();
      })
      .catch(function(err) {
        // handle error condition
        res.send('No permitido: Authorize');
      });
});

app.post('/auth/users', function(req, res, next){
  // Create a new instance of the Client model
  let newUser = new User();
  let newClient = new Client();
  let user = req.body.data;
  var response = {};
  //console.log(req.body.data);
  newUser.email = user.email;
  newUser.firstname = user.firstName;
  newUser.lastname = user.lastName;
  newUser.password = user.password;
  newUser.username = user.username;
  newClient.clientId = user.clientId;
  newClient.clientSecret = user.clientSecret;
  newClient.grants = user.grants;

  newUser.save(function(err,data){
    if(err){
      console.log("Error auth users: " + err);
      res.send("Error auth users: " + err);
    }else{
      console.log("auth users success");
      response = data;
      //res.send(data);
    }
  });

  newClient.save(function(err,data){
    if(err){
      console.log("Error auth clients: " + err);
      res.send("Error auth clients: " + err);
    }else{
      console.log("auth clients success");
      res.send(response);
    }
  })

});

//app.use(app.oauth.errorHandler());

app.listen(9876, function () {
  console.log('Example app listening on port XXXX!');
});
