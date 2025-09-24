const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB connection
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'resumeData';
let db;

// Middleware for parsing JSON
app.use(express.json());

// ------------------- ROUTES ------------------- //

// Root route - GET /
app.get('/', (req, res) => {
  res.send('✅ Server is running! Use /api/projects to GET or POST data.');
});

// CREATE project - POST /api/projects
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;

    // Validation
    if (!projectData.title || !projectData.description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    // Add timestamps
    projectData.createdAt = new Date();
    projectData.updatedAt = new Date();

    // Insert into MongoDB
    const result = await db.collection('projects').insertOne(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { ...projectData, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// READ all projects - GET /api/projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.collection('projects').find({}).toArray();
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve projects'
    });
  }
});

// ------------------- CONNECT TO MONGO & START SERVER ------------------- //
MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));
