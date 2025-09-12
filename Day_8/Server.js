const express = require('express');
const app = express();
const PORT = 5471;
const projects = [
  {
    id: 1,
    title: 'Portfolio web',
    technologies: ['React', 'Node.js']
  },
  {
    id: 2,
    title: 'Fashion Engine Simulator',
    technologies: ['Vue.js', 'Express']
  },
  {
    id: 3,
    title: 'Chat bot',
    technologies: ['Gemini', 'Express', 'Jupyterlab']
  }
];
const workExperience = [
  {
    id: 1,
    company: 'TechCorp',
    position: 'Intern',
    year: '2023'
  },
  {
    id: 2,
    company: 'CodeBase',
    position: 'Backend Developer',
    year: '2024'
  }
];
app.get('/', (req, res) => {
  res.send(`<a href="/api/projects">Welcome to Adarsh's RESTful API!</a>`);
});
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});
app.get('/api/experience', (req, res) => {
  res.json({
    success: true,
    count: workExperience.length,
    data: workExperience
  });
});
app.get('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (project) {
    res.json({
      success: true,
      data: project
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
