
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

      
      
//****************************************************Database**********************************



const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('dataForm');

document.addEventListener('DOMContentLoaded', () => {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission

    const ipAddress = searchInput.value.trim(); // Get the IP address from the input
    if (!ipAddress) {
      alert('Please enter an IP address to search.');
      return;
    }

    try {
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ipAddress })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.systemNo !== null) {
          alert(`System number for IP ${ipAddress}: ${data.systemNo}`);
        } else {
          alert(`No system found for IP ${ipAddress}.`);
        }
      } else {
        alert('Failed to search for IP address.');
      }
    } catch (error) {
      console.error('Error searching IP address:', error);
      alert('An error occurred while searching. Please try again.');
    }
  });
});
