import * as productModel from '../models/productModel.js';

export const getAllProducts = async () => {
  try {
    return await productModel.getAllProducts();
  } catch (error) {
    console.error('Service error - get all products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    return await productModel.getProductById(id);
  } catch (error) {
    console.error('Service error - get product by ID:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    return await productModel.createProduct(productData);
  } catch (error) {
    console.error('Service error - create product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    return await productModel.updateProduct(id, productData);
  } catch (error) {
    console.error('Service error - update product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await productModel.deleteProduct(id);
  } catch (error) {
    console.error('Service error - delete product:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    return await productModel.getProductsByCategory(categoryId);
  } catch (error) {
    console.error('Service error - get products by category:', error);
    throw error;
  }
};