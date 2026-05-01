// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CSS312',
  password: '123',
  port: 5433,
});

// CREATE TABLES
pool.query(`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price NUMERIC(10, 2),
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  )
`, (err) => {
  if (err) console.error('Products table creation error:', err);
  else console.log('Products table ready.');
});

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  )
`, (err) => {
  if (err) console.error('Users table creation error:', err);
  else console.log('Users table ready.');
});

pool.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    card_number VARCHAR(20),
    card_holder VARCHAR(100),
    expiry VARCHAR(10),
    amount NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
  )
`, (err) => {
  if (err) console.error('Orders table creation error:', err);
  else console.log('Orders table ready.');
});

pool.query(`
  CREATE TABLE IF NOT EXISTS finance_records (
    id SERIAL PRIMARY KEY,
    card_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(20) NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0,
    credit_limit NUMERIC(12, 2) DEFAULT 1000,
    used_credit NUMERIC(12, 2) DEFAULT 0,
    expiry VARCHAR(10),
    notify_services BOOLEAN DEFAULT false,
    category VARCHAR(100),
    category_amount NUMERIC(12, 2) DEFAULT 0,
    category_percent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )
`, (err) => {
  if (err) console.error('Table creation error:', err);
  else console.log('Finance table ready.');
});

// ==================== PRODUCTS ENDPOINTS ====================
// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_featured = true LIMIT 4');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET best sellers
app.get('/api/products/bestsellers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_best_seller = true LIMIT 4');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new product
app.post('/api/products', async (req, res) => {
  const { name, category, price, image_url, is_featured, is_best_seller } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, category, price, image_url, is_featured, is_best_seller) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, category, price, image_url, is_featured || false, is_best_seller || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== USERS ENDPOINTS ====================
// POST register user
app.post('/api/users/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1,$2,$3) RETURNING id, email, name',
      [email, password, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST login user
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE email=$1 AND password=$2',
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ORDERS ENDPOINTS ====================
// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new order
app.post('/api/orders', async (req, res) => {
  const { user_id, card_number, card_holder, expiry, amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, card_number, card_holder, expiry, amount) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [user_id, card_number, card_holder, expiry, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== FINANCE ENDPOINTS ====================
// CREATE - POST /finance
app.post('/finance', async (req, res) => {
  const {
    card_name, card_number, balance, credit_limit,
    used_credit, expiry, notify_services,
    category, category_amount, category_percent
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO finance_records 
        (card_name, card_number, balance, credit_limit, used_credit, expiry, notify_services, category, category_amount, category_percent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [card_name, card_number, balance, credit_limit, used_credit, expiry, notify_services, category, category_amount, category_percent]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL - GET /finance
app.get('/transactions', async (req, res) => {
    try {
        const allEntries = await pool.query("SELECT * FROM finance_records");
        res.json(allEntries.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Серверийн алдаа");
    }
});

// READ ONE - GET /finance/:id
app.get('/finance/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance_records WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - PUT /finance/:id
app.put('/finance/:id', async (req, res) => {
  const {
    card_name, card_number, balance, credit_limit,
    used_credit, expiry, notify_services,
    category, category_amount, category_percent
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE finance_records SET
        card_name=$1, card_number=$2, balance=$3, credit_limit=$4,
        used_credit=$5, expiry=$6, notify_services=$7,
        category=$8, category_amount=$9, category_percent=$10
       WHERE id=$11 RETURNING *`,
      [card_name, card_number, balance, credit_limit, used_credit, expiry, notify_services, category, category_amount, category_percent, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - DELETE /finance/:id
app.delete('/finance/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM finance_records WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully', record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
