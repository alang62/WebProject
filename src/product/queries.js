const getProducts = "SELECT * FROM products";
const getCategory = "SELECT name, price FROM products WHERE category_id = $1";
const getProductById = "SELECT * FROM products WHERE product_id = $1";
const checkNameExists = "SELECT s FROM products s WHERE s.name = $1";
const addProduct = "INSERT INTO products (name, price) VALUES ($1, $2)";
const deleteProductById = "DELETE FROM products WHERE product_id = $1";
const updateProduct = "UPDATE products SET name = $1, price = $2 WHERE product_id = $3";

module.exports = {
    getProducts,
    getCategory,
    getProductById,
    checkNameExists,
    addProduct,
    deleteProductById,
    updateProduct,
};