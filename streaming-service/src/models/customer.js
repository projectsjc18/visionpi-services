// Load required packages
var mongoose = require('mongoose');
// Define our messages schema
var MessagesSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String }
})
// Define our customer schema
var CustomersSchema = new mongoose.Schema({
  customer: { type: String },
  namespace: { type: String },
  messages: [MessagesSchema],
  password: { type: String },
  username: { type: String }
});
// Export the Mongoose model
module.exports = mongoose.model('Customers', CustomersSchema);
