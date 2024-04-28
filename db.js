const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://vaidikparashar:admin@cluster0.z7dnfok.mongodb.net/ProctoGuard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Define a schema for the system_no collection
const systemNoSchema = new mongoose.Schema({
  ip_address: { type: String, required: true, unique: true },
  system_no: { type: Number, required: true },
});

// Create a model based on the schema
const SystemNo = mongoose.model('SystemNo', systemNoSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Route to handle search POST requests
app.post('/search', async (req, res) => {
  const { ipAddress } = req.body;

  try {
    const result = await SystemNo.findOne({ ip_address: ipAddress });
    if (result) {
      res.json({ systemNo: result.system_no });
    } else {
      res.json({ systemNo: null });
    }
  } catch (error) {
    console.error('Error searching by IP address:', error);
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
