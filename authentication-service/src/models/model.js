/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const OAuthUsersModel = require('./user');
const OAuthClientsModel = require('./Client');

/**
 * Schema definitions.
 */
mongoose.model('OAuthTokens', new Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date, default: getDate() },
  client : { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date, default: getDate() },
  user : { type: Object },
  userId: { type: String },
}));

mongoose.model('OAuthCodes', new Schema({
  authorizationCode: { type: Date },
  expiresAt: { type: Date },
  redirectUri: { type: String },
  scope: { type: Object },
  clientId: { type: String },
  userId: { type: String }
}));

var OAuthTokensModel = mongoose.model('OAuthTokens');
var OAuthCodesModel = mongoose.model('OAuthCodes');


function getDate(){
  var fecha = new Date();
  var addTime = 1 * 3600; //900 15min; //86400 24h; //Tiempo en segundos
  fecha.setSeconds(addTime);
  var finalDate = new Date(fecha);
  console.log('getDate: ' + finalDate);
  return fecha.setSeconds(addTime); //Añado el tiempo
}

/**
 * Get access token.
 */
 module.exports.getAccessToken = function(bearerToken) {
  console.log('1 getAccessToken ' + bearerToken);
  // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
  return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
};

/**
 * Get Authorization Code
 */
module.exports.getAuthorizationCode = function(authorizationCode) {
  return OAuthCodesModel.findOne({authorizationCode: authorizationCode}).lean();
}

/**
 * Get client.
 */

module.exports.getClient = function(clientId, clientSecret) {
  console.log('1 getClient: ' + clientId + ' - ' + clientSecret);
  return OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }).lean();
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function(refreshToken) {
  return OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
};


/**
 * Get user.
 */

module.exports.getUser = function(username, password) {
  console.log('2 getUser: ' + username + ' - ' + password);
  return OAuthUsersModel.findOne({ username: username, password: password }).lean();
};

/**
 * Save token.
 */
module.exports.saveToken = function(token, client, user) {
  console.log('3 saveToken: ' + token );
  var accessToken = new OAuthTokensModel({
    accessToken: token.accessToken,
    accessTokenExpiresOn: token.accessTokenExpiresOn,
    client : client,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresOn: token.refreshTokenExpiresOn,
    user : user,
    userId: user._id,
  });
  // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
  return new Promise( function(resolve,reject){
    accessToken.save(function(err,data){
      if( err ) reject( err );
      else resolve( data );
    }) ;
  }).then(function(saveResult){
    // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
    saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;

    // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
    var data = new Object();
    for( var prop in saveResult ) data[prop] = saveResult[prop];

    // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
    data.client = data.clientId;
    data.user = data.userId;

    return data;
  });
};

/**
 * Save code.
 */

module.exports.saveAuthorizationCode = function(code, client, user) {
  var authorizationCode = new OAuthCodesModel({
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    clientId: client.id,
    userId: user.id
  });
  // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
  return new Promise( function(resolve,reject){
    authorizationCode.save(function(err,data){
      if( err ) reject( err );
      else resolve( data );
    }) ;
  }).then(function(saveResult){
    // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
    saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;

    // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
    var data = new Object();
    for( var prop in saveResult ) data[prop] = saveResult[prop];

    // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
    //data.client = data.clientId;
    //data.user = data.userId;
    console.log('Codes:' + data);
    return data;
  });
};

/*
model.getAccessToken = function (bearerToken, callback) {
  db.hgetall(util.format(keys.token, bearerToken), function (err, token) {
if (err){console.log(err); return callback(err);}
        if (!token){ return callback();}
        callback(null, {
          accessToken: token.accessToken,
          clientId: token.clientId,
          expires: token.expires ? new Date(token.expires) : null,
          userId: token.userId
        });
      });
    };
model.getUserFromClient = function (clientId, clientSecret, callback) {
  db.hgetall(util.format(keys.client, clientId), function (err, client) {
    if (err) return callback(err);
    if (!client || client.clientSecret !== clientSecret) return callback();
    callback(null, {
      clientId: client.clientId,
      clientSecret: client.clientSecret
    });
  });
};
model.getRefreshToken = function (bearerToken, callback) {
  db.hgetall(util.format(keys.refreshToken, bearerToken), function (err, token) {
    if (err) return callback(err);
    if (!token) return callback();
    callback(null, {
      refreshToken: token.accessToken,
      clientId: token.clientId,
      expires: token.expires ? new Date(token.expires) : null,
      userId: token.userId
    });
  });
};
model.grantTypeAllowed = function (clientId, grantType, callback) {
  db.sismember(util.format(keys.grantTypes, clientId), grantType, callback);
};
model.saveAccessToken = function (accessToken, clientId, expires, user, callback) {
  db.hmset(util.format(keys.token, accessToken), {
    accessToken: accessToken,
    clientId: clientId,
    expires: expires ? expires.toISOString() : null,
    userId: user.id? user.id : ''
  }, callback);
};
model.saveRefreshToken = function (refreshToken, clientId, expires, user, callback) {
  db.hmset(util.format(keys.refreshToken, refreshToken), {
    refreshToken: refreshToken,
    clientId: clientId,
    expires: expires ? expires.toISOString() : null,
    userId: user.id? user.id: ''
  }, callback);
};
model.getUser = function (username, password, callback) {
  db.hgetall(util.format(keys.user, username), function (err, user) {
    if (err) return callback(err);
    if (!user || password !== user.password) return callback();
    callback(null, {
      id: username
    });
  });
};
*/
