import { getAllProducts, getProductById } from '../services/productService.js';

export const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (!product) throw new Error('Product not found');
    res.json({ success: true, product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
