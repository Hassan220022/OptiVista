import { 
  getAllProducts as getAllProductsModel, 
  getProductById as getProductByIdModel, 
  updateStock as updateStockModel 
} from '../models/Product.js';

export const getAllProducts = async () => {
  return await getAllProductsModel();
};

export const getProductById = async (id) => {
  const product = await getProductByIdModel(id);
  if (!product) throw new Error('Product not found');
  return product;
};

export const updateStock = async (id, stock) => {
  await updateStockModel(id, stock);
};