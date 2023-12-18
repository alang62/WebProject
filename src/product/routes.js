//routes.js
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
router.get("/cart", (req, res) => {
    res.json(cart);
});

module.exports = router;