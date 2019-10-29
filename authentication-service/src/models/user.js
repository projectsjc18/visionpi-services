// Load required packages
var mongoose = require('mongoose');
// Define our client schema
var OAuthUsersSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String }
});
// Export the Mongoose model
module.exports = mongoose.model('OAuthUsers', OAuthUsersSchema);
