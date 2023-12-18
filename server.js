//server.js
const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const path = require('path');
const productRoutes = require('./src/product/routes');
const searchRoutes = require('./src/product/searchRoutes');
const app = express();
const port = process.env.PORT || 5432;
const pool = require('./src/product/db');

app.set("view engine", "ejs");

// Use the productRoutes
app.use('/api', productRoutes);
app.use('/api', searchRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(express.json());


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

app.get("/support", (req, res) => {
  res.render("support");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.post('/cart/add', async (req, res) => {
  try {
    const { name, price } = req.body;
    console.log('Data received:', { name, price } );

    const result = await pool.query(
      'INSERT INTO cart (name, price) SELECT name, price FROM products WHERE name = $1 RETURNING name, price',
      [name]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all items in the cart
app.get('/cart', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cart');

    res.json(rows);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/cart/remove', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name parameter is required' });
    }

    // Use a CTE to select and delete one item with the specified name from the cart
    const queryResult = await pool.query(
      'WITH deleted_rows AS (DELETE FROM cart WHERE name = $1 RETURNING *) DELETE FROM cart USING deleted_rows WHERE cart.cart_id = deleted_rows.cart_id RETURNING *',
      [name]
    );

    if (queryResult.rowCount > 0) {
      // Item was successfully removed
      const deletedItem = queryResult.rows[0];
      res.json({ success: true, message: 'Item removed from cart', removedItem: deletedItem });
    } else {
      // No matching item found
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;

    // Your logic to fetch and return filtered products from the database
    const { rows } = await pool.query(
      'SELECT name, price FROM products WHERE LOWER(name) LIKE LOWER($1)',
      [`%${searchTerm}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
