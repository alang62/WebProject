const { Router } = require("express");
const controller = require("./controller");
const router = Router();
const express = require('express');
const pool = require('./db');

router.get("/", controller.getProducts);
router.get("/:id", controller.getCategory);
router.post("/", controller.addProduct);
router.get("/:id", controller.getProductById);
router.delete("/:id", controller.deleteProductById);
router.put("/:id", controller.updateProduct);

//Route for rendering webpages
router.get("/index", (req, res) => {
    res.render("index");
});

router.get("/products/1", (req, res) => {
    res.render("flowers");
});

router.get("/products/2", (req, res) => {
    res.render("fruits");
});

router.get("/products/3", (req, res) => {
    res.render("herbs");
});

router.get("/products/4", (req, res) => {
    res.render("veggies");
});

router.get('/api/v1/products/:category_id', async (req, res) => {
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
  
module.exports = router;