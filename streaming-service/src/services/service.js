module.exports.message = function(io, customer) {
  io.of(`/${customer.namespace}_${customer.customer}`)
    .on('connection', function (socket) {
      socket.on('data', function (data) {
        //console.log(data);
        socket.broadcast.emit('data', data);
    	});
    });
}


module.exports.video = function(io, customer) {
  io.of(`/${customer.namespace}_${customer.customer}`)
    .on('connection', function (socket) {
      socket.on('video', function (data) {
    	    socket.emit('video', data);
    	});
    });
}
