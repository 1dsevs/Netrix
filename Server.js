const io = require('socket.io')(3000);
const adminpass_request = "adminpassrequest";

io.on('connection', socket => {
  console.log('Client connected');

  // Listen for messages from the client
  socket.on('message', message => {
    console.log('Received message:', message);
    
    switch(message){
        case(adminpass_request):
            socket.emit(admin_password);
    }
    socket.emit('response', 'Hello from the server!');
  });
});
