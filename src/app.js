const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticate');
const pool = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(express.static(path.join(__dirname, '..', 'public')));

// Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/tourism', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tourism.html'));
});

app.get('/scholarships', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'scholarships.html'));
});

// Protected route example
app.get('/protected', authenticate, (req, res) => {
  res.send('This is a protected route');
});

// API Routes for News Articles
app.get('/api/index', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news_articles ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

app.get('/api/index/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM news_articles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

app.post('/api/index', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO news_articles (title, content, created_at) VALUES ($1, $2, NOW()) RETURNING *', 
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

app.put('/api/index/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const result = await pool.query(
      'UPDATE news_articles SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *', 
      [title, content, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

app.delete('/api/index/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM news_articles WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// API Routes for Tourism
app.get('/api/tourism', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tourism ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// API Routes for Scholarships
app.get('/api/scholarships', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scholarships ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: '404: Page Not Found' });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});
