/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'particles.json', function() {
    console.log('callback - particles.js config loaded');
  });




  // websocket code
  const ws = new WebSocket("ws://192.168.29.102:3000");

      // WebSocket event handling
      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        console.log("Received message from server:", event.data);
        // Handle received messages from the server (e.g., update UI)
        // Display file update in the HTML (append to logContainer)
        const logContainer = document.getElementById("logContainer");
        const logElement = document.createElement("div");
        logElement.textContent = event.data;
        logContainer.appendChild(logElement);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };