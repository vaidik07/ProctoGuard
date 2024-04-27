const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const logFilePath = "C:/Squid/var/log/squid/access.log";
let filePosition = 0; // Track the last read position in the file

// Create a WebSocket server on port 3000
const wss = new WebSocket.Server({ port: 3000 });

// Function to read new updates from the log file and send to clients
function sendNewLogUpdates(ws) {
  const fileStream = fs.createReadStream(logFilePath, { start: filePosition });

  fileStream.on('data', (chunk) => {
    ws.send(chunk.toString()); // Send new log data to client
  });

  fileStream.on('error', (err) => {
    console.error('Error reading log file:', err);
  });

  fileStream.on('end', () => {
    filePosition = fs.statSync(logFilePath).size; // Update file position after reading
  });
}

// WebSocket server event handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial log file contents when a client connects
  sendNewLogUpdates(ws);

  // WebSocket message handling (optional)
  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    // You can handle client messages here if needed
  });

  // WebSocket close handling
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Watch the log file for changes
fs.watch(logFilePath, (eventType, filename) => {
  if (eventType === 'change') {
    console.log('Log file changed, sending update to clients');
    // Broadcast new log updates to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        sendNewLogUpdates(client);
      }
    });
  }
});
