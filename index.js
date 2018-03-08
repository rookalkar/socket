// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Start server
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
 .listen(PORT, () => console.log("Listening on localhost:" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);

// Register "connection" events to the WebSocket
io.on("connection", function(socket) {
  // Register "join" events, requested by a connected client
  socket.on("join", function (room) {
    // join channel provided by client
    socket.join(room)
    // Register "image" events, sent by the client
    socket.on("rotate", function(msg) {
      // Broadcast the "image" event to all other clients in the room
      socket.broadcast.to(room).emit("rotate", msg);
    });
    socket.on("test", function(msg) {
      // Broadcast the "image" event to all other clients in the room
      socket.broadcast.to(room).emit("test", msg);
    });
    socket.on("cameraChange", function(msg) {
      // Broadcast the "image" event to all other clients in the room
      socket.broadcast.to(room).emit("cameraChange", msg);
    });
    socket.on("translate", function(msg) {
      // Broadcast the "image" event to all other clients in the room
      socket.broadcast.to(room).emit("translate", msg);
    });
  })
});
