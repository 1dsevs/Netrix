import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';

// Initialize WebSocket server on port 3000
const io = new Server(3000);

// Constants
const adminPassRequest = "adminpassrequest";

// MongoDB client and collection variables
const client = new MongoClient('mongodb://localhost:27017');
let collection;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('Users');
    collection = db.collection('Admins');

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Wait for MongoDB to connect first, then start listening for socket connections
connectToMongoDB().then(() => {
  io.on('connection', socket => {
    console.log('Client connected');

    socket.on('message', async message => {
      console.log('Received message:', message);

      try {
        const packet = JSON.parse(message);

        const { request_data, payload } = packet;

        switch(request_data) {
          case adminPassRequest:
            // Check if password matches any admin document
            try {
              const admin = await collection.findOne({ password: payload });
              const signInStatus = !!admin;
              // Send back an event with the result
              socket.emit('adminpassresponse', { success: signInStatus });
            } catch (dbErr) {
              console.error('DB query error:', dbErr);
              socket.emit('adminpassresponse', { success: false });
            }
            break;

          default:
            console.log('Invalid request data:', request_data);
            socket.emit('error', { message: 'Invalid request' });
        }

      } catch (err) {
        console.error('Failed to parse message:', err);
        socket.emit('error', { message: 'Invalid JSON format' });
      }
    });
  });
});
