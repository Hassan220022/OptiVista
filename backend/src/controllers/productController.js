const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.getProductById(id);
    if (!product) throw new Error('Product not found');
    res.json({ success: true, product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
