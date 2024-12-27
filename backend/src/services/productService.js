const Product = require('../models/Product');

exports.getAllProducts = async () => {
  return await Product.getAllProducts();
};

exports.getProductById = async (id) => {
  const product = await Product.getProductById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

exports.updateStock = async (id, stock) => {
  await Product.updateStock(id, stock);
};
