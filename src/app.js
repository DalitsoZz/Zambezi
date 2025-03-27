const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./middleware/logger'); // Import logger middleware
const authenticate = require('./middleware/authenticate'); // Import authenticate middleware
const pool = require('./config/db'); // Import PostgreSQL client
const cors = require('cors'); // Import CORS middleware

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable CORS

// Use middleware globally
app.use(logger); // Log every request

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route for /tourism
app.get('/tourism', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tourism.html'));
});

// Route for /scholarships
app.get('/scholarships', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'scholarships.html'));
});

// Example protected route
app.get('/protected', authenticate, (req, res) => {
  res.send('This is a protected route');
});

// CRUD Routes for News Articles
app.get('/api/index', async (req, res) => { // Changed route from /api/news to /api/index
  try {
    console.log('Fetching all news articles...');
    const result = await pool.query('SELECT * FROM news_articles');
    console.log('News articles fetched:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Database query error');
  }
});

app.get('/api/index/:id', async (req, res) => { // Changed route from /api/news/:id to /api/index/:id
  const { id } = req.params;
  try {
    console.log(`Fetching news article with ID: ${id}`);
    const result = await pool.query('SELECT * FROM news_articles WHERE id = $1', [id]);
    console.log('News article fetched:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Database query error');
  }
});

app.post('/api/index', async (req, res) => { // Changed route from /api/news to /api/index
  const { title, content } = req.body;
  try {
    console.log('Inserting new news article...');
    const result = await pool.query('INSERT INTO news_articles (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
    console.log('News article inserted:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Database query error');
  }
});

app.put('/api/index/:id', async (req, res) => { // Changed route from /api/news/:id to /api/index/:id
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    console.log(`Updating news article with ID: ${id}`);
    const result = await pool.query('UPDATE news_articles SET title = $1, content = $2 WHERE id = $3 RETURNING *', [title, content, id]);
    console.log('News article updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Database query error');
  }
});

app.delete('/api/index/:id', async (req, res) => { // Changed route from /api/news/:id to /api/index/:id
  const { id } = req.params;
  try {
    console.log(`Deleting news article with ID: ${id}`);
    await pool.query('DELETE FROM news_articles WHERE id = $1', [id]);
    console.log(`News article with ID: ${id} deleted`);
    res.status(204).send();
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Database query error');
  }
});

// CRUD Routes for Tourism
app.get('/api/tourism', async (req, res) => {
  try {
    console.log('Fetching all tourism entries...');
    const result = await pool.query('SELECT * FROM tourism');
    console.log('Tourism entries fetched:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Database query error');
  }
});

// CRUD Routes for Scholarships
app.get('/api/scholarships', async (req, res) => {
  try {
    console.log('Fetching all scholarships...');
    const result = await pool.query('SELECT * FROM scholarships');
    console.log('Scholarships fetched:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Database query error');
  }
});

// Handle 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).send('404: Page Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
