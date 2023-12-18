const express = require("express");
const router = express.Router();
const pool = require('./db');


router.get("/search", async (req, res) => {
    const searchTerm = req.query.q;

    try {
        const searchResults = await searchProducts(searchTerm);

        // Send the search results as JSON
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define the searchProducts function to perform the database query
async function searchProducts(searchTerm) {
    try {
        const { rows } = await pool.query(
            'SELECT name, price FROM products WHERE LOWER(name) LIKE LOWER($1)',
            [`%${searchTerm}%`]
        );

        return rows;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error; // Re-throw the error for the calling function to handle
    }
}

// Export the router to be used in your main server file
module.exports = router;