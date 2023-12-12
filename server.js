const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const path = require('path');
const productRoutes = require('./src/product/routes');
const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Use the productRoutes
app.use('/api/v1/products', productRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static('public'));

// Handle requests to the root URL ("/")

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/flowers", (req, res) => {
  res.render("flowers");
});

app.get("/fruits", (req, res) => {
  res.render("fruits");
});

app.get("/herbs", (req, res) => {
  res.render("herbs");
});

app.get("/veggies", (req, res) => {
  res.render("veggies");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get('/api/v1/products/:category_id', async (req, res) => {
  const { category_id } = req.params;

  try {
      const { rows } = await pool.query(
          'SELECT name, price FROM products WHERE category_id = $1',
          [category_id]
      );

      res.json(rows);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Any additional routes can be added here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
