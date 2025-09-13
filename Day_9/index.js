// 1️⃣ Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');

// 2️⃣ Setup Express app
const app = express();
const PORT = 3000;

// 3️⃣ MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// 4️⃣ Async function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    // 5️⃣ Create/use database and collection
    const db = client.db('resumeData');
    const collection = db.collection('profiles');

    // 6️⃣ Insert sample data
    await collection.insertOne({
      name: 'Adarsh Bhardwaj',
      skills: ['Express.js', 'MongoDB', 'Node.js'],
      createdAt: new Date()
    });

    console.log('📄 Sample data inserted into resumeData.profiles');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

// 7️⃣ Call the DB connection function
connectDB();

// 8️⃣ Setup basic route
app.get('/', (req, res) => {
  res.send('🚀 Server is running & MongoDB connected');
});

// 9️⃣ Start the server
app.listen(PORT, () => {
  console.log(`🌐 Server listening on http://localhost:${PORT}`);
});
