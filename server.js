const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// Allow cross-origin (so the frontend can fetch from the backend)
app.use(cors());
// Parse JSON in request bodies
app.use(express.json());

// Serve everything in the "public" folder?
app.use(express.static(path.join(__dirname, 'public')));


const DATA_FILE = './data.json'; // store tasks here

// GET tasks
app.get('/api/tasks', (req, res) => {
  fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read data file' });
    }
    const tasks = JSON.parse(data);
    res.json(tasks);
  });
});

// POST new task
app.post('/api/tasks', (req, res) => {
  fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read data file' });
    }
    let tasks = JSON.parse(data);
    const newTask = {
      id: Date.now(), // simplistic ID
      title: req.body.title,
      status: req.body.status || 'red',
      scheduledDate: req.body.scheduledDate || null,
      description: req.body.description || ''
    };
    tasks.push(newTask);
    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not write data file' });
      }
      res.json(newTask);
    });
  });
});

// PUT edit task
app.put('/api/tasks/:id', (req, res) => {
  fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read data file' });
    }
    let tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id, 10));
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not write data file' });
      }
      res.json(tasks[taskIndex]);
    });
  });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read data file' });
    }
    let tasks = JSON.parse(data);
    const newTasks = tasks.filter(t => t.id !== parseInt(req.params.id, 10));
    fs.writeFile(DATA_FILE, JSON.stringify(newTasks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not write data file' });
      }
      res.json({ success: true });
    });
  });
});

// Start server
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/*
// Allow cross-origin (so the frontend can fetch from the backend)
app.use(cors());

// Parse JSON in request bodies
app.use(express.json());

// Serve everything in the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ... your existing API routes like:
// app.get('/api/tasks', (req, res) => { ... });
// app.post('/api/tasks', (req, res) => { ... });
// etc.

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
*/