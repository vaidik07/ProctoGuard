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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});