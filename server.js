const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');


const logFilePath = "C:/Squid/var/log/squid/access.log";
let filePosition = 0; // Track the last read position in the file

// Create a WebSocket server on port 3000
const wss = new WebSocket.Server({ port: 3000 });

function extractIPAndLink(data) {
  const lines = data.split('\n'); // Split log data into lines
  const filteredData = lines.map(line => {
    const parts = line.split(/\s+/);
    const ipAddress = parts[2]; // Assuming IP address is at index 2
    const httpLink = parts[6]; // Assuming HTTP link is at index 6
    return { ipAddress, httpLink };
  });
  return filteredData;
}

// Function to read new updates from the log file and send to clients
function sendNewLogUpdates(ws) {
  const fileStream = fs.createReadStream(logFilePath, { start: filePosition });

  fileStream.on('data', (chunk) => {
    const logData = chunk.toString(); // Convert buffer to string
    const filteredData = extractIPAndLink(logData); // Filter and extract data
    ws.send(JSON.stringify(filteredData)); // Send filtered data to client
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