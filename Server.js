// initialise websockets on port 3000
const io = require('socket.io')(3000);

// declare constants
const adminpass_request = "adminpassrequest";

//initialise mongoDB connection
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();

io.on('connection', socket => {
  console.log('Client connected');

  // Listen for messages from the client
  socket.on('message', message => {
    console.log('Received message:', message);

    const packet = JSON.parse(message);

    // Read the request_data value
    const { request_data } = packet;
    console.log('Request data:', request_data);

    // Read the payload value
    const { payload } = packet;
    console.log('Payload:', payload);
    
    switch(request_data)
    {
        case(adminpass_request):
            administrators.findOne({password: payload}, (err, document) => {

                if (document) {
                    const sign_in_status = true;
                }
                else {
                    const sign_in_status = false;
                }}); 
            socket.emit(sign_in_status);
    }
    socket.emit('response', 'Hello from the server!');
  });
});
