
/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'particles.json', function() {
    console.log('callback - particles.js config loaded');
  });

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
  
// for ejs p tag for system no.
  window.onload = function() {
    const systemNoParagraph = document.getElementById('systemNoParagraph');
    if (locals.systemNo ) {
        systemNoParagraph.remove();
    }
};

 
