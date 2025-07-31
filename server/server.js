const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('../products.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Error connecting to DB:", err.message);
  } else {
    console.log('Connected to products.db');
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products LIMIT 100', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

