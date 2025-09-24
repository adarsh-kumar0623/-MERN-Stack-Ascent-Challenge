const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB connection
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'resumeData';
let db;

// Middleware to parse JSON
app.use(express.json());

// ------------------- ROUTES ------------------- //

// Root route
app.get('/', (req, res) => {
  res.send('✅ Server is running! Use /api/projects for CRUD operations.');
});

// CREATE project - POST /api/projects
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;

    // Validation
    if (!projectData.title || !projectData.description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    // Add timestamps
    projectData.createdAt = new Date();
    projectData.updatedAt = new Date();

    const result = await db.collection('projects').insertOne(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { ...projectData, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
});

// READ all projects - GET /api/projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.collection('projects').find({}).toArray();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve projects' });
  }
});

// UPDATE project - PUT /api/projects/:id
app.put('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    updates.updatedAt = new Date();

    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.status(201).json({ success: true, message: 'Project updated successfully', modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ success: false, error: 'Invalid ID or request' });
  }
});

// DELETE project - DELETE /api/projects/:id
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(400).json({ success: false, error: 'Invalid ID' });
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
