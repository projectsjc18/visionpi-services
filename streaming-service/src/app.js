var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const db = require('./config/db');
var Customers = require('./models/customer');
var service = require('./services/service');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Get all clients
Customers.find({}, function(error, customers){
  customers.forEach(function(customer) {
    customers.messages.forEach(function(message){
      if(message.type === 'receive'){
        service.message(customer);
      }else if(message.type === 'receive'){
        service.video(customer);
      }
    });
  });
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  /*
  socket.on('data', function (data) {
    //console.log(data);
    socket.broadcast.emit('data', data);
	});

  socket.on('video', function (data) {
	    socket.broadcast.emit('video', data);
	});
  */

});

http.listen(5678, function(){
  console.log('listening on *:5678');
});
