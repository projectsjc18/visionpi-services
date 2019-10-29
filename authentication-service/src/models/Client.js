// Load required packages
var mongoose = require('mongoose');

var OAuthClientsSchema = new mongoose.Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUris: { type: Array },
  grants: { type: Array }
})
// Export the Mongoose model
module.exports = mongoose.model('OAuthClients', OAuthClientsSchema);
