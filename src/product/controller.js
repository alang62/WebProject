const pool = require("./db");
const queries = require('./queries');

const getProducts = async (req, res) => {
    try {
        const products = await queries.getProducts();
        res.status(200).json(products);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    };

const getProductById = (req,res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getProductById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getCategory = (req, res) => {
    const id = req.params.id;
    pool.query(queries.getCategory, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};



const addProduct = (req, res) => {
    const { name, price } = req.body;

    pool.query(queries.checkNameExists, [name], (error, results) => {
        if (error) {
            console.error("Error checking name existence:", error);
            return res.status(500).send("Internal Server Error");
        }
        if (results.rows.length !== 0) {
            return res.status(400).send("Name already exists.");
        }

        pool.query(queries.addProduct, [name, price], (error, results) => {
            if (error) {
                console.error("Error adding product:", error);
                return res.status(500).send("Internal Server Error");
            }

            res.status(201).send("Product created successfully.");
        });
    });
};

const deleteProductById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getProductById, [id], (error, results) => {
        const noProductFound = !results.rows.length;
        if (noProductFound) {
            res.send("Product not found in db.");
        }
        
        pool.query(queries.deleteProductById, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Product successfully deleted.");
        });
    });
};

const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;

    pool.query(queries.getProductById, [id], (error, results) => {
        const noProductFound = !results.rows.length;
        if (noProductFound) {
            res.send("Product not found in db.");
        }
         pool.query(queries.updateProduct, [name, price, id, id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Product successfully updated.");
         });
    })
};

async function searchProducts(req, res) {
    const searchTerm = req.query.q;
  
    try {
      const { rows } = await pool.query(
        'x',
        [`%${searchTerm}%`]
      );
  
      res.json(rows);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports = {
    getProducts,
    getCategory,
    getProductById,
    addProduct,
    deleteProductById,
    updateProduct,
    searchProducts,
};