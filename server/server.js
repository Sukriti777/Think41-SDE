const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to products.db
const db = new sqlite3.Database('../products.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Error connecting to DB:", err.message);
  } else {
    console.log('Connected to products.db');
  }
});

// ------------------------ PRODUCTS API ------------------------

// GET /api/products
app.get('/api/products', (req, res) => {
  const query = `
    SELECT products.*, departments.name AS department_name
    FROM products
    JOIN departments ON products.department_id = departments.id
    LIMIT 100
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const query = `
    SELECT products.*, departments.name AS department_name
    FROM products
    JOIN departments ON products.department_id = departments.id
    WHERE products.id = ?
  `;
  db.get(query, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

// ------------------------ DEPARTMENTS API ------------------------

// GET /api/departments → List all departments with product counts
app.get('/api/departments', (req, res) => {
  const query = `
    SELECT departments.id, departments.name, COUNT(products.id) AS product_count
    FROM departments
    LEFT JOIN products ON departments.id = products.department_id
    GROUP BY departments.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ departments: rows });
  });
});

// GET /api/departments/:id → Get specific department
app.get('/api/departments/:id', (req, res) => {
  db.get('SELECT * FROM departments WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Department not found' });
    res.json(row);
  });
});

// GET /api/departments/:id/products → Get all products in a department
app.get('/api/departments/:id/products', (req, res) => {
  const deptId = req.params.id;

  db.get('SELECT name FROM departments WHERE id = ?', [deptId], (err, deptRow) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!deptRow) return res.status(404).json({ error: 'Department not found' });

    const query = `
      SELECT products.*, departments.name AS department_name
      FROM products
      JOIN departments ON products.department_id = departments.id
      WHERE departments.id = ?
    `;
    db.all(query, [deptId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({
        department: deptRow.name,
        products: rows
      });
    });
  });
});

// ------------------------ START SERVER ------------------------

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});