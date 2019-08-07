const { subscriberEventEmitter } = require('./subscriber');

function addSocket(httpServer) {
  const io = require('socket.io')(httpServer);

  io.on('connection', function(socket) {
    console.log('Connect!');
  });

  subscriberEventEmitter.on('NewGame', (address, host) => {
    io.emit('NewGame', {address, host});
  });
}


module.exports = addSocket;
