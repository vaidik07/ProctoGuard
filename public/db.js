const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
// const port = 3000;



// Reference to public folder for all static files
app.use(express.static("public"));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.get('/monitor', (req, res) => {
    res.render("monitor.ejs");
});

app.get('/system', (req, res) => {
    res.render("system.ejs");
});



// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://vaidikparashar:admin@cluster0.z7dnfok.mongodb.net/')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Define a schema for the system_no collection
const systemNoSchema = new mongoose.Schema({
  ip_address: String,
  system_no: String,
});

// Create a model based on the schema
const SystemNo = mongoose.model('SystemNo', systemNoSchema);

// Middleware to parse JSON requests
//app.use(express.json());

// Route to handle search POST requests
app.post('/search', async (req, res) => {
  const { ipAddress } = req.body;
  //ipAddress.toString();
  try {
    const result = await SystemNo.findOne({ ip_address: ipAddress });
    if (result) {
      res.json({ systemNo: result.system_no });
    } else {
      console.log("System not found");
    }
  } catch (error) {
    console.error('Error searching by IP address:', error);
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
});

//adding element to DB

app.post('/add', async (req, res) => {
  const { ipAddress, systemNo } = req.body;

  try {
    // Check if IP address already exists
    const existingSystem = await SystemNo.findOne({ ip_address: ipAddress });
    if (existingSystem) {
      return res.status(400).json({ error: 'IP address already exists in the database.' });
    }

    // Create a new document with the IP address and system number
    const newSystem = new SystemNo({ ip_address: ipAddress, system_no: systemNo });
    await newSystem.save();

    res.status(201).json({ message: 'IP address and system number added successfully.' });
  } catch (error) {
    console.error('Error adding IP address and system number:', error);
    res.status(500).json({ error: 'An error occurred while adding IP address and system number.' });
  }
});

//delete element from DB 

app.post('/delete', async (req, res) => {
  const { ipAddress, systemNo } = req.body;

  try {
    // Check if the system with the given IP address and system number exists
    const existingSystem = await SystemNo.findOne({ ip_address: ipAddress, system_no: systemNo });

    if (!existingSystem) {
      // If the system doesn't exist, return a 404 error
      return res.status(404).json({ error: 'System not found.' });
    }

    // Delete the system from the database
    await SystemNo.deleteOne({ ip_address: ipAddress, system_no: systemNo });

    // Send a success message back to the client
    res.status(200).json({ message: 'System deleted successfully.' });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error('Error deleting system:', error);
    res.status(500).json({ error: 'An error occurred while deleting the system.' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});